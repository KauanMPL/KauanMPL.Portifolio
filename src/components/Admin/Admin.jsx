import { ModalMateria } from "./ModelMateria";
import { ModalAula } from "./ModelAula";
import { ModalHabilidade } from "./ModalHabilidade";
import { ModalProjeto } from "./ModalProjeto";

export function Admin({
  admin,
  usuario,
  loginAdmin,
  logoutAdmin,

  // Matérias
  abrirNovaMateria,
  exportarBackup,
  abrirImportacao,
  importarBackup,
  fileInputRef,

  // Estados dos modais
  modal,
  materiaEditando,
  aulaEditando,
  habilidadeEditando,
  projetoEditando,
  fecharModal,

  // Funções de save
  salvarMateria,
  salvarAula,
  salvarHabilidade,
  salvarProjeto,

  // Controles de abrir modais
  abrirNovaHabilidade,
  abrirNovoProjeto,
}) {
  return (
    <>
      {/* BOTÃO ADMIN */}
      <button
        className={`admin-button ${admin ? "active" : ""}`}
        onClick={admin ? logoutAdmin : loginAdmin}
      >
        {admin ? "✓ Admin ativo" : "⚙ Administrar"}
      </button>

      {/* PAINEL ADMIN */}
      {admin && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>PAINEL ADMINISTRATIVO</span>
              <h3>Gerenciar conteúdo</h3>
              {usuario?.email && (
                <small>Logado como: {usuario.email}</small>
              )}
            </div>

            <div className="admin-actions">
              {/* Matérias */}
              <button onClick={abrirNovaMateria} className="admin-primary">
                + Nova matéria
              </button>

              {/* Habilidades */}
              <button onClick={abrirNovaHabilidade} className="admin-primary">
                + Nova habilidade
              </button>

              {/* Projetos */}
              <button onClick={abrirNovoProjeto} className="admin-primary">
                + Novo projeto
              </button>

              <div className="admin-divider" />

              {/* Backup */}
              <button onClick={exportarBackup} className="admin-secondary">
                ↓ Exportar backup
              </button>

              <button onClick={abrirImportacao} className="admin-secondary">
                ↑ Importar backup
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                hidden
                onChange={importarBackup}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAIS ===== */}
      {modal === "materia" && (
        <ModalMateria
          materia={materiaEditando}
          onClose={fecharModal}
          onSave={salvarMateria}
        />
      )}

      {modal === "aula" && (
        <ModalAula
          aula={aulaEditando}
          onClose={fecharModal}
          onSave={salvarAula}
        />
      )}

      {modal === "habilidade" && (
        <ModalHabilidade
          habilidade={habilidadeEditando}
          onClose={fecharModal}
          onSave={salvarHabilidade}
        />
      )}

      {modal === "projeto" && (
        <ModalProjeto
          projeto={projetoEditando}
          onClose={fecharModal}
          onSave={salvarProjeto}
        />
      )}
    </>
  );
}