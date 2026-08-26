import { useProjetos } from "../../hooks/useProjetos";
import "./Projetos.css";

function Projetos({ admin, onEdit, onDelete }) {
  const { projetos, carregando, erro } = useProjetos();

  if (carregando) return <div>Carregando projetos...</div>;
  if (erro) return <div>Erro: {erro}</div>;

  return (
    <section className="section" id="projetos">
      <div className="section-title">
        <span>03</span>
        <h2>Projetos</h2>
      </div>

      <div className="projects-grid">
        {projetos.map((projeto) => (
          <article key={projeto.id} className="project-card">
            <span className="project-number">PROJECT</span>
            <h3>{projeto.titulo}</h3>
            <p>{projeto.descricao}</p>
            <span className="project-tech">
              {projeto.tecnologias?.join(" • ")}
            </span>
            <span className={`project-status ${projeto.status}`}>
              {projeto.status}
            </span>

            {admin && (
              <div className="project-admin">
                <button onClick={() => onEdit(projeto)}>✏ Editar</button>
                <button className="delete-button" onClick={() => onDelete(projeto.id)}>
                  🗑 Excluir
                </button>
              </div>
            )}

            <div className="project-links">
              {projeto.link && (
                <a href={projeto.link} target="_blank" rel="noreferrer">
                  Ver projeto →
                </a>
              )}
              {projeto.github && (
                <a href={projeto.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projetos;