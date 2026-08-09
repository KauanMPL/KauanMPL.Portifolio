import { useEffect, useRef, useState } from "react";
import "./Faculdade.css";
import { supabase } from "../lib/supabase";

function Faculdade() {
  const [materias, setMaterias] = useState([]);

  const [materiaSelecionada, setMateriaSelecionada] =
    useState(null);

  const [aulaSelecionada, setAulaSelecionada] =
    useState(null);

  const [admin, setAdmin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [modal, setModal] = useState(null);

  const [materiaEditando, setMateriaEditando] =
    useState(null);

  const [aulaEditando, setAulaEditando] =
    useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const fileInputRef = useRef(null);

  /*
   * ==========================================
   * CARREGAMENTO INICIAL
   * ==========================================
   */

  useEffect(() => {
    iniciar();
  }, []);

  async function iniciar() {
    setCarregando(true);
    setErro("");

    try {
      await verificarUsuario();
      await carregarMaterias();
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar os dados da faculdade."
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
   * ==========================================
   * AUTENTICAÇÃO
   * ==========================================
   */

  async function verificarUsuario() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUsuario(session.user);

      /*
       * IMPORTANTE:
       * O acesso real é protegido pelo RLS do Supabase.
       *
       * Aqui verificamos apenas se o usuário possui
       * a flag de administrador nos metadados.
       */

      const ehAdmin =
        session.user.user_metadata?.is_admin === true;

      setAdmin(ehAdmin);
    } else {
      setUsuario(null);
      setAdmin(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, sessionAtual) => {
        if (sessionAtual?.user) {
          setUsuario(sessionAtual.user);

          const ehAdmin =
            sessionAtual.user.user_metadata?.is_admin ===
            true;

          setAdmin(ehAdmin);
        } else {
          setUsuario(null);
          setAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }

  async function loginAdmin() {
    const email = window.prompt(
      "Digite o e-mail do administrador:"
    );

    if (!email) return;

    const senha = window.prompt(
      "Digite a senha do administrador:"
    );

    if (!senha) return;

    setErro("");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (error) {
      console.error(error);

      alert(
        "Não foi possível fazer login.\n\n" +
          error.message
      );

      return;
    }

    if (
      !data.user?.user_metadata?.is_admin
    ) {
      await supabase.auth.signOut();

      alert(
        "Este usuário não possui permissão de administrador."
      );

      return;
    }

    setUsuario(data.user);
    setAdmin(true);
  }

  async function logoutAdmin() {
    const confirmar = window.confirm(
      "Deseja sair do modo administrador?"
    );

    if (!confirmar) return;

    await supabase.auth.signOut();

    setUsuario(null);
    setAdmin(false);

    setMateriaSelecionada(null);
    setAulaSelecionada(null);
  }

  /*
   * ==========================================
   * MATÉRIAS
   * ==========================================
   */

  async function carregarMaterias() {
    setErro("");

    const { data, error } = await supabase
      .from("materias")
      .select(`
        id,
        nome,
        sigla,
        descricao,
        cor,
        aulas (
          id,
          materia_id,
          titulo,
          data,
          conteudo,
          anotacoes,
          created_at
        )
      `)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erro ao carregar matérias:",
        error
      );

      throw error;
    }

    const materiasFormatadas = (data || []).map(
      (materia) => ({
        ...materia,
        aulas: (materia.aulas || []).sort(
          (a, b) =>
            new Date(a.created_at || 0) -
            new Date(b.created_at || 0)
        ),
      })
    );

    setMaterias(materiasFormatadas);
  }

  async function salvarMateria(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    setErro("");

    try {
      if (materiaEditando) {
        const { error } = await supabase
          .from("materias")
          .update({
            nome: dados.nome,
            sigla: dados.sigla,
            descricao: dados.descricao,
            cor: dados.cor,
          })
          .eq("id", materiaEditando.id);

        if (error) throw error;

        alert("Matéria atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("materias")
          .insert({
            nome: dados.nome,
            sigla: dados.sigla,
            descricao: dados.descricao,
            cor: dados.cor,
          });

        if (error) throw error;

        alert("Matéria criada com sucesso!");
      }

      await carregarMaterias();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a matéria.\n\n" +
          error.message
      );
    }
  }

  async function excluirMateria(id) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta matéria e todas as suas aulas?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("materias")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (materiaSelecionada?.id === id) {
        setMateriaSelecionada(null);
        setAulaSelecionada(null);
      }

      await carregarMaterias();

      alert("Matéria excluída com sucesso!");
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a matéria.\n\n" +
          error.message
      );
    }
  }

  /*
   * ==========================================
   * AULAS
   * ==========================================
   */

  async function salvarAula(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    if (!materiaSelecionada) {
      alert("Nenhuma matéria selecionada.");
      return;
    }

    try {
      if (aulaEditando) {
        const { error } = await supabase
          .from("aulas")
          .update({
            titulo: dados.titulo,
            data: dados.data,
            conteudo: dados.conteudo,
            anotacoes: dados.anotacoes,
          })
          .eq("id", aulaEditando.id);

        if (error) throw error;

        alert("Aula atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("aulas")
          .insert({
            materia_id: materiaSelecionada.id,
            titulo: dados.titulo,
            data: dados.data,
            conteudo: dados.conteudo,
            anotacoes: dados.anotacoes,
          });

        if (error) throw error;

        alert("Aula criada com sucesso!");
      }

      await carregarMaterias();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a aula.\n\n" +
          error.message
      );
    }
  }

  async function excluirAula(aulaId) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta aula?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("aulas")
        .delete()
        .eq("id", aulaId);

      if (error) throw error;

      setAulaSelecionada(null);

      await carregarMaterias();

      alert("Aula excluída com sucesso!");
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a aula.\n\n" +
          error.message
      );
    }
  }

  /*
   * ==========================================
   * MODAIS
   * ==========================================
   */

  function abrirNovaMateria() {
    if (!admin) return;

    setMateriaEditando(null);
    setModal("materia");
  }

  function editarMateria(materia) {
    if (!admin) return;

    setMateriaEditando(materia);
    setModal("materia");
  }

  function abrirNovaAula() {
    if (!admin) return;

    setAulaEditando(null);
    setModal("aula");
  }

  function editarAula(aula) {
    if (!admin) return;

    setAulaEditando(aula);
    setModal("aula");
  }

  function fecharModal() {
    setModal(null);
    setMateriaEditando(null);
    setAulaEditando(null);
  }

  /*
   * ==========================================
   * BACKUP
   * ==========================================
   */

  function exportarBackup() {
    const dados = JSON.stringify(
      materias,
      null,
      2
    );

    const blob = new Blob([dados], {
      type: "application/json",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "kauan-faculdade-backup.json";

    link.click();

    URL.revokeObjectURL(url);
  }

  function abrirImportacao() {
    fileInputRef.current?.click();
  }

  async function importarBackup(event) {
    const arquivo =
      event.target.files?.[0];

    if (!arquivo) return;

    const leitor =
      new FileReader();

    leitor.onload = async (e) => {
      try {
        const dados =
          JSON.parse(e.target.result);

        if (!Array.isArray(dados)) {
          throw new Error(
            "Formato inválido"
          );
        }

        const confirmar =
          window.confirm(
            "Importar este backup irá adicionar as matérias e aulas ao banco. Continuar?"
          );

        if (!confirmar) return;

        for (const materia of dados) {
          const {
            id,
            aulas,
            ...dadosMateria
          } = materia;

          const {
            data: novaMateria,
            error: erroMateria,
          } = await supabase
            .from("materias")
            .insert(dadosMateria)
            .select()
            .single();

          if (erroMateria) {
            throw erroMateria;
          }

          if (
            Array.isArray(aulas) &&
            aulas.length > 0
          ) {
            const aulasFormatadas =
              aulas.map((aula) => ({
                titulo: aula.titulo,
                data: aula.data,
                conteudo:
                  aula.conteudo,
                anotacoes:
                  aula.anotacoes,
                materia_id:
                  novaMateria.id,
              }));

            const {
              error: erroAulas,
            } = await supabase
              .from("aulas")
              .insert(
                aulasFormatadas
              );

            if (erroAulas) {
              throw erroAulas;
            }
          }
        }

        await carregarMaterias();

        setMateriaSelecionada(null);
        setAulaSelecionada(null);

        alert(
          "Backup importado com sucesso!"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Não foi possível importar o backup.\n\n" +
            error.message
        );
      }
    };

    leitor.readAsText(arquivo);

    event.target.value = "";
  }

  /*
   * ==========================================
   * NAVEGAÇÃO
   * ==========================================
   */

  function abrirMateria(materia) {
    setMateriaSelecionada(materia);
    setAulaSelecionada(null);
  }

  function voltarMaterias() {
    setMateriaSelecionada(null);
    setAulaSelecionada(null);
  }

  function abrirAula(aula) {
    setAulaSelecionada(aula);
  }

  function voltarAulas() {
    setAulaSelecionada(null);
  }

  /*
   * ==========================================
   * DADOS ATUAIS
   * ==========================================
   */

  const materiaAtualizada =
    materiaSelecionada
      ? materias.find(
          (materia) =>
            materia.id ===
            materiaSelecionada.id
        )
      : null;

  const aulaAtualizada =
    materiaAtualizada &&
    aulaSelecionada
      ? materiaAtualizada.aulas.find(
          (aula) =>
            aula.id ===
            aulaSelecionada.id
        )
      : null;

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <section
      className="faculdade-section"
      id="faculdade"
    >

      {/* ================================
          CABEÇALHO
      ================================= */}

      <div className="faculdade-title">

        <div>

          <div className="section-title-faculdade">

            <span>04 //</span>

            <h2>
              Faculdade
            </h2>

          </div>

          <p className="faculdade-description">
            Meu diário acadêmico, onde registro minhas
            aulas, conteúdos e aprendizados durante a
            graduação.
          </p>

        </div>

        <button
          className={`admin-button ${
            admin ? "active" : ""
          }`}
          onClick={
            admin
              ? logoutAdmin
              : loginAdmin
          }
        >
          {admin
            ? "✓ Admin ativo"
            : "⚙ Administrar"}
        </button>

      </div>


      {/* ================================
          CARREGANDO
      ================================= */}

      {carregando && (
        <div className="empty-lessons">

          <span>⟳</span>

          <h3>
            Carregando faculdade...
          </h3>

          <p>
            Buscando matérias e aulas no
            banco de dados.
          </p>

        </div>
      )}


      {/* ================================
          ERRO
      ================================= */}

      {!carregando && erro && (
        <div className="empty-lessons">

          <span>⚠</span>

          <h3>
            Erro ao carregar
          </h3>

          <p>
            {erro}
          </p>

          <button
            className="admin-primary"
            onClick={iniciar}
          >
            Tentar novamente
          </button>

        </div>
      )}


      {!carregando &&
        !erro && (
          <>

            {/* ================================
                ADMIN
            ================================= */}

            {admin && (
              <div className="admin-panel">

                <div className="admin-panel-header">

                  <div>

                    <span>
                      PAINEL ADMINISTRATIVO
                    </span>

                    <h3>
                      Gerenciar faculdade
                    </h3>

                    {usuario?.email && (
                      <small>
                        Logado como:{" "}
                        {usuario.email}
                      </small>
                    )}

                  </div>

                  <div className="admin-actions">

                    <button
                      onClick={
                        abrirNovaMateria
                      }
                      className="admin-primary"
                    >
                      + Nova matéria
                    </button>

                    <button
                      onClick={
                        exportarBackup
                      }
                      className="admin-secondary"
                    >
                      ↓ Exportar backup
                    </button>

                    <button
                      onClick={
                        abrirImportacao
                      }
                      className="admin-secondary"
                    >
                      ↑ Importar backup
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      hidden
                      onChange={
                        importarBackup
                      }
                    />

                  </div>

                </div>

              </div>
            )}


            {/* ================================
                LISTA DE MATÉRIAS
            ================================= */}

            {!materiaAtualizada && (

              <div className="materias-grid">

                {materias.length === 0 ? (

                  <div className="empty-lessons">

                    <span>
                      📚
                    </span>

                    <h3>
                      Nenhuma matéria cadastrada
                    </h3>

                    <p>
                      {admin
                        ? "Comece adicionando sua primeira matéria."
                        : "Nenhuma matéria foi cadastrada ainda."}
                    </p>

                    {admin && (
                      <button
                        className="admin-primary"
                        onClick={
                          abrirNovaMateria
                        }
                      >
                        + Nova matéria
                      </button>
                    )}

                  </div>

                ) : (

                  materias.map(
                    (materia) => (

                      <article
                        className={`materia-card ${materia.cor}`}
                        key={materia.id}
                      >

                        <button
                          className="materia-open"
                          onClick={() =>
                            abrirMateria(
                              materia
                            )
                          }
                        >

                          <div className="materia-top">

                            <div className="materia-icon">
                              {materia.sigla}
                            </div>

                            <span className="materia-arrow">
                              →
                            </span>

                          </div>

                          <h3>
                            {materia.nome}
                          </h3>

                          <p>
                            {materia.descricao}
                          </p>

                          <div className="materia-footer">

                            <span>
                              {
                                materia
                                  .aulas
                                  .length
                              }{" "}
                              {
                                materia
                                  .aulas
                                  .length ===
                                1
                                  ? "aula"
                                  : "aulas"
                              }
                            </span>

                            {materia.aulas
                              .length >
                              0 && (
                              <span>
                                Última:{" "}
                                {
                                  materia
                                    .aulas[
                                    materia
                                      .aulas
                                      .length -
                                      1
                                  ].data
                                }
                              </span>
                            )}

                          </div>

                        </button>


                        {/* ADMIN DA MATÉRIA */}

                        {admin && (
                          <div className="materia-admin">

                            <button
                              onClick={() =>
                                editarMateria(
                                  materia
                                )
                              }
                            >
                              ✏ Editar
                            </button>

                            <button
                              onClick={() =>
                                excluirMateria(
                                  materia.id
                                )
                              }
                              className="delete-button"
                            >
                              🗑 Excluir
                            </button>

                          </div>
                        )}

                      </article>

                    )
                  )

                )}

              </div>

            )}


            {/* ================================
                MATÉRIA ABERTA
            ================================= */}

            {materiaAtualizada &&
              !aulaAtualizada && (

                <div className="materia-page">

                  <button
                    className="back-faculdade"
                    onClick={
                      voltarMaterias
                    }
                  >
                    ← Voltar para matérias
                  </button>


                  <div className="materia-page-header">

                    <div className="materia-icon large">
                      {
                        materiaAtualizada
                          .sigla
                      }
                    </div>

                    <div>

                      <span>
                        DISCIPLINA
                      </span>

                      <h2>
                        {
                          materiaAtualizada
                            .nome
                        }
                      </h2>

                      <p>
                        {
                          materiaAtualizada
                            .descricao
                        }
                      </p>

                    </div>

                  </div>


                  {admin && (
                    <div className="aula-actions">

                      <button
                        className="admin-primary"
                        onClick={
                          abrirNovaAula
                        }
                      >
                        + Nova aula
                      </button>

                    </div>
                  )}


                  {materiaAtualizada
                    .aulas
                    .length ===
                  0 ? (

                    <div className="empty-lessons">

                      <span>
                        📚
                      </span>

                      <h3>
                        Nenhuma aula cadastrada
                      </h3>

                      <p>
                        Comece adicionando
                        a primeira aula
                        desta matéria.
                      </p>

                      {admin && (
                        <button
                          className="admin-primary"
                          onClick={
                            abrirNovaAula
                          }
                        >
                          + Cadastrar primeira aula
                        </button>
                      )}

                    </div>

                  ) : (

                    <div className="aulas-list">

                      {
                        materiaAtualizada
                          .aulas
                          .map(
                            (
                              aula,
                              index
                            ) => (

                              <article
                                className="aula-card"
                                key={
                                  aula.id
                                }
                              >

                                <button
                                  className="aula-open"
                                  onClick={() =>
                                    abrirAula(
                                      aula
                                    )
                                  }
                                >

                                  <div className="aula-number">
                                    {String(
                                      index +
                                        1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </div>

                                  <div className="aula-info">

                                    <span>
                                      AULA{" "}
                                      {String(
                                        index +
                                          1
                                      ).padStart(
                                        2,
                                        "0"
                                      )}
                                    </span>

                                    <h3>
                                      {
                                        aula.titulo
                                      }
                                    </h3>

                                    <p>
                                      {
                                        aula.data
                                      }
                                    </p>

                                  </div>

                                  <strong>
                                    →
                                  </strong>

                                </button>


                                {admin && (
                                  <div className="aula-admin">

                                    <button
                                      onClick={() =>
                                        editarAula(
                                          aula
                                        )
                                      }
                                    >
                                      ✏
                                    </button>

                                    <button
                                      className="delete-button"
                                      onClick={() =>
                                        excluirAula(
                                          aula.id
                                        )
                                      }
                                    >
                                      🗑
                                    </button>

                                  </div>
                                )}

                              </article>

                            )
                          )
                      }

                    </div>

                  )}

                </div>

              )}


            {/* ================================
                CONTEÚDO DA AULA
            ================================= */}

            {aulaAtualizada && (

              <article className="aula-conteudo">

                <button
                  className="back-faculdade"
                  onClick={
                    voltarAulas
                  }
                >
                  ← Voltar para aulas
                </button>

                <span className="aula-label">
                  AULA
                </span>

                <h2>
                  {
                    aulaAtualizada
                      .titulo
                  }
                </h2>

                <span className="aula-data">
                  {
                    aulaAtualizada
                      .data
                  }
                </span>

                {admin && (
                  <div className="conteudo-admin">

                    <button
                      onClick={() =>
                        editarAula(
                          aulaAtualizada
                        )
                      }
                    >
                      ✏ Editar aula
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        excluirAula(
                          aulaAtualizada.id
                        )
                      }
                    >
                      🗑 Excluir
                    </button>

                  </div>
                )}

                <div className="aula-line"></div>

                <h3>
                  O que foi estudado
                </h3>

                <div className="texto-aula">

                  {aulaAtualizada
                    .conteudo
                    .split("\n")
                    .map(
                      (
                        linha,
                        index
                      ) => (
                        <p
                          key={
                            index
                          }
                        >
                          {
                            linha ||
                            "\u00A0"
                          }
                        </p>
                      )
                    )}

                </div>

                {aulaAtualizada
                  .anotacoes && (
                  <>
                    <h3>
                      Minhas anotações
                    </h3>

                    <div className="anotacoes-box">

                      {
                        aulaAtualizada
                          .anotacoes
                          .split("\n")
                          .map(
                            (
                              linha,
                              index
                            ) => (
                              <p
                                key={
                                  index
                                }
                              >
                                {
                                  linha ||
                                  "\u00A0"
                                }
                              </p>
                            )
                          )
                      }

                    </div>
                  </>
                )}

              </article>

            )}

          </>
        )}


      {/* ================================
          MODAL MATÉRIA
      ================================= */}

      {modal === "materia" && (
        <ModalMateria
          materia={
            materiaEditando
          }
          onClose={
            fecharModal
          }
          onSave={
            salvarMateria
          }
        />
      )}


      {/* ================================
          MODAL AULA
      ================================= */}

      {modal === "aula" && (
        <ModalAula
          aula={
            aulaEditando
          }
          onClose={
            fecharModal
          }
          onSave={
            salvarAula
          }
        />
      )}

    </section>
  );
}


/*
 * ==========================================
 * MODAL MATÉRIA
 * ==========================================
 */

function ModalMateria({
  materia,
  onClose,
  onSave,
}) {
  const [nome, setNome] =
    useState(
      materia?.nome || ""
    );

  const [sigla, setSigla] =
    useState(
      materia?.sigla || ""
    );

  const [descricao, setDescricao] =
    useState(
      materia?.descricao || ""
    );

  const [cor, setCor] =
    useState(
      materia?.cor || "cyan"
    );

  function enviar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      alert(
        "Digite o nome da matéria."
      );
      return;
    }

    if (!sigla.trim()) {
      alert(
        "Digite a sigla da matéria."
      );
      return;
    }

    onSave({
      nome: nome.trim(),
      sigla: sigla
        .trim()
        .toUpperCase(),
      descricao:
        descricao.trim(),
      cor,
    });
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <div>

            <span>
              {materia
                ? "EDITAR MATÉRIA"
                : "NOVA MATÉRIA"}
            </span>

            <h2>
              {materia
                ? "Editar matéria"
                : "Cadastrar matéria"}
            </h2>

          </div>

          <button
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form onSubmit={enviar}>

          <label>
            Nome da matéria

            <input
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              placeholder="Ex: Banco de Dados"
            />

          </label>


          <label>
            Sigla

            <input
              value={sigla}
              onChange={(e) =>
                setSigla(
                  e.target.value
                )
              }
              maxLength={5}
              placeholder="Ex: BD"
            />

          </label>


          <label>
            Descrição

            <input
              value={descricao}
              onChange={(e) =>
                setDescricao(
                  e.target.value
                )
              }
              placeholder="Descrição da matéria"
            />

          </label>


          <label>
            Cor

            <select
              value={cor}
              onChange={(e) =>
                setCor(
                  e.target.value
                )
              }
            >

              <option value="cyan">
                Azul Neon
              </option>

              <option value="purple">
                Roxo Neon
              </option>

              <option value="pink">
                Rosa Neon
              </option>

              <option value="green">
                Verde Neon
              </option>

            </select>

          </label>


          <div className="modal-buttons">

            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {materia
                ? "Salvar alterações"
                : "Criar matéria"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/*
 * ==========================================
 * MODAL AULA
 * ==========================================
 */

function ModalAula({
  aula,
  onClose,
  onSave,
}) {
  const [titulo, setTitulo] =
    useState(
      aula?.titulo || ""
    );

  const [data, setData] =
    useState(
      aula?.data ||
        new Date().toLocaleDateString(
          "pt-BR"
        )
    );

  const [conteudo, setConteudo] =
    useState(
      aula?.conteudo || ""
    );

  const [anotacoes, setAnotacoes] =
    useState(
      aula?.anotacoes || ""
    );

  function enviar(event) {
    event.preventDefault();

    if (!titulo.trim()) {
      alert(
        "Digite o título da aula."
      );
      return;
    }

    if (!conteudo.trim()) {
      alert(
        "Digite o conteúdo da aula."
      );
      return;
    }

    onSave({
      titulo: titulo.trim(),
      data: data.trim(),
      conteudo:
        conteudo.trim(),
      anotacoes:
        anotacoes.trim(),
    });
  }

  return (
    <div className="modal-overlay">

      <div className="modal modal-large">

        <div className="modal-header">

          <div>

            <span>
              {aula
                ? "EDITAR AULA"
                : "NOVA AULA"}
            </span>

            <h2>
              {aula
                ? "Editar aula"
                : "Cadastrar aula"}
            </h2>

          </div>

          <button
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form onSubmit={enviar}>

          <label>
            Título da aula

            <input
              value={titulo}
              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }
              placeholder="Ex: Normalização de Banco de Dados"
            />

          </label>


          <label>
            Data

            <input
              value={data}
              onChange={(e) =>
                setData(
                  e.target.value
                )
              }
              placeholder="09/08/2026"
            />

          </label>


          <label>
            Conteúdo da aula

            <textarea
              value={conteudo}
              onChange={(e) =>
                setConteudo(
                  e.target.value
                )
              }
              rows={8}
              placeholder="Escreva aqui o conteúdo estudado..."
            />

          </label>


          <label>
            Minhas anotações

            <textarea
              value={anotacoes}
              onChange={(e) =>
                setAnotacoes(
                  e.target.value
                )
              }
              rows={6}
              placeholder="Escreva suas observações, exemplos, dúvidas..."
            />

          </label>


          <div className="modal-buttons">

            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {aula
                ? "Salvar alterações"
                : "Cadastrar aula"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Faculdade;