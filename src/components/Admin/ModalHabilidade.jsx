import { useState } from "react";

const CATEGORIAS = [
  "Front-End",
  "Back-End",
  "Database",
  "DevOps & Tools",
  "Cloud",
];

const ICONES_DISPONIVEIS = [
  "SiReact",
  "SiAngular",
  "SiVuedotjs",
  "SiRedux",
  "SiTypescript",
  "SiJavascript",
  "SiTailwindcss",
  "SiStyledcomponents",
  "SiNodedotjs",
  "SiExpress",
  "SiPhp",
  "SiLaravel",
  "SiSpring",
  "SiSupabase",
  "SiPostgresql",
  "SiMysql",
  "SiSqlite",
  "SiRedis",
  "SiDocker",
  "SiVercel",
  "SiGit",
  "SiGithub",
  "SiJest",
  "SiCypress",
];

const CORES_PADRAO = {
  "Front-End": "#61DAFB",
  "Back-End": "#339933",
  Database: "#336791",
  "DevOps & Tools": "#2496ED",
  Cloud: "#FF9900",
};

export function ModalHabilidade({ habilidade, onClose, onSave }) {
  const [nome, setNome] = useState(habilidade?.nome || "");
  const [categoria, setCategoria] = useState(
    habilidade?.categoria || "Front-End"
  );
  const [icone, setIcone] = useState(habilidade?.icone || "SiReact");
  const [cor, setCor] = useState(
    habilidade?.cor || CORES_PADRAO[habilidade?.categoria] || "#61DAFB"
  );
  const [ordem, setOrdem] = useState(habilidade?.ordem || 0);

  function handleCategoriaChange(categoriaSelecionada) {
    setCategoria(categoriaSelecionada);
    // Se não tiver cor personalizada, usa a cor padrão da categoria
    if (!habilidade?.cor) {
      setCor(CORES_PADRAO[categoriaSelecionada] || "#61DAFB");
    }
  }

  function enviar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      alert("Digite o nome da habilidade.");
      return;
    }

    onSave({
      nome: nome.trim(),
      categoria,
      icone,
      cor,
      ordem: Number(ordem),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span>{habilidade ? "EDITAR HABILIDADE" : "NOVA HABILIDADE"}</span>
            <h2>{habilidade ? "Editar habilidade" : "Cadastrar habilidade"}</h2>
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={enviar}>
          <div className="form-group">
            <label>
              Nome da habilidade
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: React, Node.js, PostgreSQL"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Categoria
              <select
                value={categoria}
                onChange={(e) => handleCategoriaChange(e.target.value)}
                className="form-select"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Ícone
              <select
                value={icone}
                onChange={(e) => setIcone(e.target.value)}
                className="form-select"
              >
                {ICONES_DISPONIVEIS.map((ico) => (
                  <option key={ico} value={ico}>
                    {ico}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Cor (hex)
              <input
                type="color"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="form-color"
              />
              <input
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="#61DAFB"
                className="form-input"
                style={{ marginTop: "4px" }}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Ordem de exibição
              <input
                type="number"
                value={ordem}
                onChange={(e) => setOrdem(Number(e.target.value))}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </label>
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {habilidade ? "Salvar alterações" : "Criar habilidade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}