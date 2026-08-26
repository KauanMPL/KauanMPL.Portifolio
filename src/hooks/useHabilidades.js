import { useState, useEffect } from "react";
import { habilidadeService } from "../services/habilidadeService";

export function useHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarHabilidades() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await habilidadeService.listar();
      setHabilidades(dados);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar habilidades");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarHabilidades();
  }, []);

  return {
    habilidades,
    setHabilidades,
    carregando,
    erro,
    carregarHabilidades,
  };
}