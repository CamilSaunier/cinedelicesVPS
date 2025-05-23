import React from "react";
import "./legalMention.css";
import { useNavigate } from "react-router-dom";

const LegalMention = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Balises qui seront intégrées dans le head */}
      <title>Mentions légales | Ciné Délices</title>
      <meta name="description" content="Mention légales et charte de bonne conduite de Ciné Délices" />
      <meta name="keywords" content="Ciné délices, mention légales, contact, charte" />

      <section className="section__presentation section_legal_mention">
        <div className="box box_legal_mention">
          <h1 className="section__presentation-title legal_mention_main-title">Mentions légales</h1>
          <h2 className="section__presentation-title legal_mention_title">Contact</h2>
          <h3 className="sub-title">Éditeur du site</h3>
          <p>Le site web "Ciné Délices" est édité par l'entreprise fictive de divertissement Ciné Délices.</p>
          <ul>
            <li>Adresse fictive : 1 rue du pont 75000</li>
            <li>E-mail : deliceciné@gmail.com</li>
            <li>Directeur de publication fictif : Jean Dupont</li>
          </ul>
          <h3 className="sub-title">Hébergement</h3>
          <p>Le site "Ciné Délices" a été développé et est hébergé sur les plateformes suivantes :</p>
          <ul>
            <li>Vercel – Plateforme d’hébergement et de déploiement front-end</li>
            <li>Render – Hébergement de services back-end et d’API</li>
          </ul>

          <h2 className="section__presentation-title legal_mention_title">Informations Légales</h2>
          <h3 className="sub-title">Propriété intellectuelle</h3>
          <p>
            Le titre, la conception, la forme du site mais aussi son contenu sont la propriété exclusive de Ciné Délices ou de ses partenaires. Toute reproduction, distribution, modification ou réutilisation du contenu sans autorisation écrite est
            interdite.
          </p>
          <h3 className="sub-title">Données personnelles</h3>
          <p>
            Le site ne collecte aucune donnée personnelle sans consentement explicite. Conformément au RGPD, les utilisateurs disposent d’un droit d’accès, de rectification et de suppression de leurs données. Les informations personnelles recueillies
            sont utilisées pour répondre aux différents services proposés par le site.
          </p>
          <h3 className="sub-title">Limitation de responsabilité</h3>
          <p>
            Le site "Ciné Délice" s'efforce d'offrir des informations exactes et à jour, mais ne saurait être tenu responsable de l'exactitude ou de l'actualité des informations mises à disposition. Le site ne pourra pas être tenu responsable des
            dommages directs ou indirects résultant de l'utilisation des informations présentes sur le site.
          </p>
          <h3 className="sub-title">Liens externes</h3>
          <p>Les liens vers des sites externes sont fournis uniquement à titre informatif. Ciné Délices ne peut être tenu responsable du contenu de ces sites et de leur politique de confidentialité.</p>
          <h3 className="sub-title">Condition d’utilisation</h3>
          <p>
            Ce site est exploité dans le respect de la législation française et son utilisation est régie par les présentes conditions générales. En utilisant le site, vous reconnaissez avoir pris connaissance de ces conditions et les avoir
            acceptées. Celles-ci pourront êtres modifiées à tout moment et sans préavis par Ciné Délices.
          </p>

          <h2 className="section__presentation-title legal_mention_title">Charte de bonne conduite</h2>
          <p>
            Bienvenue sur Ciné Délice ! Nous vous remercions de contribuer à l'enrichissement de notre site en partageant vos recettes et en ajoutant des œuvres inspirées de vos films et séries préférés. Afin de garantir une expérience agréable et
            respectueuse pour tous, nous vous demandons de respecter la présente charte de bonne conduite.
          </p>

          <h3 className="sub-title">1. Respect des droits d’auteur et de la propriété intellectuelle</h3>
          <p>Vous êtes seul responsable du contenu que vous publiez. En partageant des recettes et des œuvres, assurez-vous que vous disposez des droits nécessaires pour publier ce contenu.</p>

          <h3 className="sub-title">2. Contenu approprié</h3>
          <p>Le site Ciné Délice est destiné à un public général, et nous attendons de vous que vous partagiez du contenu respectueux et adapté à tous les âges. Il est donc interdit de publier du contenu :</p>
          <ul>
            <li>- À caractère violent, haineux, discriminatoire, raciste, sexiste, homophobe, ou incitant à la violence.</li>
            <li>- Pornographique, obscène ou explicitement sexuel.</li>
            <li>- Diffamant ou portant atteinte à l’intégrité de tiers.</li>
          </ul>
          <p>Nous nous réservons le droit de supprimer tout contenu jugé inapproprié et de suspendre les comptes des utilisateurs enfreignant cette règle.</p>

          <h3 className="sub-title">3. Comportement de publication</h3>
          <p>Lorsque vous créez une recette ou ajoutez une œuvre, veuillez respecter les règles suivantes :</p>
          <ul>
            <li> -Assurez-vous que les recettes et œuvres partagées sont claires, bien structurées et compréhensibles.</li>
            <li> -Veuillez donner un titre précis à chaque recette ou œuvre.</li>
            <li> -Si vous ajoutez une œuvre inspirée d’un film ou d’une série, fournissez une référence adéquate à l’œuvre originale (nom du film, série, etc.).</li>
            <li> -Veuillez éviter de poster du contenu en double ou hors sujet.</li>
          </ul>

          <h3 className="sub-title">4. Modération et signalement</h3>
          <p>Nous comptons sur la communauté pour maintenir un environnement sûr et agréable. Si vous êtes témoin d'un comportement ou d'un contenu qui enfreint cette charte, merci de le signaler immédiatement à deliceciné@gmail.com.</p>

          <h3 className="sub-title">5. Sanctions</h3>
          <p>En cas de non-respect de cette charte, Ciné Délice se réserve le droit de :</p>
          <ul>
            <li>- Retirer ou modifier tout contenu jugé inapproprié.</li>
            <li>- Suspendre ou supprimer l'accès au compte de l'utilisateur fautif.</li>
            <li>- Prendre toute autre mesure nécessaire pour préserver l'intégrité et la sécurité de la communauté.</li>
          </ul>
          <p>Toute sanction fera l’objet d’un examen préalable par l’équipe de modération.</p>
        </div>

        <div className="button-center">
          <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </section>
    </div>
  );
};

export default LegalMention;
