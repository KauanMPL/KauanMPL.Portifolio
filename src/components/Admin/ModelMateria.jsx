import { useState } from "react";

export function ModalMateria({ materia, onClose, onSave }) {
  const [nome, setNome] = useState(materia?.nome || "");
  const [sigla, setSigla] = useState(materia?.sigla || "");
  const [descricao, setDescricao] = useState(materia?.descricao || "");
  const [cor, setCor] = useState(materia?.cor || "cyan");

  function enviar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      alert("Digite o nome da matéria.");
      return;
    }

    if (!sigla.trim()) {
      alert("Digite a sigla da matéria.");
      return;
    }

    onSave({
      nome: nome.trim(),
      sigla: sigla.trim().toUpperCase(),
      descricao: descricao.trim(),
      cor,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span>{materia ? "EDITAR MATÉRIA" : "NOVA MATÉRIA"}</span>
            <h2>{materia ? "Editar matéria" : "Cadastrar matéria"}</h2>
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={enviar}>
          <div className="form-group">
            <label>
              Nome da matéria
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Banco de Dados"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Sigla
              <input
                value={sigla}
                onChange={(e) => setSigla(e.target.value)}
                maxLength={5}
                placeholder="Ex: BD"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Descrição
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição da matéria"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Cor
              <select
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="form-select"
              >
                <option value="cyan">Azul Neon</option>
                <option value="purple">Roxo Neon</option>
                <option value="pink">Rosa Neon</option>
                <option value="green">Verde Neon</option>
                <option value="orange">Laranja Neon</option>
                <option value="red">Vermelho Neon</option>
              </select>
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
              {materia ? "Salvar alterações" : "Criar matéria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}