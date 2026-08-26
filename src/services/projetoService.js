import { supabase } from "../lib/supabase.js";

export const projetoService = {
  async listar() {
    const { data, error } = await supabase
      .from("projetos")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async criar(dados) {
    const { error } = await supabase
      .from("projetos")
      .insert({
        titulo: dados.titulo,
        descricao: dados.descricao,
        tecnologias: dados.tecnologias,
        imagem: dados.imagem || null,
        link: dados.link || null,
        github: dados.github || null,
        status: dados.status || "em desenvolvimento",
        ordem: dados.ordem || 0,
      });

    if (error) throw error;
  },

  async atualizar(id, dados) {
    const { error } = await supabase
      .from("projetos")
      .update({
        titulo: dados.titulo,
        descricao: dados.descricao,
        tecnologias: dados.tecnologias,
        imagem: dados.imagem || null,
        link: dados.link || null,
        github: dados.github || null,
        status: dados.status || "em desenvolvimento",
        ordem: dados.ordem || 0,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async excluir(id) {
    const { error } = await supabase
      .from("projetos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};