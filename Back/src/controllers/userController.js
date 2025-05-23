import { User } from "../models/association.js";
import { generateJwtToken, hash, refreshJwtToken, verifyJwtToken, verifyRefreshToken, generateResetPasswordToken } from "../utils/crypto.js";
import { compare } from "../utils/crypto.js";
import { getTransporter } from "../utils/nodemailer.js";
import "dotenv/config";

const userController = {
  /**
   * Crée un nouvel utilisateur après vérification de l'unicité de l'email.
   * @async
   * @function createOneUser
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async createOneUser(req, res, next) {
    // on récupère les informations envoyées par l'utilisateur dans la requête
    const { pseudo, email, password } = req.body;
    // on vérifie si un utilisateur avec le même email existe déjà dans la base de données
    const existingUser = await User.findOne({ where: { email } });
    // Si c’est le cas, on bloque la création et on retourne une erreur 409 (conflit)
    if (existingUser) {
      const error = new Error("Email déja pris"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 409; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["il semble que l'adresse email proposé soit déjà utilisé"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Si l'email est libre, on crée un nouvel utilisateur
    // Avant de sauvegarder le mot de passe, on le chiffre avec une fonction de hash
    const user = await User.create({
      pseudo,
      email,
      password: await hash(password),
    });
    // Une fois l’utilisateur créé, on renvoie une réponse avec le statut 201 (créé)
    // On peut aussi renvoyer l’ID du nouvel utilisateur (utile côté client)
    res.status(201).json({ status: 201, userId: user.id });
  },

  /**
   * Génère un nouveau token d'accès à partir d'un refresh token valide.
   * @async
   * @function generateRefreshToken
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async generateRefreshToken(req, res, next) {
    //Il va chercher le refreshToken existant dans les cookies
    const refreshToken = req.cookies?.refreshToken; // refreshToken c'est le nom qu'on lui a donné à la création
    //Si le refreshToken n'existe pas ( dans ce cas présent, ça veut dire que la personne ne s'est pas connectée depuis + de 7 jours), alors on renvoie une erreur
    if (!refreshToken) {
      const error = new Error("Refresh token manquant"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 401; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun refresh token trouvé dans les cookies"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    //Si le refreshToken existe, on le decode et on verifie le mot de passe du .env
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      const error = new Error("Refresh token invalide ou expiré"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 403; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Impossible de valider le refresh token"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }

    //Ensuite, on va chercher les infos de l'user associé au refresh token correspondant dans la BDD
    // Il trouve l'user dans la BDD par l'id du user dans le payload
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      const error = new Error("Utilisateur non trouvé");
      error.statusCode = 401; // Unauthorized
      error.details = ["Aucun utilisateur associé à ce token"];
      return next(error);
    }
    //Et enfin on génére un nouvel accessToken valable 15 min
    const newAccessToken = generateJwtToken({
      userId: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    });
    // Et on le retourne
    return res.json({ token: newAccessToken });
  },

  /**
   * Authentifie un utilisateur et génère les tokens d'accès et de rafraîchissement.
   * @async
   * @function login
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async login(req, res, next) {
    // Je récupère l'email et le mot de passe envoyés par l'utilisateur dans la requête
    const { email, password } = req.body;
    // Je cherche un utilisateur dans la base de données qui correspond à l'email fourni
    const user = await User.findOne({ where: { email } });
    // Vérifie à la fois si l'utilisateur existe ET si le mot de passe est correct
    const isValid = user && (await compare(password, user.password));
    if (!isValid) {
      const error = new Error("Identifiants invalides"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 401; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que l'email ou le mot de passe ne correspondent pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Si les identifiants sont bons, on génère un token JWT contenant quelques infos utiles de l'utilisateur
    const accessToken = generateJwtToken({
      userId: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    });

    // on génère un refresh token valable 7 jours
    const refreshToken = refreshJwtToken({
      userId: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    });

    // on stocke le refresh token dans un cookie HTTP-only
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Ce cookie ne sera pas accessible en JavaScript côté client
      secure: process.env.NODE_ENV === "production", // Si en production, le cookie sera sécurisé (HTTPS) == sera true. Sinon false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Protéger contre les attaques CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration dans 7 jours
    });

    console.log("Cookie envoyé :", res.getHeader("Set-Cookie"));
    // on envoie le token au client, il pourra le stocker pour s'authentifier plus tard
    return res.json({
      token: accessToken,
      pseudo: user.pseudo,
      id: user.id,
    });
  },

  /**
   * Modifie les informations d'un utilisateur (pseudo, email, mot de passe).
   * @async
   * @function modifyOneUser
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async modifyOneUser(req, res, next) {
    // on récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const userId = req.params.id;
    //  on extrait les champs modifiables depuis le corps de la requête
    const { pseudo, email, password } = req.body;
    // Vérifie si l'utilisateur avec cet ID existe dans la base

    const user = await User.findByPk(userId);
    // Si l'utilisateur n'existe pas, on renvoie une erreur 404 (non trouvé)
    if (!user) {
      const error = new Error("Utilisateur non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun utilisateur avec cet ID"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }

    // Si un email est fourni, on vérifie qu’il n’est pas déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ where: { email } });

      // Si un autre utilisateur utilise déjà cet email, on refuse la modification
      if (existingUser && existingUser.id !== Number(userId)) {
        const error = new Error("Email déja pris"); // On crée l'instance d'erreur avec message personnalisé
        error.statusCode = 409; // On lui attribue un code HTTP qui fera appel à errorMessages
        error.details = ["Il semble que l'adresse email proposée soit déjà utilisée par un autre utilisateur"]; // On lui attribue un tableau de détails
        return next(error); // On la passe au middleware d'erreur
      }
      //Si tout est bon, on met à jour l'email
      user.email = email;
    }
    // Si un pseudo est fourni, on met à jour le champ
    if (pseudo) user.pseudo = pseudo;
    //Si un mot de passe est fourni, on le hash avant de le stocker
    if (password) user.password = await hash(password);
    //Sauvegarde les modifications dans la base de données
    await user.save();

    // Génère un nouveau token mis à jour
    const newAccessToken = generateJwtToken({
      userId: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    });
    // Génère une nouveau refreshToken mis à jour
    const newRefreshToken = refreshJwtToken({
      userId: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    });
    // On envoie le refresh token dans le cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true, // Ce cookie ne sera pas accessible en JavaScript côté client
      secure: process.env.NODE_ENV === "production", // Si en production, le cookie sera sécurisé (HTTPS) == sera true. Sinon false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Protéger contre les attaques CSRF (cross-site request forgery)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration dans 7 jours
    });

    // Réponse avec un message de succès, l'ID de l'utilisateur et son nouveau token
    res.status(200).json({ message: "Utilisateur modifié avec succès", token: newAccessToken });
  },

  /**
   * Supprime un utilisateur par son ID.
   * @async
   * @function deleteOneUser
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async deleteOneUser(req, res, next) {
    console.log("je suis là");
    // on récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const userId = req.params.id;
    // Vérifie si l'utilisateur avec cet ID existe dans la base
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("Utilisateur non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun utilisateur avec cet ID"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    await user.destroy(); // on detruit le user dans la BDD
    res.status(200).json({ message: "Utilisateur supprimé avec succès" }); // On renvoie un message de succès
  },

  /**
   * Déconnecte l'utilisateur en supprimant le refresh token du cookie.
   * @function logout
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {void}
   */
  logout(req, res) {
    // Ici, côté serveur, on doit juste s'occuper de détruire le refreshToken stocké dans les cookies

    res.clearCookie("refreshToken", {
      httpOnly: true, // Toujours pas accessible en JS par une attaque XSS
      secure: process.env.NODE_ENV === "production", // Si en production, le cookie sera sécurisé (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Protéger contre les attaques CSRF (cross-site request forgery)
      maxAge: 0, // à 0 pour supprimer le cookie immédiatement
    });
    // console.log("Je suis dans la route Back");

    res.json({ message: "Déconnexion réussie." }); // On renvoie un message de succès
  },

  /**
   * Envoie un email de réinitialisation de mot de passe à l'utilisateur.
   * @async
   * @function forgotPassword
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async forgotPassword(req, res, next) {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Si l'utilisateur n'existe pas, on renvoie une erreur 404 (non trouvé)
      const error = new Error("Utilisateur non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun utilisateur avec cet email"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    const token = generateResetPasswordToken({ userId: user.id });
    // Envoie l'email (exemple simple, à adapter avec ta config)
    const transporter = getTransporter();
    // On utilise la fonction getTransporter pour créer un transporteur Nodemailer
    await transporter.sendMail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `
    <div style="font-family: 'Nunito Sans', 'Segoe UI', sans-serif; background: #f6dcac; padding: 30px;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px; border: 2px solid #ca3b39;">
        <h2 style="color: #01204e; font-family: 'Oswald', Arial Black, sans-serif; margin-bottom: 16px;">Cines Délices</h2>
        <p style="color: #01204e; font-size: 1.1rem;">Bonjour,</p>
        <p style="color: #01204e;">Vous avez demandé à réinitialiser votre mot de passe.<br>
        Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.FRONT_URL}/reset-password/${token}"
             style="display: inline-block; padding: 14px 28px; background: #f85525; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; box-shadow: 0 2px 8px #faa968;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="font-size: 0.95em; color: #ca3b39;">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
        <hr style="border: none; border-top: 1px solid #faa968; margin: 24px 0;">
        <p style="font-size: 0.85em; color: #01204e;">Cinés Délices - Projet d'apothéose</p>
      </div>
    </div> 
  `,
    });
    res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." }); // On renvoie un message de succès
  },

  /**
   * Réinitialise le mot de passe avec un token valide.
   * @async
   * @function resetPassword
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async resetPassword(req, res, next) {
    // on récupère le token de réinitialisation et les nouveaux mots de passe
    const { newPassword, confirm } = req.body;
    const token = req.params.token;
    // on vérifie que le token est valide
    let payload;
    // on vérifie le token avec la fonction verifyJwtToken
    try {
      // on vérifie le token avec la fonction verifyJwtToken
      payload = verifyJwtToken(token);
    } catch {
      const error = new Error("Token invalide ou expiré"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 403; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Impossible de valider le token"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // On vérifie que l'utilisateur associé au token existe
    const user = await User.findByPk(payload.userId);
    if (!user) {
      const error = new Error("Utilisateur non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun utilisateur associé à ce token"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // On vérifie que les nouveaux mots de passe correspondent
    if (newPassword !== confirm) {
      const error = new Error("Les mots de passe ne correspondent pas"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 400; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Les mots de passe ne correspondent pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // on hash le nouveau mot de passe
    user.password = await hash(newPassword);
    // ici save plutôt que update car on a déjà l'instance de l'utilisateur avec findByPk
    await user.save();
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." }); // On renvoie un message de succès
  },

  /**
   * Vérifie le mot de passe de l'utilisateur courant.
   * @async
   * @function VerifyUser
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async VerifyUser(req, res, next) {
    // on récupère le password de l'utilisateur a entré dans le formulaire
    const { password } = req.body;

    // on récupère l'id de l'utilisateur depuis le token
    const authenticatedUserId = req.user?.userId;

    // on récupère l'utilisateur connecté depuis la base (selon l'ID du token plus haut)
    const user = await User.findByPk(authenticatedUserId);
    if (!user) {
      const error = new Error("Utilisateur non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun utilisateur trouvé avec cet ID"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Vérification du mot de passe
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Mot de passe incorrect"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 401; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Le mot de passe ne correspond pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }

    res.status(200).json({ message: "Vérification réussie" }); // On renvoie un message de succès
  },

  /**
   * Récupère tous les utilisateurs (admin uniquement).
   * @async
   * @function getAllUsers
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllUsers(req, res) {
    // ADMIN ONLY
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // On exclut le champ "password"
    });
    res.status(200).json(users); // Si utilisateurs trouvés, on les renvoie au format JSON avec un statut 200
  },
};

export default userController;
