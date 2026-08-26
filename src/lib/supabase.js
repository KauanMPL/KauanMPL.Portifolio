import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL não configurada.");
}

if (!supabasePublishableKey) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY não configurada.");
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

// ============================================================
// API DE CERTIFICAÇÕES
// ============================================================

export const certificacoesAPI = {

  // ==========================================================
  // LISTAR
  // ==========================================================

  async getAll() {
    const { data, error } = await supabase
      .from("certificacoes")
      .select("*")
      .eq("ativo", true)
      .order("ordem", {
        ascending: true,
      });

    if (error) {
      console.error("Erro ao buscar certificações:", error);
      throw error;
    }

    return data || [];
  },

  // ==========================================================
  // BUSCAR POR CATEGORIA
  // ==========================================================

  async getByCategoria(categoria) {
    const { data, error } = await supabase
      .from("certificacoes")
      .select("*")
      .eq("categoria", categoria)
      .eq("ativo", true)
      .order("ordem", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erro ao buscar certificações por categoria:",
        error
      );

      throw error;
    }

    return data || [];
  },

  // ==========================================================
  // ESTATÍSTICAS
  // ==========================================================

  async getStats() {
    const { data, error } = await supabase
      .from("certificacoes")
      .select("*")
      .eq("ativo", true);

    if (error) {
      console.error(
        "Erro ao buscar estatísticas:",
        error
      );

      throw error;
    }

    const lista = data || [];

    const total = lista.length;

    const totalHoras = lista.reduce((acc, curr) => {
      const horas = parseInt(
        curr.carga_horaria,
        10
      );

      return acc + (
        Number.isNaN(horas)
          ? 0
          : horas
      );
    }, 0);

    const categorias = {};

    lista.forEach((cert) => {
      const categoria = cert.categoria || "outros";

      categorias[categoria] =
        (categorias[categoria] || 0) + 1;
    });

    return {
      total,
      totalHoras,

      categorias,

      niveis: {
        Básico: lista.filter(
          (c) => c.nivel === "Básico"
        ).length,

        Intermediário: lista.filter(
          (c) => c.nivel === "Intermediário"
        ).length,

        Avançado: lista.filter(
          (c) => c.nivel === "Avançado"
        ).length,
      },
    };
  },

  // ==========================================================
  // CRIAR
  // ==========================================================

  async create(certificacao) {
    console.log(
      "Criando certificação:",
      certificacao
    );

    const { data, error } = await supabase
      .from("certificacoes")
      .insert([certificacao])
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao criar certificação:",
        error
      );

      throw error;
    }

    return data;
  },

  // ==========================================================
  // ATUALIZAR
  // ==========================================================

  async update(id, updates) {
    if (!id) {
      throw new Error(
        "ID da certificação não informado."
      );
    }

    console.log(
      "Atualizando certificação:",
      id,
      updates
    );

    const { data, error } = await supabase
      .from("certificacoes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar certificação:",
        error
      );

      throw error;
    }

    return data;
  },

  // ==========================================================
  // EXCLUIR DE VERDADE
  // ==========================================================

  async delete(id) {
    if (!id) {
      throw new Error(
        "ID da certificação não informado."
      );
    }

    console.log(
      "Excluindo certificação:",
      id
    );

    const { data, error } = await supabase
      .from("certificacoes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao excluir certificação:",
        error
      );

      throw error;
    }

    return data;
  },

  // ==========================================================
  // ATIVAR / DESATIVAR
  // ==========================================================

  async toggleAtivo(id, ativo) {
    if (!id) {
      throw new Error(
        "ID da certificação não informado."
      );
    }

    const { data, error } = await supabase
      .from("certificacoes")
      .update({
        ativo: Boolean(ativo),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao alterar status:",
        error
      );

      throw error;
    }

    return data;
  },

  // ==========================================================
  // UPLOAD DA IMAGEM
  // ==========================================================

  async uploadImagem(file, certificadoId) {
    if (!file) {
      throw new Error(
        "Nenhum arquivo selecionado."
      );
    }

    if (!certificadoId) {
      throw new Error(
        "ID da certificação não informado."
      );
    }

    try {
      // ------------------------------------------------------
      // EXTENSÃO
      // ------------------------------------------------------

      const fileExt = file.name
        .split(".")
        .pop()
        .toLowerCase();

      // ------------------------------------------------------
      // NOME ÚNICO
      // ------------------------------------------------------

      const fileName =
        `certificado_${certificadoId}_${Date.now()}.${fileExt}`;

      const filePath =
        `certificados/${fileName}`;

      // ------------------------------------------------------
      // UPLOAD
      // ------------------------------------------------------

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from("certificados")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: true,
          }
        );

      if (uploadError) {
        console.error(
          "Erro no upload:",
          uploadError
        );

        throw uploadError;
      }

      // ------------------------------------------------------
      // URL PÚBLICA
      // ------------------------------------------------------

      const {
        data: publicData,
      } = supabase.storage
        .from("certificados")
        .getPublicUrl(filePath);

      const publicUrl =
        publicData?.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Não foi possível obter a URL pública da imagem."
        );
      }

      // ------------------------------------------------------
      // ATUALIZA BANCO
      // ------------------------------------------------------

      await this.update(
        certificadoId,
        {
          imagem_url: publicUrl,
          nome_arquivo: fileName,
        }
      );

      return publicUrl;

    } catch (error) {
      console.error(
        "Erro ao fazer upload da imagem:",
        error
      );

      throw error;
    }
  },

  // ==========================================================
  // REMOVER IMAGEM
  // ==========================================================

  async removerImagem(
    certificadoId,
    nomeArquivo
  ) {
    if (!certificadoId) {
      throw new Error(
        "ID da certificação não informado."
      );
    }

    try {

      // ------------------------------------------------------
      // REMOVE ARQUIVO DO STORAGE
      // ------------------------------------------------------

      if (nomeArquivo) {

        const filePath =
          `certificados/${nomeArquivo}`;

        const {
          error: storageError,
        } = await supabase.storage
          .from("certificados")
          .remove([filePath]);

        if (storageError) {
          console.warn(
            "Aviso ao remover arquivo:",
            storageError
          );
        }
      }

      // ------------------------------------------------------
      // REMOVE REFERÊNCIA DO BANCO
      // ------------------------------------------------------

      const { data, error } =
        await supabase
          .from("certificacoes")
          .update({
            imagem_url: null,
            nome_arquivo: null,
          })
          .eq("id", certificadoId)
          .select()
          .single();

      if (error) {
        console.error(
          "Erro ao remover imagem do registro:",
          error
        );

        throw error;
      }

      return data;

    } catch (error) {
      console.error(
        "Erro ao remover imagem:",
        error
      );

      throw error;
    }
  },
};