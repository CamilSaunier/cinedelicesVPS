import multer from "multer";

// Création de l'instance de Multer en utilisant la configuration définie précédemment
// cela indique à Multer de stocker les fichiers en mémoire plutôt que sur le disque
// l'approche ici c'est  de manipuler les fichiers en mémoire avant de les traiter (minifier, trier, etc.)
/**
 * Instance Multer configurée pour stocker les fichiers en mémoire.
 * À utiliser comme middleware pour l'upload de fichiers.
 * @type {import('multer').Multer}
 */
const upload = multer({ storage: multer.memoryStorage() });
// On exporte la configuration Multer pour pouvoir l'utiliser dans d'autres fichiers
export default upload;
