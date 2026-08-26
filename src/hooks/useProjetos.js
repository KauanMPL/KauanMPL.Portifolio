import { useState, useEffect } from "react";
import { projetoService } from "../services/projetoService";

export function useProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarProjetos() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await projetoService.listar();
      setProjetos(dados);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar projetos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProjetos();
  }, []);

  return {
    projetos,
    setProjetos,
    carregando,
    erro,
    carregarProjetos,
  };
}