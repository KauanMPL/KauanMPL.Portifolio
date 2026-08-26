import { useState } from "react";
import {
  FaCertificate,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./Admin.css";

import { ModalMateria } from "./ModelMateria";
import { ModalAula } from "./ModelAula";
import { ModalHabilidade } from "./ModalHabilidade";
import { ModalProjeto } from "./ModalProjeto";
import { ModalCertificacao } from "./ModalCertificacao";
import CertificacoesAdmin from "./CertificacoesAdmin";

export function Admin({
  // ============================================
  // ADMIN
  // ============================================
  admin,
  usuario,
  loginAdmin,
  logoutAdmin,

  // ============================================
  // LISTAS
  // ============================================
  materias = [],
  habilidades = [],
  projetos = [],
  certificacoes = [],

  setCertificacoes,
  carregarCertificacoes,

  // ============================================
  // MATÉRIAS
  // ============================================
  abrirNovaMateria,

  // ============================================
  // BACKUP
  // ============================================
  exportarBackup,
  abrirImportacao,
  importarBackup,
  fileInputRef,

  // ============================================
  // MODAIS
  // ============================================
  modal,
  materiaEditando,
  aulaEditando,
  habilidadeEditando,
  projetoEditando,
  certificacaoEditando,
  fecharModal,

  // ============================================
  // SALVAR
  // ============================================
  salvarMateria,
  salvarAula,
  salvarHabilidade,
  salvarProjeto,
  salvarCertificacao,

  // ============================================
  // NOVOS
  // ============================================
  abrirNovaHabilidade,
  abrirNovoProjeto,
  abrirNovaCertificacao,
}) {
  const [activeTab, setActiveTab] = useState("geral");
  const [collapsed, setCollapsed] = useState(false);

  // ============================================
  // NÃO LOGADO
  // ============================================

  if (!admin) {
    return (
      <button
        type="button"
        className="admin-button"
        onClick={loginAdmin}
      >
        ⚙ Administrar
      </button>
    );
  }

  // ============================================
  // ADMIN LOGADO
  // ============================================

  return (
    <>
      {/* ==========================================
          BOTÃO MINI
          ========================================== */}

      {collapsed && (
        <button
          type="button"
          className="admin-mini-button"
          onClick={() => setCollapsed(false)}
          title="Abrir painel administrativo"
        >
          <FaChevronLeft />
          <span>ADMIN</span>
        </button>
      )}

      {/* ==========================================
          FUNDO ESCURO
          ========================================== */}

      {!collapsed && (
        <div
          className="admin-backdrop"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* ==========================================
          PAINEL ADMIN
          ========================================== */}

      {!collapsed && (
        <aside className="admin-panel">

          {/* ========================================
              HEADER
              ======================================== */}

          <div className="admin-panel-header">

            <div className="admin-title">
              <span>ADMIN</span>

              <h3>Painel de controle</h3>

              {usuario?.email && (
                <small>{usuario.email}</small>
              )}
            </div>

            <div className="admin-header-actions">

              {/* OCULTAR */}
              <button
                type="button"
                className="admin-collapse"
                onClick={() => setCollapsed(true)}
                title="Ocultar painel"
              >
                <FaChevronRight />
              </button>

              {/* SAIR */}
              <button
                type="button"
                className="admin-close"
                onClick={logoutAdmin}
                title="Sair do administrador"
              >
                <FaTimes />
              </button>

            </div>
          </div>

          {/* ========================================
              AÇÕES RÁPIDAS
              ======================================== */}

          <div className="admin-actions-bar">

            {/* MATÉRIA */}
            <button
              type="button"
              onClick={abrirNovaMateria}
              className="btn-primary"
            >
              <span>+</span>
              Matéria
            </button>

            {/* HABILIDADE */}
            <button
              type="button"
              onClick={abrirNovaHabilidade}
              className="btn-primary"
            >
              <span>+</span>
              Habilidade
            </button>

            {/* PROJETO */}
            <button
              type="button"
              onClick={abrirNovoProjeto}
              className="btn-primary"
            >
              <span>+</span>
              Projeto
            </button>

            {/* CERTIFICAÇÃO */}
            <button
              type="button"
              onClick={() => {
                if (abrirNovaCertificacao) {
                  abrirNovaCertificacao();
                } else {
                  setActiveTab("certificacoes");
                }
              }}
              className="btn-primary"
            >
              <FaCertificate />
              Certificação
            </button>

            <div className="divider" />

            {/* BACKUP */}
            <button
              type="button"
              onClick={exportarBackup}
              className="btn-secondary"
            >
              ↓ Backup
            </button>

            {/* IMPORTAR */}
            <button
              type="button"
              onClick={abrirImportacao}
              className="btn-secondary"
            >
              ↑ Importar
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              hidden
              onChange={importarBackup}
            />

          </div>

          {/* ========================================
              ABAS
              ======================================== */}

          <div className="admin-tabs">

            {/* GERAL */}
            <button
              type="button"
              className={`tab ${
                activeTab === "geral"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("geral")}
            >
              <span>📊</span>
              Geral
            </button>

            {/* CERTIFICAÇÕES */}
            <button
              type="button"
              className={`tab ${
                activeTab === "certificacoes"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("certificacoes")
              }
            >
              <FaCertificate />

              <span>Certificações</span>

              <b>
                {Array.isArray(certificacoes)
                  ? certificacoes.length
                  : 0}
              </b>
            </button>

          </div>

          {/* ========================================
              CONTEÚDO
              ======================================== */}

          <div className="admin-content">

            {/* ======================================
                ABA GERAL
                ====================================== */}

            {activeTab === "geral" && (
              <div className="stats-grid">

                {/* ==================================
                    MATÉRIAS
                    ================================== */}

                <div className="stat-card">

                  <div className="stat-icon">
                    📚
                  </div>

                  <div>
                    <span>Matérias</span>

                    <strong>
                      {Array.isArray(materias)
                        ? materias.length
                        : 0}
                    </strong>
                  </div>

                </div>

                {/* ==================================
                    HABILIDADES
                    ================================== */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🛠
                  </div>

                  <div>
                    <span>Habilidades</span>

                    <strong>
                      {Array.isArray(habilidades)
                        ? habilidades.length
                        : 0}
                    </strong>
                  </div>

                </div>

                {/* ==================================
                    PROJETOS
                    ================================== */}

                <div className="stat-card">

                  <div className="stat-icon">
                    📁
                  </div>

                  <div>
                    <span>Projetos</span>

                    <strong>
                      {Array.isArray(projetos)
                        ? projetos.length
                        : 0}
                    </strong>
                  </div>

                </div>

                {/* ==================================
                    CERTIFICAÇÕES
                    ================================== */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🎓
                  </div>

                  <div>
                    <span>Certificações</span>

                    <strong>
                      {Array.isArray(certificacoes)
                        ? certificacoes.length
                        : 0}
                    </strong>
                  </div>

                </div>

              </div>
            )}

            {/* ======================================
                ABA CERTIFICAÇÕES
                ====================================== */}

            {activeTab === "certificacoes" && (
              <CertificacoesAdmin
                certificacoes={
                  Array.isArray(certificacoes)
                    ? certificacoes
                    : []
                }
                setCertificacoes={
                  setCertificacoes
                }
                carregarCertificacoes={
                  carregarCertificacoes
                }
              />
            )}

          </div>

        </aside>
      )}

      {/* ============================================
          MODAL MATÉRIA
          ============================================ */}

      {modal === "materia" && (
        <ModalMateria
          materia={materiaEditando}
          onClose={fecharModal}
          onSave={salvarMateria}
        />
      )}

      {/* ============================================
          MODAL AULA
          ============================================ */}

      {modal === "aula" && (
        <ModalAula
          aula={aulaEditando}
          onClose={fecharModal}
          onSave={salvarAula}
        />
      )}

      {/* ============================================
          MODAL HABILIDADE
          ============================================ */}

      {modal === "habilidade" && (
        <ModalHabilidade
          habilidade={habilidadeEditando}
          onClose={fecharModal}
          onSave={salvarHabilidade}
        />
      )}

      {/* ============================================
          MODAL PROJETO
          ============================================ */}

      {modal === "projeto" && (
        <ModalProjeto
          projeto={projetoEditando}
          onClose={fecharModal}
          onSave={salvarProjeto}
        />
      )}

      {/* ============================================
          MODAL CERTIFICAÇÃO
          ============================================ */}

      {modal === "certificacao" && (
        <ModalCertificacao
          certificacao={certificacaoEditando}
          onClose={fecharModal}
          onSave={salvarCertificacao}
        />
      )}

    </>
  );
}