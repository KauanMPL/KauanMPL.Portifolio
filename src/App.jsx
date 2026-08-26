import { useState } from "react";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiSharp,
  SiPostgresql,
  SiSupabase,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import "./App.css";

// Componentes
import Faculdade from "./components/Faculdade/Faculdade";
import Habilidades from "./components/Habilidades/Habilidades";
import Projetos from "./components/Projetos/Projetos";

// Admin
import { useAdmin } from "./components/Admin/useAdmin";
import { Admin } from "./components/Admin/Admin";

// Hooks
import { useHabilidades } from "./hooks/useHabilidades";
import { useProjetos } from "./hooks/useProjetos";

function App() {
  // ===== ESTADOS DA FACULDADE =====
  const [materias, setMaterias] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);

  // ===== HABILIDADES =====
  const { habilidades, setHabilidades, carregarHabilidades } = useHabilidades();

  // ===== PROJETOS =====
  const { projetos, setProjetos, carregarProjetos } = useProjetos();

  // ===== ADMIN UNIFICADO =====
  const admin = useAdmin({
    // Matérias
    materias,
    setMaterias,
    materiaSelecionada,
    onMateriaDeleted: () => {
      setMateriaSelecionada(null);
      setAulaSelecionada(null);
    },
    // Habilidades
    habilidades,
    setHabilidades,
    carregarHabilidades,
    // Projetos
    projetos,
    setProjetos,
    carregarProjetos,
  });

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

      <main>
        {/* =========================
            HERO
        ========================== */}

        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="terminal-text">&gt; hello_world();</span>

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
              <a href="#projetos" className="primary-button">
                Ver projetos
              </a>

              <a href="#contato" className="secondary-button">
                Entre em contato
              </a>
            </div>
          </div>

          <div className="terminal">
            <div className="terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="terminal-title">kauan@portfolio</span>
            </div>

            <div className="terminal-body">
              <p>
                <span className="green-text">$</span> whoami
              </p>
              <p className="cyan-text">Kauan Pavaneli</p>

              <p>
                <span className="green-text">$</span> role
              </p>
              <p className="purple-text">Full Stack Developer</p>

              <p>
                <span className="green-text">$</span> skills
              </p>
              <p>React / Node / TypeScript</p>
              <p>Python / SQL / PostgreSQL</p>

              <p>
                <span className="green-text">$</span> status
              </p>
              <p className="green-text">● ONLINE</p>
            </div>
          </div>
        </section>

        {/* =========================
            SKILLS CAROUSEL
        ========================== */}

        <div className="skills-carousel">
          <div className="skills-track">
            <div className="skills-group">
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

            <div className="skills-group">
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
          </div>
        </div>

        {/* =========================
            SOBRE
        ========================== */}

        <section className="section" id="sobre">
          <div className="section-title">
            <span>01</span>
            <h2>Sobre mim</h2>
          </div>

          <div className="about-card">
            <div className="about-avatar">KP</div>

            <div>
              <h3>Desenvolvedor em construção.</h3>

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
            HABILIDADES
        ========================== */}

        <section className="section" id="stack">
          <Habilidades
            admin={admin.admin}
            onEdit={admin.editarHabilidade}
            onDelete={admin.excluirHabilidade}
          />
        </section>

        {/* =========================
            PROJETOS
        ========================== */}

        <Projetos
          admin={admin.admin}
          onEdit={admin.editarProjeto}
          onDelete={admin.excluirProjeto}
        />

        {/* =========================
            FACULDADE
        ========================== */}

        <Faculdade />

        {/* =========================
            CONTATO
        ========================== */}

        <section className="contact-section" id="contato">
          <span>05 CONTATO</span>
          <h2>Vamos construir algo?</h2>
          <p>Entre em contato comigo.</p>

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
        <span>&lt;Kauan.dev /&gt;</span>
        <p>Construído com React + Vite</p>
      </footer>

      {/* =========================
          ADMIN FLUTUANTE
      ========================== */}

      <div className="admin-float">
        <Admin {...admin} />
      </div>
    </div>
  );
}

// =========================
// COMPONENTE SKILL (Carousel)
// =========================

function Skill({ nome }) {
  const icones = {
    React: SiReact,
    "React Native": SiReact,
    JavaScript: SiJavascript,
    TypeScript: SiTypescript,
    "Node.js": SiNodedotjs,
    Python: SiPython,
    "C#": SiSharp,
    SQL: FaDatabase,
    PostgreSQL: SiPostgresql,
    Supabase: SiSupabase,
    Git: SiGit,
    GitHub: SiGithub,
  };

  const Icone = icones[nome];

  return (
    <div className="skill">
      {Icone && <Icone className="skill-icon" />}
      <span>{nome}</span>
    </div>
  );
}

export default App;