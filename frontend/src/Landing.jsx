import "./Landing.css";
import landBackground from "./assets/land-background.jpg";
import team1 from "./assets/team1.jpg";
import team2 from "./assets/team2.jpg";
import team3 from "./assets/team3.jpg";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      {/* ====== HERO SECTION ====== */}
      <div
        className="landing-container"
        style={{ backgroundImage: `url(${landBackground})` }}
      >
        <div className="overlay"></div>

        <div className="content fade-in">
          <h1>
            <span className="highlight">Terra</span>Proof
          </h1>

          <h3 className="subtitle">La preuve foncière du futur.</h3>

          <p className="slogan">
            "Là où la terre rencontre la vérité."
          </p>

          <button className="cta-button" onClick={() => navigate("/app")}>
            Entrer dans l'application
          </button>
        </div>
      </div>

      {/* ====== MISSION ====== */}
      <section className="section mission-section">
        <h2>Notre Mission</h2>
        <p>
          TerraProof révolutionne la gestion foncière en offrant une plateforme
          immuable, transparente et inviolable. Grâce à la puissance de la
          blockchain, nous sécurisons les titres fonciers, éliminons la fraude,
          accélérons les démarches et renforçons la confiance entre citoyens,
          institutions et professionnels.  
          Notre objectif est simple : rendre la propriété foncière claire,
          accessible et infalsifiable - pour toujours.
        </p>
      </section>

      {/* ====== TEAM ====== */}
      <section className="section team-section">
        <h2>Notre Équipe</h2>

        <div className="team-list">
          <div className="team-card">
            <img src={team1} alt="Membre équipe 1" />
            <h3>Kacem Chaima</h3>
            <p className="team-role">Data Engineer</p>
            <a
              className="linkedin-hover"
              href="https://www.linkedin.com/in/kacem-chayma/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="team-card">
            <img src={team2} alt="Membre équipe 2" />
            <h3>Guidara Mohamed</h3>
            <p className="team-role">AI Engineer</p>
            <a
              className="linkedin-hover"
              href="https://www.linkedin.com/in/mohamed-guidara/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="team-card">
            <img src={team3} alt="Membre équipe 3" />
            <h3>Krichen Youssef</h3>
            <p className="team-role">AI Engineer</p>
            <a
              className="linkedin-hover"
              href="https://www.linkedin.com/in/youssef-krichen/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section className="section contact-section">
        <h2>Contactez-nous</h2>
        <form className="contact-form">
          <input type="text" placeholder="Votre nom" required />
          <input type="email" placeholder="Votre email" required />
          <textarea placeholder="Votre message..." required />
          <button type="submit">Envoyer</button>
        </form>
      </section>

      {/* ====== FAQ ====== */}
      <section className="section faq-section">
        <h2>FAQs</h2>

        <div className="faq-item">
          <h3> Qu’est-ce que TerraProof ?</h3>
          <p className="faq-answer">
            Une plateforme basée sur la blockchain qui garantit l’intégrité et la
            sécurité des titres fonciers.
          </p>
        </div>

        <div className="faq-item">
          <h3>Les données sont-elles sécurisées ?</h3>
          <p className="faq-answer">
            Oui. TerraProof utilise une blockchain immuable empêchant toute
            falsification ou suppression des données.
          </p>
        </div>

        <div className="faq-item">
          <h3>Qui peut utiliser la plateforme ?</h3>
          <p className="faq-answer">
            Les citoyens, les notaires, les administrations publiques et les
            professionnels de l’immobilier.
          </p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="footer final-footer">
        © {new Date().getFullYear()} TerraProof — Tous droits réservés.
      </footer>
    </>
  );
}
