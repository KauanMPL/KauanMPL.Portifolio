
import {
  SiReact,
  SiAngular,
  SiVuedotjs,
  SiRedux,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiStyledcomponents,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiSpring,
  SiSupabase,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiDocker,
  SiVercel,
  SiGit,
  SiGithub,
  SiJest,
  SiCypress,
} from "react-icons/si";

import { DiJava } from "react-icons/di";

import {
  FaDatabase,
  FaCloud,
  FaCode,
  FaServer,
} from "react-icons/fa";

import "./Habilidades.css";

const Habilidades = () => {
  const tecnologias = {
    "Front-End": [
      { nome: "React", icone: SiReact },
      { nome: "Angular", icone: SiAngular },
      { nome: "Vue", icone: SiVuedotjs },
      { nome: "Redux", icone: SiRedux },
      { nome: "TypeScript", icone: SiTypescript },
      { nome: "JavaScript", icone: SiJavascript },
      { nome: "Tailwind", icone: SiTailwindcss },
      {
        nome: "Styled Components",
        icone: SiStyledcomponents,
      },
      {
        nome: "PrimeNG",
        icone: SiAngular,
      },
    ],

    "Back-End": [
      {
        nome: "Node.js",
        icone: SiNodedotjs,
      },
      {
        nome: "Express",
        icone: SiExpress,
      },
      {
        nome: "PHP",
        icone: SiPhp,
      },
      {
        nome: "Laravel",
        icone: SiLaravel,
      },
      {
        nome: "Java",
        icone: DiJava,
      },
      {
        nome: "Spring",
        icone: SiSpring,
      },
      {
        nome: "Supabase",
        icone: SiSupabase,
      },
    ],

    Database: [
      {
        nome: "PostgreSQL",
        icone: SiPostgresql,
      },
      {
        nome: "MySQL",
        icone: SiMysql,
      },
      {
        nome: "SQLite",
        icone: SiSqlite,
      },
      {
        nome: "Redis",
        icone: SiRedis,
      },
    ],

    "DevOps & Tools": [
      {
        nome: "Docker",
        icone: SiDocker,
      },
      {
        nome: "Vercel",
        icone: SiVercel,
      },
      {
        nome: "Git",
        icone: SiGit,
      },
      {
        nome: "GitHub",
        icone: SiGithub,
      },
      {
        nome: "Jest",
        icone: SiJest,
      },
      {
        nome: "Cypress",
        icone: SiCypress,
      },
    ],

    Cloud: [
      {
        nome: "AWS",
        icone: FaCloud,
      },
      {
        nome: "Azure",
        icone: FaCloud,
      },
    ],
  };

  const categorias = [
    {
      nome: "Front-End",
      icone: FaCode,
      cor: "#61DAFB",
    },
    {
      nome: "Back-End",
      icone: FaServer,
      cor: "#339933",
    },
    {
      nome: "Database",
      icone: FaDatabase,
      cor: "#336791",
    },
    {
      nome: "DevOps & Tools",
      icone: FaCode,
      cor: "#2496ED",
    },
    {
      nome: "Cloud",
      icone: FaCloud,
      cor: "#FF9900",
    },
  ];

  return (
    <div className="habilidades-container">
      <div className="section-title">
        <span>02</span>

        <h2>
          Habilidades Técnicas
        </h2>
      </div>

      <div className="habilidades-grid">
        {categorias.map((categoria) => {
          const IconeCategoria =
            categoria.icone;

          return (
            <div
              key={categoria.nome}
              className="categoria-card"
            >
              <div className="categoria-header">
                <IconeCategoria
                  className="categoria-icon"
                  style={{
                    color: categoria.cor,
                  }}
                />

                <h3>
                  {categoria.nome}
                </h3>
              </div>

              <div className="tecnologias-grid">
                {tecnologias[
                  categoria.nome
                ]?.map((tech) => {
                  const Icone =
                    tech.icone;

                  return (
                    <div
                      key={tech.nome}
                      className="tech-item"
                    >
                      <Icone className="tech-icon" />

                      <span>
                        {tech.nome}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="habilidades-stats">
        <div className="stat-item">
          <span className="stat-number">
            30+
          </span>

          <span className="stat-label">
            Tecnologias
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-number">
            5
          </span>

          <span className="stat-label">
            Áreas
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-number">
            ∞
          </span>

          <span className="stat-label">
            Aprendendo
          </span>
        </div>
      </div>
    </div>
  );
};

export default Habilidades;

