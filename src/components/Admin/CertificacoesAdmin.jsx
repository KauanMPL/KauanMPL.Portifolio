import { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCertificate,
  FaUpload,
  FaTimes,
} from "react-icons/fa";

import { certificacoesAPI } from "../../lib/supabase";
import { ModalCertificacao } from "./ModalCertificacao";

import "./CertificacoesAdmin.css";

const CertificacoesAdmin = ({
  certificacoes: certificacoesProp = [],
  setCertificacoes: setCertificacoesProp,
  carregarCertificacoes: carregarCertificacoesProp,
}) => {
  // ============================================================
  // ESTADOS
  // ============================================================

  const [certificacoes, setCertificacoes] = useState(
    Array.isArray(certificacoesProp) ? certificacoesProp : []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [certificacaoEditando, setCertificacaoEditando] = useState(null);

  // ============================================================
  // SINCRONIZA COM O ADMIN
  // ============================================================

  useEffect(() => {
    if (Array.isArray(certificacoesProp)) {
      setCertificacoes(certificacoesProp);
    }
  }, [certificacoesProp]);

  // ============================================================
  // ATUALIZA ESTADO LOCAL E ADMIN
  // ============================================================

  const atualizarLista = (novaLista) => {
    const lista = Array.isArray(novaLista) ? novaLista : [];

    setCertificacoes(lista);

    if (typeof setCertificacoesProp === "function") {
      setCertificacoesProp(lista);
    }
  };

  // ============================================================
  // EXTRAI DADOS DO RETORNO DA API
  // ============================================================

  const extrairRegistro = (resultado) => {
    if (!resultado) {
      return null;
    }

    // Caso venha:
    // { data: {...} }
    if (resultado.data && !Array.isArray(resultado.data)) {
      return resultado.data;
    }

    // Caso venha:
    // [{...}]
    if (Array.isArray(resultado)) {
      return resultado[0] || null;
    }

    // Caso venha diretamente:
    // {...}
    return resultado;
  };

  // ============================================================
  // CARREGAR CERTIFICAÇÕES
  // ============================================================

  const carregarCertificacoes = async () => {
    try {
      setLoading(true);
      setError("");

      // Se o Admin já possui uma função oficial de carregamento,
      // usa ela primeiro.
      if (typeof carregarCertificacoesProp === "function") {
        const resultado = await carregarCertificacoesProp();

        // Algumas funções não retornam nada porque apenas atualizam
        // o estado no componente pai. Nesse caso não fazemos nada.
        if (Array.isArray(resultado)) {
          atualizarLista(resultado);
        }

        return;
      }

      // Fallback direto na API
      const resultado = await certificacoesAPI.getAll();

      const lista = Array.isArray(resultado)
        ? resultado
        : resultado?.data || [];

      atualizarLista(lista);
    } catch (err) {
      console.error("Erro ao carregar certificações:", err);

      const mensagem =
        err?.message ||
        err?.error_description ||
        "Erro ao carregar certificações.";

      setError(mensagem);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NOVA CERTIFICAÇÃO
  // ============================================================

  const abrirNovaCertificacao = () => {
    if (loading) return;

    setError("");
    setCertificacaoEditando(null);
    setShowModal(true);
  };

  // ============================================================
  // EDITAR CERTIFICAÇÃO
  // ============================================================

  const abrirEditarCertificacao = (certificacao) => {
    if (!certificacao?.id) {
      setError("Não foi possível editar: ID da certificação não encontrado.");
      console.error(
        "Certificação inválida para edição:",
        certificacao
      );
      return;
    }

    if (loading) return;

    setError("");
    setCertificacaoEditando(certificacao);
    setShowModal(true);
  };

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  const fecharModal = () => {
    if (loading) return;

    setShowModal(false);
    setCertificacaoEditando(null);
  };

  // ============================================================
  // SALVAR CERTIFICAÇÃO
  // ============================================================

  const salvarCertificacao = async (dados, arquivo) => {
    try {
      setLoading(true);
      setError("");

      if (!dados) {
        throw new Error("Nenhum dado foi enviado.");
      }

      let resultado;

      // ----------------------------------------------------------
      // EDITAR
      // ----------------------------------------------------------

      if (certificacaoEditando?.id) {
        console.log(
          "Atualizando certificação:",
          certificacaoEditando.id,
          dados
        );

        resultado = await certificacoesAPI.update(
          certificacaoEditando.id,
          dados
        );
      }

      // ----------------------------------------------------------
      // CRIAR
      // ----------------------------------------------------------

      else {
        console.log("Criando certificação:", dados);

        resultado = await certificacoesAPI.create(dados);
      }

      console.log("Resultado salvar certificação:", resultado);

      const certificacaoSalva = extrairRegistro(resultado);

      // ----------------------------------------------------------
      // SE A API NÃO RETORNAR O REGISTRO
      // ----------------------------------------------------------

      if (!certificacaoSalva?.id) {
        throw new Error(
          "A certificação foi processada, mas a API não retornou o ID do registro."
        );
      }

      // ----------------------------------------------------------
      // UPLOAD DA IMAGEM
      // ----------------------------------------------------------

      if (arquivo) {
        console.log(
          "Enviando imagem da certificação:",
          certificacaoSalva.id
        );

        await certificacoesAPI.uploadImagem(
          arquivo,
          certificacaoSalva.id
        );
      }

      // ----------------------------------------------------------
      // FECHA MODAL
      // ----------------------------------------------------------

      setShowModal(false);
      setCertificacaoEditando(null);

      // ----------------------------------------------------------
      // RECARREGA
      // ----------------------------------------------------------

      await carregarCertificacoes();

    } catch (err) {
      console.error(
        "ERRO COMPLETO AO SALVAR CERTIFICAÇÃO:",
        err
      );

      const mensagem =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        "Erro ao salvar certificação.";

      setError(mensagem);

      alert(`Erro ao salvar certificação:\n\n${mensagem}`);

      // Importante:
      // Não fecha o modal se deu erro.
      throw err;

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EXCLUIR CERTIFICAÇÃO
  // ============================================================

  const excluirCertificacao = async (certificacao) => {
    if (!certificacao?.id) {
      setError("Não foi possível excluir: ID não encontrado.");
      return;
    }

    if (loading) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a certificação?\n\n"${certificacao.titulo}"\n\nEssa ação não pode ser desfeita.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "Excluindo certificação:",
        certificacao.id
      );

      await certificacoesAPI.delete(certificacao.id);

      // ----------------------------------------------------------
      // REMOVE IMEDIATAMENTE DA TELA
      // ----------------------------------------------------------

      const novaLista = certificacoes.filter(
        (item) => item.id !== certificacao.id
      );

      atualizarLista(novaLista);

      // ----------------------------------------------------------
      // SINCRONIZA COM BANCO
      // ----------------------------------------------------------

      if (typeof carregarCertificacoesProp === "function") {
        const resultado = await carregarCertificacoesProp();

        if (Array.isArray(resultado)) {
          atualizarLista(resultado);
        }
      } else {
        const resultado = await certificacoesAPI.getAll();

        const lista = Array.isArray(resultado)
          ? resultado
          : resultado?.data || [];

        atualizarLista(lista);
      }

    } catch (err) {
      console.error(
        "ERRO COMPLETO AO EXCLUIR CERTIFICAÇÃO:",
        err
      );

      const mensagem =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        "Erro ao excluir certificação.";

      setError(mensagem);

      alert(`Erro ao excluir certificação:\n\n${mensagem}`);

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ATIVAR / DESATIVAR
  // ============================================================

  const toggleAtivo = async (certificacao) => {
    if (!certificacao?.id) {
      setError("ID da certificação não encontrado.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const novoStatus = !Boolean(certificacao.ativo);

      console.log(
        "Alterando status:",
        certificacao.id,
        novoStatus
      );

      await certificacoesAPI.update(
        certificacao.id,
        {
          ativo: novoStatus,
        }
      );

      // Atualização imediata
      const novaLista = certificacoes.map((item) =>
        item.id === certificacao.id
          ? {
              ...item,
              ativo: novoStatus,
            }
          : item
      );

      atualizarLista(novaLista);

      // Sincronização
      if (typeof carregarCertificacoesProp === "function") {
        const resultado = await carregarCertificacoesProp();

        if (Array.isArray(resultado)) {
          atualizarLista(resultado);
        }
      }

    } catch (err) {
      console.error(
        "ERRO AO ALTERAR STATUS:",
        err
      );

      const mensagem =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        "Erro ao alterar status da certificação.";

      setError(mensagem);

      alert(
        `Erro ao alterar status da certificação:\n\n${mensagem}`
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REMOVER IMAGEM
  // ============================================================

  const removerImagem = async (certificacao) => {
    if (!certificacao?.id) {
      setError("ID da certificação não encontrado.");
      return;
    }

    if (!certificacao.imagem_url) {
      return;
    }

    if (loading) return;

    const confirmar = window.confirm(
      `Remover a imagem da certificação "${certificacao.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "Removendo imagem:",
        certificacao.id
      );

      // ----------------------------------------------------------
      // Tenta remover usando nome_arquivo quando existir
      // ----------------------------------------------------------

      await certificacoesAPI.removerImagem(
        certificacao.id,
        certificacao.nome_arquivo || null
      );

      // ----------------------------------------------------------
      // Atualiza imediatamente
      // ----------------------------------------------------------

      const novaLista = certificacoes.map((item) =>
        item.id === certificacao.id
          ? {
              ...item,
              imagem_url: null,
              nome_arquivo: null,
            }
          : item
      );

      atualizarLista(novaLista);

      // ----------------------------------------------------------
      // Sincroniza
      // ----------------------------------------------------------

      if (typeof carregarCertificacoesProp === "function") {
        const resultado = await carregarCertificacoesProp();

        if (Array.isArray(resultado)) {
          atualizarLista(resultado);
        }
      }

    } catch (err) {
      console.error(
        "ERRO AO REMOVER IMAGEM:",
        err
      );

      const mensagem =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        "Erro ao remover imagem.";

      setError(mensagem);

      alert(`Erro ao remover imagem:\n\n${mensagem}`);

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CATEGORIA
  // ============================================================

  const formatarCategoria = (categoria) => {
    const categorias = {
      frontend: "Front-End",
      "back-end": "Back-End",
      database: "Database",
      devops: "DevOps",
      cloud: "Cloud",
    };

    return categorias[categoria] || categoria || "-";
  };

  // ============================================================
  // COR DO NÍVEL
  // ============================================================

  const getNivelColor = (nivel) => {
    const cores = {
      Básico: "#4CAF50",
      Intermediário: "#FF9800",
      Avançado: "#f44336",
    };

    return cores[nivel] || "#4CAF50";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="certificacoes-admin">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="admin-header">

        <div className="admin-header-title">

          <div>
            <h2>Certificações</h2>

            <span className="admin-header-count">
              {certificacoes.length}{" "}
              {certificacoes.length === 1
                ? "certificação"
                : "certificações"}
            </span>
          </div>

        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={abrirNovaCertificacao}
          disabled={loading}
        >
          <FaPlus />
          Nova Certificação
        </button>

      </div>

      {/* ======================================================
          ERRO
      ====================================================== */}

      {error && (
        <div className="admin-error">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            title="Fechar"
          >
            <FaTimes />
          </button>

        </div>
      )}

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="admin-loading-small">
          Processando...
        </div>
      )}

      {/* ======================================================
          LISTA VAZIA
      ====================================================== */}

      {certificacoes.length === 0 ? (

        <div className="empty-state">

          <FaCertificate className="empty-icon" />

          <h3>
            Nenhuma certificação cadastrada
          </h3>

          <p>
            Adicione sua primeira certificação.
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={abrirNovaCertificacao}
            disabled={loading}
          >
            <FaPlus />
            Adicionar Certificação
          </button>

        </div>

      ) : (

        /* ======================================================
           TABELA
        ====================================================== */

        <div className="admin-table">

          <table>

            <thead>

              <tr>
                <th>Ordem</th>
                <th>Imagem</th>
                <th>Título</th>
                <th>Plataforma</th>
                <th>Nível</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>

            </thead>

            <tbody>

              {certificacoes.map((cert) => (

                <tr key={cert.id}>

                  {/* ORDEM */}

                  <td>
                    {cert.ordem ?? 0}
                  </td>

                  {/* IMAGEM */}

                  <td>

                    {cert.imagem_url ? (

                      <div className="admin-image-wrapper">

                        <img
                          src={cert.imagem_url}
                          alt={cert.titulo || "Certificação"}
                          className="admin-thumbnail"
                        />

                      </div>

                    ) : (

                      <div className="admin-no-image">
                        <FaImage />
                      </div>

                    )}

                  </td>

                  {/* TÍTULO */}

                  <td className="titulo-cell">

                    <strong>
                      {cert.titulo || "Sem título"}
                    </strong>

                  </td>

                  {/* PLATAFORMA */}

                  <td>
                    {cert.plataforma || "-"}
                  </td>

                  {/* NÍVEL */}

                  <td>

                    <span
                      className="nivel-badge"
                      style={{
                        backgroundColor:
                          getNivelColor(cert.nivel),
                      }}
                    >
                      {cert.nivel || "Básico"}
                    </span>

                  </td>

                  {/* CATEGORIA */}

                  <td>

                    <span className="categoria-badge">
                      {formatarCategoria(cert.categoria)}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <button
                      type="button"
                      className={`status-btn ${
                        cert.ativo
                          ? "active"
                          : "inactive"
                      }`}
                      onClick={() =>
                        toggleAtivo(cert)
                      }
                      disabled={loading}
                      title={
                        cert.ativo
                          ? "Desativar certificação"
                          : "Ativar certificação"
                      }
                    >

                      {cert.ativo ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}

                    </button>

                  </td>

                  {/* AÇÕES */}

                  <td>

                    <div className="actions">

                      {/* EDITAR */}

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          abrirEditarCertificacao(cert)
                        }
                        disabled={loading}
                        title="Editar certificação"
                      >
                        <FaEdit />
                      </button>

                      {/* REMOVER IMAGEM */}

                      {cert.imagem_url && (

                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() =>
                            removerImagem(cert)
                          }
                          disabled={loading}
                          title="Remover imagem"
                        >
                          <FaUpload />
                        </button>

                      )}

                      {/* EXCLUIR */}

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          excluirCertificacao(cert)
                        }
                        disabled={loading}
                        title="Excluir certificação"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* ======================================================
          MODAL
      ====================================================== */}

      {showModal && (

        <ModalCertificacao
          certificacao={certificacaoEditando}
          onClose={fecharModal}
          onSave={salvarCertificacao}
        />

      )}

    </div>
  );
};

export default CertificacoesAdmin;