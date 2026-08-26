import { useEffect, useState } from "react";
import "./Habilidades.css";
import { habilidadeService } from "../../services/habilidadeService";

// Mapeamento dos ícones
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
import { FaDatabase, FaCloud, FaCode, FaServer } from "react-icons/fa";

const ICONES_MAP = {
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
  DiJava,
  FaDatabase,
  FaCloud,
  FaCode,
  FaServer,
};

function Habilidades({ admin, onEdit, onDelete, habilidades: habilidadesProp, carregando: carregandoProp }) {
  const [habilidadesInternas, setHabilidadesInternas] = useState([]);
  const [carregandoInterno, setCarregandoInterno] = useState(true);
  const [erro, setErro] = useState("");

  // Usa props se fornecidas, senão carrega do banco
  const habilidades = habilidadesProp || habilidadesInternas;
  const carregando = carregandoProp !== undefined ? carregandoProp : carregandoInterno;

  useEffect(() => {
    // Se já tem habilidades via props, não carrega
    if (habilidadesProp) {
      setCarregandoInterno(false);
      return;
    }

    async function carregar() {
      try {
        const dados = await habilidadeService.listar();
        setHabilidadesInternas(dados);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar habilidades");
      } finally {
        setCarregandoInterno(false);
      }
    }
    carregar();
  }, [habilidadesProp]);

  if (carregando) return <div className="habilidades-loading">Carregando habilidades...</div>;
  if (erro) return <div className="habilidades-error">Erro: {erro}</div>;

  // Se não tem habilidades, mostra mensagem
  if (!habilidades || habilidades.length === 0) {
    return (
      <div className="habilidades-container">
        <div className="section-title">
          <span>02</span>
          <h2>Habilidades Técnicas</h2>
        </div>
        <div className="empty-state">
          <p>Nenhuma habilidade cadastrada.</p>
          {admin && (
            <button className="admin-primary" onClick={() => {}}>
              + Adicionar habilidade
            </button>
          )}
        </div>
      </div>
    );
  }

  const categorias = ["Front-End", "Back-End", "Database", "DevOps & Tools", "Cloud"];

  return (
    <div className="habilidades-container">
      <div className="section-title">
        <span>02</span>
        <h2>Habilidades Técnicas</h2>
      </div>

      <div className="habilidades-grid">
        {categorias.map((categoria) => {
          const items = habilidades.filter((h) => h.categoria === categoria);

          if (items.length === 0) return null;

          return (
            <div key={categoria} className="categoria-card">
              <div className="categoria-header">
                <h3>{categoria}</h3>
                <span className="categoria-count">{items.length}</span>
              </div>

              <div className="tecnologias-grid">
                {items.map((tech) => {
                  const Icone = ICONES_MAP[tech.icone] || FaCode;

                  return (
                    <div key={tech.id} className="tech-item">
                      <Icone className="tech-icon" style={{ color: tech.cor }} />
                      <span>{tech.nome}</span>

                      {admin && (
                        <div className="tech-admin">
                          <button
                            onClick={() => onEdit?.(tech)}
                            className="edit-btn"
                            title="Editar"
                          >
                            ✏
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja excluir "${tech.nome}"?`)) {
                                onDelete?.(tech.id);
                              }
                            }}
                            className="delete-btn"
                            title="Excluir"
                          >
                            🗑
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {admin && (
        <div className="habilidades-admin-actions">
          <button
            className="admin-primary"
            onClick={() => {
              // Abrir modal de nova habilidade
              // admin.abrirNovaHabilidade?.();
            }}
          >
            + Nova habilidade
          </button>
        </div>
      )}

      <div className="habilidades-stats">
        <div className="stat-item">
          <span className="stat-number">{habilidades.length}+</span>
          <span className="stat-label">Tecnologias</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">5</span>
          <span className="stat-label">Áreas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">∞</span>
          <span className="stat-label">Aprendendo</span>
        </div>
      </div>
    </div>
  );
}

export default Habilidades;