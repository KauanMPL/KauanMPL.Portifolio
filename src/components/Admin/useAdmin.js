import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase.js";
import { materiaService, aulaService } from "../../services/materiaService";
import { habilidadeService } from "../../services/habilidadeService";
import { projetoService } from "../../services/projetoService";

export function useAdmin({
  // Matérias
  materias,
  setMaterias,
  materiaSelecionada,
  onMateriaDeleted,

  // Habilidades
  habilidades,
  setHabilidades,
  carregarHabilidades,

  // Projetos
  projetos,
  setProjetos,
  carregarProjetos,
}) {
  // ======================================================
  // AUTENTICAÇÃO
  // ======================================================

  const [admin, setAdmin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // ======================================================
  // CERTIFICAÇÕES
  // ======================================================

  const [certificacoes, setCertificacoes] = useState([]);
  const [carregandoCertificacoes, setCarregandoCertificacoes] =
    useState(false);

  // ======================================================
  // ESTATÍSTICAS
  // ======================================================

  const [estatisticas, setEstatisticas] = useState({
    materias: 0,
    habilidades: 0,
    projetos: 0,
    certificacoes: 0,
  });

  // ======================================================
  // MODAIS
  // ======================================================

  const [modal, setModal] = useState(null);

  const [materiaEditando, setMateriaEditando] = useState(null);
  const [aulaEditando, setAulaEditando] = useState(null);
  const [habilidadeEditando, setHabilidadeEditando] = useState(null);
  const [projetoEditando, setProjetoEditando] = useState(null);
  const [certificacaoEditando, setCertificacaoEditando] = useState(null);

  const fileInputRef = useRef(null);

  // ======================================================
  // AUTENTICAÇÃO
  // ======================================================

  useEffect(() => {
    let subscription;

    async function verificarUsuario() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      atualizarUsuario(session?.user || null);

      const { data } = supabase.auth.onAuthStateChange(
        (_event, sessionAtual) => {
          atualizarUsuario(sessionAtual?.user || null);
        }
      );

      subscription = data.subscription;
    }

    verificarUsuario();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ======================================================
  // ATUALIZAR USUÁRIO
  // ======================================================

  function atualizarUsuario(user) {
    if (!user) {
      setUsuario(null);
      setAdmin(false);
      return;
    }

    const ehAdmin =
      user.user_metadata?.is_admin === true;

    setUsuario(user);
    setAdmin(ehAdmin);
  }

  // ======================================================
  // LOGIN
  // ======================================================

  async function loginAdmin() {
    const email = window.prompt(
      "Digite o e-mail do administrador:"
    );

    if (!email) return;

    const senha = window.prompt(
      "Digite a senha do administrador:"
    );

    if (!senha) return;

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

    atualizarUsuario(data.user);

    await carregarEstatisticas();
    await carregarCertificacoes();
  }

  // ======================================================
  // LOGOUT
  // ======================================================

  async function logoutAdmin() {
    const confirmar = window.confirm(
      "Deseja sair do modo administrador?"
    );

    if (!confirmar) return;

    await supabase.auth.signOut();

    setUsuario(null);
    setAdmin(false);

    setCertificacoes([]);

    setEstatisticas({
      materias: 0,
      habilidades: 0,
      projetos: 0,
      certificacoes: 0,
    });

    fecharModal();
  }

  // ======================================================
  // MATÉRIAS
  // ======================================================

  async function carregarMateriasAdmin() {
    try {
      const dados = await materiaService.listar();

      setMaterias(dados || []);

      return dados || [];
    } catch (error) {
      console.error(
        "Erro ao carregar matérias:",
        error
      );

      setMaterias([]);

      throw error;
    }
  }

  // ======================================================
  // HABILIDADES
  // ======================================================

  async function carregarHabilidadesAdmin() {
    if (carregarHabilidades) {
      await carregarHabilidades();
    }
  }

  // ======================================================
  // PROJETOS
  // ======================================================

  async function carregarProjetosAdmin() {
    if (carregarProjetos) {
      await carregarProjetos();
    }
  }

  // ======================================================
  // CERTIFICAÇÕES
  // ======================================================

  async function carregarCertificacoes() {
    try {
      setCarregandoCertificacoes(true);

      const { data, error } = await supabase
        .from("certificacoes")
        .select("*")
        .eq("ativo", true)
        .order("ordem", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      const dados = data || [];

      setCertificacoes(dados);

      return dados;
    } catch (error) {
      console.error(
        "Erro ao carregar certificações:",
        error
      );

      setCertificacoes([]);

      return [];
    } finally {
      setCarregandoCertificacoes(false);
    }
  }

  // ======================================================
  // ESTATÍSTICAS
  // ======================================================

  async function carregarEstatisticas() {
    try {
      const [
        materiasResult,
        habilidadesResult,
        projetosResult,
        certificacoesResult,
      ] = await Promise.all([
        materiaService.listar(),
        habilidadeService.listar(),
        projetoService.listar(),

        supabase
          .from("certificacoes")
          .select("id")
          .eq("ativo", true),
      ]);

      const quantidadeMaterias =
        Array.isArray(materiasResult)
          ? materiasResult.length
          : 0;

      const quantidadeHabilidades =
        Array.isArray(habilidadesResult)
          ? habilidadesResult.length
          : 0;

      const quantidadeProjetos =
        Array.isArray(projetosResult)
          ? projetosResult.length
          : 0;

      if (certificacoesResult.error) {
        throw certificacoesResult.error;
      }

      const quantidadeCertificacoes =
        certificacoesResult.data?.length || 0;

      setEstatisticas({
        materias: quantidadeMaterias,
        habilidades: quantidadeHabilidades,
        projetos: quantidadeProjetos,
        certificacoes: quantidadeCertificacoes,
      });

      // Também mantém os estados sincronizados
      setMaterias(materiasResult || []);

      if (setHabilidades) {
        setHabilidades(habilidadesResult || []);
      }

      if (setProjetos) {
        setProjetos(projetosResult || []);
      }

      return {
        materias: quantidadeMaterias,
        habilidades: quantidadeHabilidades,
        projetos: quantidadeProjetos,
        certificacoes: quantidadeCertificacoes,
      };
    } catch (error) {
      console.error(
        "Erro ao carregar estatísticas do administrador:",
        error
      );

      return null;
    }
  }

  // ======================================================
  // CARREGAR DADOS DO ADMIN
  // ======================================================

  useEffect(() => {
    if (!admin) return;

    async function carregarDadosAdmin() {
      await Promise.all([
        carregarEstatisticas(),
        carregarCertificacoes(),
      ]);
    }

    carregarDadosAdmin();
  }, [admin]);

  // ======================================================
  // MATÉRIAS - SALVAR
  // ======================================================

  async function salvarMateria(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    try {
      if (materiaEditando) {
        await materiaService.atualizar(
          materiaEditando.id,
          dados
        );

        alert(
          "Matéria atualizada com sucesso!"
        );
      } else {
        await materiaService.criar(dados);

        alert(
          "Matéria criada com sucesso!"
        );
      }

      await carregarMateriasAdmin();
      await carregarEstatisticas();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a matéria.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // MATÉRIAS - EXCLUIR
  // ======================================================

  async function excluirMateria(id) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta matéria e todas as suas aulas?"
    );

    if (!confirmar) return;

    try {
      await materiaService.excluir(id);

      if (materiaSelecionada?.id === id) {
        onMateriaDeleted?.();
      }

      await carregarMateriasAdmin();
      await carregarEstatisticas();

      alert(
        "Matéria excluída com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a matéria.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // AULAS - SALVAR
  // ======================================================

  async function salvarAula(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    if (!materiaSelecionada) {
      alert(
        "Nenhuma matéria selecionada."
      );

      return;
    }

    try {
      if (aulaEditando) {
        await aulaService.atualizar(
          aulaEditando.id,
          dados
        );

        alert(
          "Aula atualizada com sucesso!"
        );
      } else {
        await aulaService.criar({
          ...dados,
          materia_id:
            materiaSelecionada.id,
        });

        alert(
          "Aula criada com sucesso!"
        );
      }

      await carregarMateriasAdmin();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a aula.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // AULAS - EXCLUIR
  // ======================================================

  async function excluirAula(aulaId) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta aula?"
    );

    if (!confirmar) return;

    try {
      await aulaService.excluir(aulaId);

      await carregarMateriasAdmin();

      alert(
        "Aula excluída com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a aula.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // HABILIDADES - SALVAR
  // ======================================================

  async function salvarHabilidade(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    try {
      if (habilidadeEditando) {
        await habilidadeService.atualizar(
          habilidadeEditando.id,
          dados
        );

        alert(
          "Habilidade atualizada com sucesso!"
        );
      } else {
        await habilidadeService.criar(dados);

        alert(
          "Habilidade criada com sucesso!"
        );
      }

      if (carregarHabilidades) {
        await carregarHabilidades();
      }

      await carregarEstatisticas();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a habilidade.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // HABILIDADES - EXCLUIR
  // ======================================================

  async function excluirHabilidade(id) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta habilidade?"
    );

    if (!confirmar) return;

    try {
      await habilidadeService.excluir(id);

      if (carregarHabilidades) {
        await carregarHabilidades();
      }

      await carregarEstatisticas();

      alert(
        "Habilidade excluída com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a habilidade.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // PROJETOS - SALVAR
  // ======================================================

  async function salvarProjeto(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    try {
      if (projetoEditando) {
        await projetoService.atualizar(
          projetoEditando.id,
          dados
        );

        alert(
          "Projeto atualizado com sucesso!"
        );
      } else {
        await projetoService.criar(dados);

        alert(
          "Projeto criado com sucesso!"
        );
      }

      if (carregarProjetos) {
        await carregarProjetos();
      }

      await carregarEstatisticas();

      fecharModal();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar o projeto.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // PROJETOS - EXCLUIR
  // ======================================================

  async function excluirProjeto(id) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este projeto?"
    );

    if (!confirmar) return;

    try {
      await projetoService.excluir(id);

      if (carregarProjetos) {
        await carregarProjetos();
      }

      await carregarEstatisticas();

      alert(
        "Projeto excluído com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir o projeto.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // CERTIFICAÇÕES - SALVAR
  // ======================================================

  async function salvarCertificacao(dados) {
    if (!admin) {
      alert(
        "Você precisa estar logado como administrador."
      );

      return;
    }

    try {
      let resultado;

      if (certificacaoEditando) {
        resultado = await supabase
          .from("certificacoes")
          .update(dados)
          .eq("id", certificacaoEditando.id)
          .select()
          .single();
      } else {
        resultado = await supabase
          .from("certificacoes")
          .insert([dados])
          .select()
          .single();
      }

      if (resultado.error) {
        throw resultado.error;
      }

      await carregarCertificacoes();
      await carregarEstatisticas();

      fecharModal();

      alert(
        certificacaoEditando
          ? "Certificação atualizada com sucesso!"
          : "Certificação criada com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível salvar a certificação.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // CERTIFICAÇÕES - EXCLUIR
  // ======================================================

  async function excluirCertificacao(id) {
    if (!admin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta certificação?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("certificacoes")
        .update({
          ativo: false,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      await carregarCertificacoes();
      await carregarEstatisticas();

      alert(
        "Certificação excluída com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir a certificação.\n\n" +
          error.message
      );
    }
  }

  // ======================================================
  // CERTIFICAÇÕES - NOVA
  // ======================================================

  function abrirNovaCertificacao() {
    if (!admin) return;

    setCertificacaoEditando(null);
    setModal("certificacao");
  }

  // ======================================================
  // CERTIFICAÇÕES - EDITAR
  // ======================================================

  function editarCertificacao(certificacao) {
    if (!admin) return;

    setCertificacaoEditando(certificacao);
    setModal("certificacao");
  }

  // ======================================================
  // MODAIS
  // ======================================================

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

  function abrirNovaHabilidade() {
    if (!admin) return;

    setHabilidadeEditando(null);
    setModal("habilidade");
  }

  function editarHabilidade(habilidade) {
    if (!admin) return;

    setHabilidadeEditando(habilidade);
    setModal("habilidade");
  }

  function abrirNovoProjeto() {
    if (!admin) return;

    setProjetoEditando(null);
    setModal("projeto");
  }

  function editarProjeto(projeto) {
    if (!admin) return;

    setProjetoEditando(projeto);
    setModal("projeto");
  }

  function fecharModal() {
    setModal(null);

    setMateriaEditando(null);
    setAulaEditando(null);
    setHabilidadeEditando(null);
    setProjetoEditando(null);
    setCertificacaoEditando(null);
  }

  // ======================================================
  // BACKUP
  // ======================================================

  function exportarBackup() {
    if (!admin) return;

    const dados = JSON.stringify(
      materias,
      null,
      2
    );

    const blob = new Blob(
      [dados],
      {
        type: "application/json",
      }
    );

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

  // ======================================================
  // ABRIR IMPORTAÇÃO
  // ======================================================

  function abrirImportacao() {
    if (!admin) return;

    fileInputRef.current?.click();
  }

  // ======================================================
  // IMPORTAR BACKUP
  // ======================================================

  async function importarBackup(event) {
    if (!admin) return;

    const arquivo =
      event.target.files?.[0];

    if (!arquivo) return;

    const leitor =
      new FileReader();

    leitor.onload = async (e) => {
      try {
        const dados = JSON.parse(
          e.target.result
        );

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

        await carregarMateriasAdmin();
        await carregarEstatisticas();

        alert(
          "Backup importado com sucesso!"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Não foi possível importar o backup.\n\n" +
            error.message
        );
      } finally {
        event.target.value = "";
      }
    };

    leitor.readAsText(arquivo);
  }

  // ======================================================
  // RETORNO DO HOOK
  // ======================================================

  return {
    // Autenticação
    admin,
    usuario,
    loginAdmin,
    logoutAdmin,

    // Estatísticas
    estatisticas,
    carregarEstatisticas,

    // Listas
    materias,
    habilidades,
    projetos,
    certificacoes,

    // Certificações
    setCertificacoes,
    carregarCertificacoes,
    carregandoCertificacoes,
    salvarCertificacao,
    excluirCertificacao,
    abrirNovaCertificacao,
    editarCertificacao,
    certificacaoEditando,

    // Matérias
    salvarMateria,
    excluirMateria,
    abrirNovaMateria,
    editarMateria,

    // Aulas
    salvarAula,
    excluirAula,
    abrirNovaAula,
    editarAula,

    // Habilidades
    salvarHabilidade,
    excluirHabilidade,
    abrirNovaHabilidade,
    editarHabilidade,
    habilidadeEditando,

    // Projetos
    salvarProjeto,
    excluirProjeto,
    abrirNovoProjeto,
    editarProjeto,
    projetoEditando,

    // Backup
    exportarBackup,
    abrirImportacao,
    importarBackup,
    fileInputRef,

    // Modais
    modal,
    materiaEditando,
    aulaEditando,
    fecharModal,
  };
}