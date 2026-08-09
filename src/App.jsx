import "./App.css";
import Faculdade from "./components/Faculdade";

function App() {
  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="navbar">

        <div className="logo">
          &lt;<span>Kauan</span>.dev /&gt;
        </div>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="#faculdade">Faculdade</a>
          <a href="#contato">Contato</a>
        </nav>

        <a
          className="github-button"
          href="https://github.com/KauanMPL"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>

      </header>


      {/* =========================
          HERO
      ========================== */}

      <main>

        <section className="hero" id="inicio">

          <div className="hero-content">

            <span className="terminal-text">
              &gt; hello_world();
            </span>

            <h1>
              KAUAN
              <span>PAVANELI</span>
            </h1>

            <h2>
              Desenvolvedor <strong>Full Stack</strong>
            </h2>

            <p>
              Estudante de Análise e Desenvolvimento de Sistemas,
              apaixonado por tecnologia e desenvolvimento de software.
            </p>

            <div className="hero-buttons">

              <a
                href="#projetos"
                className="primary-button"
              >
                Ver projetos
              </a>

              <a
                href="#contato"
                className="secondary-button"
              >
                Entre em contato
              </a>

            </div>

          </div>


          {/* TERMINAL */}

          <div className="terminal">

            <div className="terminal-header">

              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>

              <span className="terminal-title">
                kauan@portfolio
              </span>

            </div>

            <div className="terminal-body">

              <p>
                <span className="green-text">$</span> whoami
              </p>

              <p className="cyan-text">
                Kauan Pavaneli
              </p>

              <p>
                <span className="green-text">$</span> role
              </p>

              <p className="purple-text">
                Full Stack Developer
              </p>

              <p>
                <span className="green-text">$</span> skills
              </p>

              <p>
                React / Node / TypeScript
              </p>

              <p>
                Python / SQL / PostgreSQL
              </p>

              <p>
                <span className="green-text">$</span> status
              </p>

              <p className="green-text">
                ● ONLINE
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            SOBRE
        ========================== */}

        <section
          className="section"
          id="sobre"
        >

          <div className="section-title">

            <span>01 //</span>

            <h2>
              Sobre mim
            </h2>

          </div>

          <div className="about-card">

            <div className="about-avatar">
              KP
            </div>

            <div>

              <h3>
                Desenvolvedor em construção.
              </h3>

              <p>
                Sou estudante de Análise e Desenvolvimento
                de Sistemas e desenvolvedor apaixonado por
                tecnologia.
              </p>

              <p>
                Gosto de transformar ideias em aplicações
                funcionais, explorar novas tecnologias e
                aprender constantemente.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            TECNOLOGIAS
        ========================== */}

        <section className="section">

          <div className="section-title">

            <span>02 //</span>

            <h2>
              Stack
            </h2>

          </div>

          <div className="skills-grid">

            <Skill nome="React" />
            <Skill nome="React Native" />
            <Skill nome="JavaScript" />
            <Skill nome="TypeScript" />
            <Skill nome="Node.js" />
            <Skill nome="Python" />
            <Skill nome="C#" />
            <Skill nome="SQL" />
            <Skill nome="PostgreSQL" />
            <Skill nome="Supabase" />
            <Skill nome="Git" />
            <Skill nome="GitHub" />

          </div>

        </section>


        {/* =========================
            PROJETOS
        ========================== */}

        <section
          className="section"
          id="projetos"
        >

          <div className="section-title">

            <span>03 //</span>

            <h2>
              Projetos
            </h2>

          </div>

          <div className="projects-grid">

            <Project
              title="Nano Vision"
              description="Sistema assistivo utilizando Arduino, sensores e aplicativo mobile."
              tech="Arduino • React Native • Supabase"
            />

            <Project
              title="Sistema Delivery"
              description="Sistema para gerenciamento de pedidos e operações de entrega."
              tech="React • Node.js • PostgreSQL"
            />

            <Project
              title="Projetos Acadêmicos"
              description="Projetos desenvolvidos durante minha formação em tecnologia."
              tech="JavaScript • Python • SQL"
            />

          </div>

        </section>


        {/* =========================
            FACULDADE
            SISTEMA DE CADASTRO
        ========================== */}

        <Faculdade />


        {/* =========================
            CONTATO
        ========================== */}

        <section
          className="contact-section"
          id="contato"
        >

          <span>
            05 // CONTATO
          </span>

          <h2>
            Vamos construir algo?
          </h2>

          <p>
            Entre em contato comigo.
          </p>

          <a
            href="mailto:kauanpavaneli@outlook.com"
            className="primary-button"
          >
            kauanpavaneli@outlook.com
          </a>

          <div className="social-links">

            <a
              href="https://github.com/KauanMPL"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/kauan-pavaneli/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================== */}

      <footer>

        <span>
          &lt;Kauan.dev /&gt;
        </span>

        <p>
          Construído com React + Vite
        </p>

      </footer>

    </div>
  );
}


/* =========================
   SKILL
========================== */

function Skill({ nome }) {

  return (
    <div className="skill-card">

      <span>
        ⚡
      </span>

      {nome}

    </div>
  );
}


/* =========================
   PROJECT
========================== */

function Project({
  title,
  description,
  tech
}) {

  return (
    <article className="project-card">

      <span className="project-number">
        PROJECT
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <span className="project-tech">
        {tech}
      </span>

      <button>
        Ver projeto →
      </button>

    </article>
  );
}


export default App;