import { supabase } from "../lib/supabase.js";

// ===== SERVIÇO DE MATÉRIAS =====
export const materiaService = {
  async listar() {
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

    if (error) throw error;

    return (data || []).map((materia) => ({
      ...materia,
      aulas: (materia.aulas || []).sort(
        (a, b) =>
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
      ),
    }));
  },

  async criar(dados) {
    const { error } = await supabase
      .from("materias")
      .insert({
        nome: dados.nome,
        sigla: dados.sigla,
        descricao: dados.descricao,
        cor: dados.cor,
      });

    if (error) throw error;
  },

  async atualizar(id, dados) {
    const { error } = await supabase
      .from("materias")
      .update({
        nome: dados.nome,
        sigla: dados.sigla,
        descricao: dados.descricao,
        cor: dados.cor,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async excluir(id) {
    const { error } = await supabase
      .from("materias")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ===== SERVIÇO DE AULAS =====
export const aulaService = {
  async criar(dados) {
    const { error } = await supabase
      .from("aulas")
      .insert({
        materia_id: dados.materia_id,
        titulo: dados.titulo,
        data: dados.data,
        conteudo: dados.conteudo,
        anotacoes: dados.anotacoes,
      });

    if (error) throw error;
  },

  async atualizar(id, dados) {
    const { error } = await supabase
      .from("aulas")
      .update({
        titulo: dados.titulo,
        data: dados.data,
        conteudo: dados.conteudo,
        anotacoes: dados.anotacoes,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async excluir(id) {
    const { error } = await supabase
      .from("aulas")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};