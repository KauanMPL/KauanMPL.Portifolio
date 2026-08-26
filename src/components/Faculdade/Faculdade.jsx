import { useEffect, useState } from "react";
import "./Faculdade.css";
import { supabase } from "../../lib/supabase.js";

// IMPORTAÇÕES CORRETAS
import { useAdmin } from "../Admin/useAdmin.js";
import { Admin } from "../Admin/Admin.jsx";

function Faculdade() {
  const [materias, setMaterias] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] =
    useState(null);
  const [aulaSelecionada, setAulaSelecionada] =
    useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const admin = useAdmin({
    materias,
    setMaterias,
    materiaSelecionada,
    onMateriaDeleted: () => {
      setMateriaSelecionada(null);
      setAulaSelecionada(null);
    },
  });

  useEffect(() => {
    iniciar();
  }, []);

  async function iniciar() {
    setCarregando(true);
    setErro("");

    try {
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

  async function carregarMaterias() {
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

  const materiaAtualizada =
    materiaSelecionada
      ? materias.find(
          (materia) =>
            materia.id ===
            materiaSelecionada.id
        )
      : null;

  const aulaAtualizada =
    materiaAtualizada && aulaSelecionada
      ? materiaAtualizada.aulas.find(
          (aula) =>
            aula.id === aulaSelecionada.id
        )
      : null;

  return (
    <section
      className="faculdade-section"
      id="faculdade"
    >
      <div className="faculdade-title">
        <div>
          <div className="section-title-faculdade">
            <span>04</span>

            <h2>Faculdade</h2>
          </div>

          <p className="faculdade-description">
            Meu diário acadêmico, onde registro minhas
            aulas, conteúdos e aprendizados durante a
            graduação.
          </p>
        </div>

        <Admin {...admin} />
      </div>

      {carregando && (
        <div className="empty-lessons">
          <span>⟳</span>

          <h3>Carregando faculdade...</h3>

          <p>
            Buscando matérias e aulas no banco de
            dados.
          </p>
        </div>
      )}

      {!carregando && erro && (
        <div className="empty-lessons">
          <span>⚠</span>

          <h3>Erro ao carregar</h3>

          <p>{erro}</p>

          <button
            className="admin-primary"
            onClick={iniciar}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erro && (
        <>
          {!materiaAtualizada && (
            <div className="materias-grid">
              {materias.length === 0 ? (
                <div className="empty-lessons">
                  <span>📚</span>

                  <h3>
                    Nenhuma matéria cadastrada
                  </h3>

                  <p>
                    {admin.admin
                      ? "Comece adicionando sua primeira matéria."
                      : "Nenhuma matéria foi cadastrada ainda."}
                  </p>

                  {admin.admin && (
                    <button
                      className="admin-primary"
                      onClick={
                        admin.abrirNovaMateria
                      }
                    >
                      + Nova matéria
                    </button>
                  )}
                </div>
              ) : (
                materias.map((materia) => (
                  <article
                    className={`materia-card ${materia.cor}`}
                    key={materia.id}
                  >
                    <button
                      className="materia-open"
                      onClick={() =>
                        abrirMateria(materia)
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

                      <h3>{materia.nome}</h3>

                      <p>{materia.descricao}</p>

                      <div className="materia-footer">
                        <span>
                          {materia.aulas.length}{" "}
                          {materia.aulas.length === 1
                            ? "aula"
                            : "aulas"}
                        </span>

                        {materia.aulas.length > 0 && (
                          <span>
                            Última:{" "}
                            {
                              materia.aulas[
                                materia.aulas.length - 1
                              ].data
                            }
                          </span>
                        )}
                      </div>
                    </button>

                    {admin.admin && (
                      <div className="materia-admin">
                        <button
                          onClick={() =>
                            admin.editarMateria(
                              materia
                            )
                          }
                        >
                          ✏ Editar
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            admin.excluirMateria(
                              materia.id
                            )
                          }
                        >
                          🗑 Excluir
                        </button>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          )}

          {materiaAtualizada &&
            !aulaAtualizada && (
              <div className="materia-page">
                <button
                  className="back-faculdade"
                  onClick={voltarMaterias}
                >
                  ← Voltar para matérias
                </button>

                <div className="materia-page-header">
                  <div className="materia-icon large">
                    {materiaAtualizada.sigla}
                  </div>

                  <div>
                    <span>DISCIPLINA</span>

                    <h2>
                      {materiaAtualizada.nome}
                    </h2>

                    <p>
                      {materiaAtualizada.descricao}
                    </p>
                  </div>
                </div>

                {admin.admin && (
                  <div className="aula-actions">
                    <button
                      className="admin-primary"
                      onClick={
                        admin.abrirNovaAula
                      }
                    >
                      + Nova aula
                    </button>
                  </div>
                )}

                {materiaAtualizada.aulas.length ===
                0 ? (
                  <div className="empty-lessons">
                    <span>📚</span>

                    <h3>
                      Nenhuma aula cadastrada
                    </h3>

                    <p>
                      Comece adicionando a primeira
                      aula desta matéria.
                    </p>

                    {admin.admin && (
                      <button
                        className="admin-primary"
                        onClick={
                          admin.abrirNovaAula
                        }
                      >
                        + Cadastrar primeira aula
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="aulas-list">
                    {materiaAtualizada.aulas.map(
                      (aula, index) => (
                        <article
                          className="aula-card"
                          key={aula.id}
                        >
                          <button
                            className="aula-open"
                            onClick={() =>
                              abrirAula(aula)
                            }
                          >
                            <div className="aula-number">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div className="aula-info">
                              <span>
                                AULA{" "}
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <h3>{aula.titulo}</h3>

                              <p>{aula.data}</p>
                            </div>

                            <strong>→</strong>
                          </button>

                          {admin.admin && (
                            <div className="aula-admin">
                              <button
                                onClick={() =>
                                  admin.editarAula(
                                    aula
                                  )
                                }
                              >
                                ✏
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  admin.excluirAula(
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
                    )}
                  </div>
                )}
              </div>
            )}

          {aulaAtualizada && (
            <article className="aula-conteudo">
              <button
                className="back-faculdade"
                onClick={voltarAulas}
              >
                ← Voltar para aulas
              </button>

              <span className="aula-label">
                AULA
              </span>

              <h2>{aulaAtualizada.titulo}</h2>

              <span className="aula-data">
                {aulaAtualizada.data}
              </span>

              {admin.admin && (
                <div className="conteudo-admin">
                  <button
                    onClick={() =>
                      admin.editarAula(
                        aulaAtualizada
                      )
                    }
                  >
                    ✏ Editar aula
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      admin.excluirAula(
                        aulaAtualizada.id
                      )
                    }
                  >
                    🗑 Excluir
                  </button>
                </div>
              )}

              <div className="aula-line"></div>

              <h3>O que foi estudado</h3>

              <div className="texto-aula">
                {(aulaAtualizada.conteudo || "")
                  .split("\n")
                  .map((linha, index) => (
                    <p key={index}>
                      {linha || "\u00A0"}
                    </p>
                  ))}
              </div>

              {aulaAtualizada.anotacoes && (
                <>
                  <h3>Minhas anotações</h3>

                  <div className="anotacoes-box">
                    {aulaAtualizada.anotacoes
                      .split("\n")
                      .map((linha, index) => (
                        <p key={index}>
                          {linha || "\u00A0"}
                        </p>
                      ))}
                  </div>
                </>
              )}
            </article>
          )}
        </>
      )}
    </section>
  );
}

export default Faculdade;