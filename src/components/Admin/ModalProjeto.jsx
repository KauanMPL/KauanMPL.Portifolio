import { useState } from "react";

const STATUS_OPCOES = [
  { value: "em desenvolvimento", label: "🚧 Em desenvolvimento" },
  { value: "finalizado", label: "✅ Finalizado" },
  { value: "manutenção", label: "🔧 Manutenção" },
  { value: "descontinuado", label: "⛔ Descontinuado" },
];

export function ModalProjeto({ projeto, onClose, onSave }) {
  const [titulo, setTitulo] = useState(projeto?.titulo || "");
  const [descricao, setDescricao] = useState(projeto?.descricao || "");
  const [tecnologias, setTecnologias] = useState(
    projeto?.tecnologias?.join(", ") || ""
  );
  const [imagem, setImagem] = useState(projeto?.imagem || "");
  const [link, setLink] = useState(projeto?.link || "");
  const [github, setGithub] = useState(projeto?.github || "");
  const [status, setStatus] = useState(projeto?.status || "em desenvolvimento");
  const [ordem, setOrdem] = useState(projeto?.ordem || 0);

  function enviar(event) {
    event.preventDefault();

    if (!titulo.trim()) {
      alert("Digite o título do projeto.");
      return;
    }

    if (!descricao.trim()) {
      alert("Digite a descrição do projeto.");
      return;
    }

    onSave({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tecnologias: tecnologias
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imagem: imagem.trim() || null,
      link: link.trim() || null,
      github: github.trim() || null,
      status,
      ordem: Number(ordem),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span>{projeto ? "EDITAR PROJETO" : "NOVO PROJETO"}</span>
            <h2>{projeto ? "Editar projeto" : "Cadastrar projeto"}</h2>
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={enviar}>
          <div className="form-group">
            <label>
              Título do projeto
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Nano Vision"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Descrição
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                placeholder="Descreva o projeto..."
                className="form-textarea"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Tecnologias (separadas por vírgula)
              <input
                value={tecnologias}
                onChange={(e) => setTecnologias(e.target.value)}
                placeholder="Ex: React, Node.js, PostgreSQL"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              URL da imagem
              <input
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Link do projeto (deploy)
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://meu-projeto.vercel.app"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Link do GitHub
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/usuario/projeto"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                {STATUS_OPCOES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
              {projeto ? "Salvar alterações" : "Criar projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}