// src/components/Admin/ModalCertificacao.jsx
import { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaImage } from "react-icons/fa";
import "./ModalCertificacao.css";

export function ModalCertificacao({ certificacao, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: '',
    plataforma: '',
    carga_horaria: '',
    data_conclusao: '',
    nivel: 'Intermediário',
    categoria: 'frontend',
    link_certificado: '',
    habilidades: '',
    icones_habilidades: '',
    cor_plataforma: '#00d4ff',
    ordem: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificacao) {
      setFormData({
        titulo: certificacao.titulo || '',
        plataforma: certificacao.plataforma || '',
        carga_horaria: certificacao.carga_horaria || '',
        data_conclusao: certificacao.data_conclusao || '',
        nivel: certificacao.nivel || 'Intermediário',
        categoria: certificacao.categoria || 'frontend',
        link_certificado: certificacao.link_certificado || '',
        habilidades: certificacao.habilidades?.join(', ') || '',
        icones_habilidades: certificacao.icones_habilidades?.join(', ') || '',
        cor_plataforma: certificacao.cor_plataforma || '#00d4ff',
        ordem: certificacao.ordem || 0
      });
      if (certificacao.imagem_url) {
        setPreviewUrl(certificacao.imagem_url);
      }
    }
  }, [certificacao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dados = {
        titulo: formData.titulo,
        plataforma: formData.plataforma,
        carga_horaria: formData.carga_horaria,
        data_conclusao: formData.data_conclusao,
        nivel: formData.nivel,
        categoria: formData.categoria,
        link_certificado: formData.link_certificado || null,
        habilidades: formData.habilidades.split(',').map(h => h.trim()).filter(h => h),
        icones_habilidades: formData.icones_habilidades.split(',').map(h => h.trim()).filter(h => h),
        cor_plataforma: formData.cor_plataforma,
        ordem: parseInt(formData.ordem) || 0
      };

      await onSave(dados, selectedFile);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar certificação. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { value: 'frontend', label: 'Front-End' },
    { value: 'back-end', label: 'Back-End' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
    { value: 'cloud', label: 'Cloud' }
  ];

  const niveis = [
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{certificacao ? 'Editar Certificação' : 'Nova Certificação'}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Desenvolvimento Web Full Stack"
                  required
                />
              </div>

              <div className="form-group">
                <label>Plataforma *</label>
                <input
                  type="text"
                  name="plataforma"
                  value={formData.plataforma}
                  onChange={handleChange}
                  placeholder="Ex: Udemy, Coursera"
                  required
                />
              </div>

              <div className="form-group">
                <label>Carga Horária *</label>
                <input
                  type="text"
                  name="carga_horaria"
                  value={formData.carga_horaria}
                  onChange={handleChange}
                  placeholder="Ex: 120 horas"
                  required
                />
              </div>

              <div className="form-group">
                <label>Data Conclusão *</label>
                <input
                  type="date"
                  name="data_conclusao"
                  value={formData.data_conclusao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nível *</label>
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  required
                >
                  {niveis.map(n => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Categoria *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  {categorias.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Link do Certificado</label>
                <input
                  type="url"
                  name="link_certificado"
                  value={formData.link_certificado}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Habilidades (separadas por vírgula)</label>
                <input
                  type="text"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleChange}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>

              <div className="form-group">
                <label>Ícones (separados por vírgula)</label>
                <input
                  type="text"
                  name="icones_habilidades"
                  value={formData.icones_habilidades}
                  onChange={handleChange}
                  placeholder="SiReact, SiNodedotjs, FaJava"
                />
                <small>Use: SiReact, SiNodedotjs, FaJava, FaAws, etc.</small>
              </div>

              <div className="form-group">
                <label>Cor da Plataforma</label>
                <input
                  type="color"
                  name="cor_plataforma"
                  value={formData.cor_plataforma}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ordem</label>
                <input
                  type="number"
                  name="ordem"
                  value={formData.ordem}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label>Imagem do Certificado</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="cert-file-upload"
                  />
                  <label htmlFor="cert-file-upload" className="upload-label">
                    <FaUpload /> {selectedFile ? selectedFile.name : 'Selecionar imagem'}
                  </label>
                  {previewUrl && (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Preview" className="preview-image" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}