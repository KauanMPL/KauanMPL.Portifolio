import { supabase } from "../lib/supabase.js";

export const habilidadeService = {
  async listar() {
    const { data, error } = await supabase
      .from("habilidades")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async criar(dados) {
    const { error } = await supabase
      .from("habilidades")
      .insert({
        nome: dados.nome,
        categoria: dados.categoria,
        icone: dados.icone,
        cor: dados.cor,
        ordem: dados.ordem || 0,
      });

    if (error) throw error;
  },

  async atualizar(id, dados) {
    const { error } = await supabase
      .from("habilidades")
      .update({
        nome: dados.nome,
        categoria: dados.categoria,
        icone: dados.icone,
        cor: dados.cor,
        ordem: dados.ordem || 0,
      })
      .eq("id", id);  // ← id deve ser UUID

    if (error) throw error;
  },

  async excluir(id) {
    const { error } = await supabase
      .from("habilidades")
      .delete()
      .eq("id", id);  // ← id deve ser UUID

    if (error) throw error;
  },
};