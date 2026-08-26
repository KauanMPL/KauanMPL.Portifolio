import { useEffect, useRef, useState } from "react";
import "./Certificacoes.css";

import { certificacoesAPI } from "../../lib/supabase";
import { ModalCertificacao } from "../Admin/ModalCertificacao";

import {
  SiUdemy,
  SiCoursera,
  SiDocker,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiGit,
  SiSupabase,
  SiRedux,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiSpring,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiVercel,
  SiJest,
  SiCypress,
  SiGoogle,
  SiLinux,
  SiAngular,
  SiVuedotjs,
  SiTailwindcss,
} from "react-icons/si";

import {
  FaCertificate,
  FaAward,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaDatabase,
  FaCode,
  FaServer,
  FaCloud,
  FaUniversity,
  FaImage,
  FaFileUpload,
  FaTimes,
  FaSpinner,
  FaAws,
  FaJava,
  FaNodeJs,
  FaGitAlt,
  FaMicrosoft,
  FaReact,
  FaVuejs,
  FaAngular,
  FaPython,
  FaPhp,
  FaLaravel,
  FaDocker,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// ======================================================
// MAPEAMENTO DE ÍCONES
// ======================================================

const iconesMap = {
  // Tecnologias - Simple Icons
  SiReact: SiReact,
  SiJavascript: SiJavascript,
  SiTypescript: SiTypescript,
  SiNodedotjs: SiNodedotjs,
  SiPython: SiPython,
  SiPostgresql: SiPostgresql,
  SiGit: SiGit,
  SiSupabase: SiSupabase,
  SiDocker: SiDocker,
  SiRedux: SiRedux,
  SiExpress: SiExpress,
  SiPhp: SiPhp,
  SiLaravel: SiLaravel,
  SiSpring: SiSpring,
  SiMysql: SiMysql,
  SiSqlite: SiSqlite,
  SiRedis: SiRedis,
  SiVercel: SiVercel,
  SiJest: SiJest,
  SiCypress: SiCypress,
  SiGoogle: SiGoogle,
  SiLinux: SiLinux,
  SiAngular: SiAngular,
  SiVuedotjs: SiVuedotjs,
  SiTailwindcss: SiTailwindcss,

  // Tecnologias - FontAwesome
  React: FaReact,
  Vue: FaVuejs,
  Angular: FaAngular,
  Java: FaJava,
  AWS: FaAws,
  "Node.js": FaNodeJs,
  Git: FaGitAlt,
  Microsoft: FaMicrosoft,
  Python: FaPython,
  PHP: FaPhp,
  Laravel: FaLaravel,
  Docker: FaDocker,

  // Plataformas
  Udemy: SiUdemy,
  Coursera: SiCoursera,
  "AWS Training": FaAws,

  // Categorias
  FaDatabase: FaDatabase,
  FaCode: FaCode,
  FaServer: FaServer,
  FaCloud: FaCloud,
  FaUniversity: FaUniversity,
  FaCertificate: FaCertificate,
  FaAws: FaAws,
  FaJava: FaJava,
  FaMicrosoft: FaMicrosoft,
  FaReact: FaReact,
};

// ======================================================
// COMPONENTE
// ======================================================

const Certificacoes = ({ admin = false }) => {
  const sectionRef = useRef(null);

  /*
   * IMPORTANTE:
   * Garante que somente o valor booleano TRUE
   * permita ações administrativas.
   *
   * Isso impede que valores como "false" (string),
   * objetos ou outros valores ativem o modo admin.
   */
  const isAdmin = admin === true;

  const [filter, setFilter] = useState("todos");
  const [certificacoes, setCertificacoes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    totalHoras: 0,
    categorias: {},
    niveis: {},
  });

  // ======================================================
  // MODAL DE UPLOAD
  // ======================================================

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ======================================================
  // MODAL DE EDIÇÃO
  // ======================================================

  const [showEditModal, setShowEditModal] = useState(false);
  const [certificacaoEditando, setCertificacaoEditando] =
    useState(null);

  // ======================================================
  // ANIMAÇÃO DA SEÇÃO
  // ======================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // ======================================================
  // CARREGAR DADOS
  // ======================================================

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const [certificacoesData, statsData] =
        await Promise.all([
          certificacoesAPI.getAll(),
          certificacoesAPI.getStats(),
        ]);

      setCertificacoes(certificacoesData || []);

      setStats(
        statsData || {
          total: 0,
          totalHoras: 0,
          categorias: {},
          niveis: {},
        }
      );
    } catch (err) {
      console.error(
        "Erro ao carregar certificações:",
        err
      );

      setError(
        "Não foi possível carregar as certificações."
      );

      setCertificacoes([]);

      setStats({
        total: 0,
        totalHoras: 0,
        categorias: {},
        niveis: {},
      });
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CATEGORIAS
  // ======================================================

  const categorias = [
    {
      id: "todos",
      label: "Todos",
    },
    {
      id: "frontend",
      label: "Front-End",
    },
    {
      id: "back-end",
      label: "Back-End",
    },
    {
      id: "database",
      label: "Database",
    },
    {
      id: "devops",
      label: "DevOps",
    },
    {
      id: "cloud",
      label: "Cloud",
    },
  ];

  // ======================================================
  // NÍVEL
  // ======================================================

  const getNivelColor = (nivel) => {
    const cores = {
      Básico: "#4CAF50",
      Intermediário: "#FF9800",
      Avançado: "#f44336",
    };

    return cores[nivel] || "#4CAF50";
  };

  // ======================================================
  // ÍCONE DA HABILIDADE
  // ======================================================

  const getIcone = (nomeIcone) => {
    if (!nomeIcone) {
      return FaCertificate;
    }

    return iconesMap[nomeIcone] || FaCertificate;
  };

  // ======================================================
  // ÍCONE DA PLATAFORMA
  // ======================================================

  const getPlataformaIcone = (plataforma) => {
    const plataformas = {
      Udemy: SiUdemy,
      Coursera: SiCoursera,
      "AWS Training": FaAws,
      AWS: FaAws,
      Microsoft: FaMicrosoft,
      Google: SiGoogle,
    };

    return plataformas[plataforma] || FaUniversity;
  };

  // ======================================================
  // EDITAR CERTIFICAÇÃO
  // ======================================================

  const abrirEditar = (certificacao) => {
    // SEGURANÇA EXTRA
    if (!isAdmin) {
      return;
    }

    if (!certificacao?.id) {
      return;
    }

    setCertificacaoEditando(certificacao);
    setShowEditModal(true);
  };

  const fecharEditar = () => {
    setShowEditModal(false);
    setCertificacaoEditando(null);
  };

  const salvarEdicao = async (dados, arquivo) => {
    // SEGURANÇA EXTRA
    if (!isAdmin) {
      console.warn(
        "Tentativa de editar certificação sem permissão."
      );
      return;
    }

    if (!certificacaoEditando?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const certificacaoSalva =
        await certificacoesAPI.update(
          certificacaoEditando.id,
          dados
        );

      // Upload de nova imagem
      if (arquivo && certificacaoSalva?.id) {
        await certificacoesAPI.uploadImagem(
          arquivo,
          certificacaoSalva.id
        );
      }

      await carregarDados();

      fecharEditar();
    } catch (error) {
      console.error(
        "Erro ao editar certificação:",
        error
      );

      alert(
        error?.message ||
          "Erro ao editar certificação. Verifique os dados."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // EXCLUIR CERTIFICAÇÃO
  // ======================================================

  const excluirCertificacao = async (
    id,
    titulo
  ) => {
    // SEGURANÇA EXTRA
    if (!isAdmin) {
      console.warn(
        "Tentativa de excluir certificação sem permissão."
      );
      return;
    }

    if (!id) {
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a certificação "${titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await certificacoesAPI.delete(id);

      await carregarDados();
    } catch (error) {
      console.error(
        "Erro ao excluir certificação:",
        error
      );

      alert(
        error?.message ||
          "Erro ao excluir certificação."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPLOAD
  // ======================================================

  const abrirUpload = (cert) => {
    // SOMENTE ADMIN
    if (!isAdmin) {
      return;
    }

    if (!cert?.id) {
      return;
    }

    setSelectedCert(cert);
    setShowUploadModal(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const fecharUpload = () => {
    setShowUploadModal(false);
    setSelectedCert(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (e) => {
    // SOMENTE ADMIN
    if (!isAdmin) {
      return;
    }

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    // SOMENTE ADMIN
    if (!isAdmin) {
      return;
    }

    if (!selectedFile || !selectedCert?.id) {
      return;
    }

    try {
      setUploading(true);

      await certificacoesAPI.uploadImagem(
        selectedFile,
        selectedCert.id
      );

      await carregarDados();

      fecharUpload();
    } catch (error) {
      console.error(
        "Erro no upload:",
        error
      );

      alert(
        error?.message ||
          "Erro ao fazer upload da imagem. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // FILTRO
  // ======================================================

  const certificadosFiltrados =
    filter === "todos"
      ? certificacoes
      : certificacoes.filter(
          (cert) =>
            cert.categoria === filter
        );

  // ======================================================
  // LOADING
  // ======================================================

  if (
    loading &&
    certificacoes.length === 0
  ) {
    return (
      <section
        className="certificacoes-section"
        id="certificacoes"
        ref={sectionRef}
      >
        <div className="loading-container">
          <FaSpinner className="spinner" />

          <p>
            Carregando certificações...
          </p>
        </div>
      </section>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <section
        className="certificacoes-section"
        id="certificacoes"
        ref={sectionRef}
      >
        <div className="error-container">
          <p className="error-message">
            {error}
          </p>

          <button
            onClick={carregarDados}
            className="retry-button"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section
      className="certificacoes-section"
      id="certificacoes"
      ref={sectionRef}
    >
      {/* ==================================================
          TÍTULO
      ================================================== */}

      <div className="section-title">
        <span>04</span>
        <h2>Certificações</h2>
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="certificacoes-header">
        <p className="certificacoes-descricao">
          🎯 Minhas certificações e cursos
          complementares que comprovam meu
          conhecimento e dedicação ao aprendizado
          contínuo.
        </p>

        <div className="certificacoes-stats">
          <div className="stat-item">
            <FaCertificate className="stat-icon" />

            <span className="stat-number">
              {stats.total || 0}
            </span>

            <span className="stat-label">
              Certificações
            </span>
          </div>

          <div className="stat-item">
            <FaAward className="stat-icon" />

            <span className="stat-number">
              {stats.totalHoras || 0}+
            </span>

            <span className="stat-label">
              Horas de Estudo
            </span>
          </div>

          <div className="stat-item">
            <FaGraduationCap className="stat-icon" />

            <span className="stat-number">
              {Object.keys(
                stats.categorias || {}
              ).length || 0}
            </span>

            <span className="stat-label">
              Áreas
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          FILTROS
      ================================================== */}

      <div className="filtros-container">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`filtro-btn ${
              filter === cat.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter(cat.id)
            }
          >
            {cat.label}

            {cat.id !== "todos" && (
              <span className="filtro-count">
                {
                  certificacoes.filter(
                    (c) =>
                      c.categoria ===
                      cat.id
                  ).length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ==================================================
          GRID
      ================================================== */}

      <div className="certificacoes-grid">
        {certificadosFiltrados.length > 0 ? (
          certificadosFiltrados.map(
            (cert) => {
              const PlataformaIcon =
                getPlataformaIcone(
                  cert.plataforma
                );

              return (
                <div
                  key={cert.id}
                  className={`certificacao-card ${
                    isAdmin
                      ? "admin-mode"
                      : ""
                  }`}
                >
                  {/* ==================================================
                      AÇÕES ADMIN
                      SÓ EXISTEM SE isAdmin === true
                  ================================================== */}

                  {isAdmin && (
                    <div className="certificacao-admin-actions">
                      <button
                        type="button"
                        className="cert-admin-edit"
                        onClick={(e) => {
                          e.stopPropagation();

                          abrirEditar(cert);
                        }}
                        title="Editar certificação"
                      >
                        <FaEdit />

                        <span>
                          Editar
                        </span>
                      </button>

                      <button
                        type="button"
                        className="cert-admin-delete"
                        onClick={(e) => {
                          e.stopPropagation();

                          excluirCertificacao(
                            cert.id,
                            cert.titulo
                          );
                        }}
                        title="Excluir certificação"
                      >
                        <FaTrash />

                        <span>
                          Excluir
                        </span>
                      </button>
                    </div>
                  )}

                  {/* ==================================================
                      IMAGEM
                  ================================================== */}

                  <div className="certificacao-imagem">
                    {cert.imagem_url ? (
                      <img
                        src={cert.imagem_url}
                        alt={cert.titulo}
                        className="certificado-thumb"
                        onClick={() =>
                          window.open(
                            cert.imagem_url,
                            "_blank"
                          )
                        }
                      />
                    ) : (
                      <div className="certificado-placeholder">
                        <FaImage className="placeholder-icon" />

                        <span>
                          Sem imagem
                        </span>

                        {/* UPLOAD SOMENTE ADMIN */}
                        {isAdmin && (
                          <button
                            type="button"
                            className="upload-btn"
                            onClick={() =>
                              abrirUpload(cert)
                            }
                          >
                            <FaFileUpload />
                            Upload
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ==================================================
                      PLATAFORMA / NÍVEL
                  ================================================== */}

                  <div className="certificacao-header">
                    <div className="plataforma-info">
                      <PlataformaIcon
                        className="plataforma-icon"
                        style={{
                          color:
                            cert.cor_plataforma ||
                            "#00d4ff",
                        }}
                      />

                      <span className="plataforma-nome">
                        {cert.plataforma}
                      </span>
                    </div>

                    <span
                      className="certificacao-nivel"
                      style={{
                        backgroundColor:
                          getNivelColor(
                            cert.nivel
                          ),
                      }}
                    >
                      {cert.nivel}
                    </span>
                  </div>

                  {/* ==================================================
                      TÍTULO
                  ================================================== */}

                  <h3 className="certificacao-titulo">
                    {cert.titulo}
                  </h3>

                  {/* ==================================================
                      DETALHES
                  ================================================== */}

                  <div className="certificacao-detalhes">
                    <span className="detalhe-item">
                      <FaCertificate className="detalhe-icon" />

                      {cert.carga_horaria}
                    </span>

                    <span className="detalhe-item">
                      📅{" "}
                      {cert.data_conclusao
                        ? new Date(
                            cert.data_conclusao
                          ).toLocaleDateString(
                            "pt-BR"
                          )
                        : "Data não informada"}
                    </span>
                  </div>

                  {/* ==================================================
                      HABILIDADES
                  ================================================== */}

                  <div className="certificacao-habilidades">
                    {cert.habilidades?.map(
                      (hab, index) => {
                        const IconeHab =
                          getIcone(
                            cert
                              .icones_habilidades?.[
                              index
                            ]
                          );

                        return (
                          <span
                            key={index}
                            className="habilidade-tag"
                          >
                            {IconeHab && (
                              <span className="habilidade-icon">
                                <IconeHab className="hab-icon" />
                              </span>
                            )}

                            {hab}
                          </span>
                        );
                      }
                    )}
                  </div>

                  {/* ==================================================
                      LINK
                  ================================================== */}

                  {cert.link_certificado && (
                    <a
                      href={
                        cert.link_certificado
                      }
                      className="certificacao-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver Certificado

                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              );
            }
          )
        ) : (
          <div className="sem-certificados">
            <p>
              Nenhuma certificação encontrada
              nesta categoria.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          MODAL DE UPLOAD
          SOMENTE ADMIN
      ================================================== */}

      {isAdmin &&
        showUploadModal && (
          <div
            className="modal-overlay"
            onClick={fecharUpload}
          >
            <div
              className="modal-content"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <h3>
                  Upload do Certificado
                </h3>

                <button
                  className="modal-close"
                  onClick={fecharUpload}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>
                    Certificação:
                  </strong>{" "}
                  {selectedCert?.titulo}
                </p>

                <div className="upload-area">
                  {previewUrl ? (
                    <div className="preview-container">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="preview-image"
                      />

                      <button
                        className="change-image-btn"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Trocar imagem
                      </button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleFileSelect
                        }
                        style={{
                          display: "none",
                        }}
                      />

                      <FaFileUpload className="upload-icon" />

                      <span>
                        Clique para selecionar
                        uma imagem
                      </span>

                      <small>
                        JPG, PNG ou PDF
                      </small>
                    </label>
                  )}
                </div>

                <button
                  className="upload-submit"
                  onClick={handleUpload}
                  disabled={
                    !selectedFile ||
                    uploading
                  }
                >
                  {uploading
                    ? "Enviando..."
                    : "Enviar Certificado"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ==================================================
          MODAL DE EDIÇÃO
          SOMENTE ADMIN
      ================================================== */}

      {isAdmin &&
        showEditModal && (
          <ModalCertificacao
            certificacao={
              certificacaoEditando
            }
            onClose={fecharEditar}
            onSave={salvarEdicao}
          />
        )}
    </section>
  );
};

export default Certificacoes;