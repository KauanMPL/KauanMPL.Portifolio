import { useState } from "react";

export function ModalAula({ aula, onClose, onSave }) {
  const [titulo, setTitulo] = useState(aula?.titulo || "");
  const [data, setData] = useState(
    aula?.data || new Date().toLocaleDateString("pt-BR")
  );
  const [conteudo, setConteudo] = useState(aula?.conteudo || "");
  const [anotacoes, setAnotacoes] = useState(aula?.anotacoes || "");

  function enviar(event) {
    event.preventDefault();

    if (!titulo.trim()) {
      alert("Digite o título da aula.");
      return;
    }

    if (!conteudo.trim()) {
      alert("Digite o conteúdo da aula.");
      return;
    }

    onSave({
      titulo: titulo.trim(),
      data: data.trim(),
      conteudo: conteudo.trim(),
      anotacoes: anotacoes.trim(),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span>{aula ? "EDITAR AULA" : "NOVA AULA"}</span>
            <h2>{aula ? "Editar aula" : "Cadastrar aula"}</h2>
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={enviar}>
          <div className="form-group">
            <label>
              Título da aula
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Normalização de Banco de Dados"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Data
              <input
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="09/08/2026"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Conteúdo da aula
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows={8}
                placeholder="Escreva aqui o conteúdo estudado..."
                className="form-textarea"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Minhas anotações
              <textarea
                value={anotacoes}
                onChange={(e) => setAnotacoes(e.target.value)}
                rows={6}
                placeholder="Escreva suas observações, exemplos, dúvidas..."
                className="form-textarea"
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
              {aula ? "Salvar alterações" : "Cadastrar aula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}