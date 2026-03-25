import { useState, useEffect } from 'react';
import { X, Save, Package, Tag, Calendar, User, FileText, Check, AlertCircle, Pencil, Link, ExternalLink } from 'lucide-react';
import { markupService } from '../services/api';
import { toast } from 'sonner';

function EditMarkupModal({ markup, isOpen, onClose, onUpdate, options }) {
  const [formData, setFormData] = useState(markup);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (markup) setFormData(markup);
    setErrors({});
  }, [markup]);

  const formatShortDate = (iso) => {
    if (!iso) return '—';
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    }
    const dObj = new Date(iso);
    if (Number.isNaN(dObj.getTime())) return '—';
    const dd = String(dObj.getDate()).padStart(2, '0');
    const mm = String(dObj.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${dObj.getFullYear()}`;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'numero_parte':
        if (!value) return 'Requerido';
        if (value.length < 5) return 'Mínimo 5 caracteres';
        return '';
      case 'nueva_revision':
        if (!value) return 'Requerido';
        if (!/^[A-Z0-9]{1,3}$/.test(value)) return 'Solo letras/números (máx 3)';
        return '';
      case 'descripcion':
        if (!value) return 'Requerido';
        if (value.length < 10) return 'Mínimo 10 caracteres';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !markup) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ['numero_parte', 'nueva_revision', 'descripcion'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Corrige los errores antes de guardar');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        numero_parte: formData.numero_parte,
        nueva_revision: formData.nueva_revision,
        descripcion: formData.descripcion,
        url_archivo: formData.url_archivo || '',
        tipo_markup: parseInt(formData.tipo_markup),
        estado: parseInt(formData.estado),
        responsable: parseInt(formData.responsable),
      };
      const response = await markupService.update(markup.id, payload);
      onUpdate(response.data);
      toast.success('Markup actualizado correctamente');
      onClose();
    } catch (err) {
      toast.error('Error al actualizar en el servidor');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const responsableNombre = markup.responsable_detalle?.nombre || 'Sin asignar';
  const iniciales = responsableNombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-border bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Pencil className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Editar Markup</h3>
                <p className="text-sm text-muted-foreground">
                  ID:{markup.id} | Número de parte: {markup.numero_parte}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">

          {/* Información del Parte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Package size={16} />
              <span>Información del Parte</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Número de parte <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 000-12345-001"
                    required
                    className={`w-full bg-background border ${errors.numero_parte ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    value={formData.numero_parte}
                    onChange={(e) => handleFieldChange('numero_parte', e.target.value)}
                  />
                  {errors.numero_parte && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle size={12} />
                      <span>{errors.numero_parte}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Nueva revisión <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="Ej. A"
                    className={`w-full bg-background border ${errors.nueva_revision ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 uppercase font-mono text-center text-lg transition-all`}
                    value={formData.nueva_revision}
                    onChange={(e) => handleFieldChange('nueva_revision', e.target.value.toUpperCase())}
                  />
                  {errors.nueva_revision && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle size={12} />
                      <span>{errors.nueva_revision}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clasificación + Estado */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Tag size={16} />
              <span>Clasificación y Estado</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Tipo de Markup <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.tipo_markup}
                    onChange={(e) => setFormData({ ...formData, tipo_markup: e.target.value })}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {options.tipos?.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.descripcion}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Estado del Proceso <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    {options.estados?.map(est => (
                      <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas (solo lectura) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Calendar size={16} />
              <span>Fechas</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5">
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Registro</div>
                  <div className="font-bold text-sm text-primary">
                    {formatShortDate(markup.fecha_creacion)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 py-0.5 rounded-full border border-primary/30">
                      <span className="text-[10px] font-bold text-primary">+7 días</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Compromiso</div>
                  <div className="font-bold text-sm text-primary">
                    {formatShortDate(markup.fecha_compromiso)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* URL del archivo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Link size={16} />
              <span>Archivo en SharePoint</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">URL del archivo</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://sharepoint.com/sites/.../nombre_del_markup.xlsx"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.url_archivo || ''}
                    onChange={(e) => setFormData({ ...formData, url_archivo: e.target.value })}
                  />
                  {formData.url_archivo && (
                    <a
                      href={formData.url_archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-all"
                      title="Abrir enlace"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Opcional — enlace al documento en SharePoint</div>
              </div>
            </div>
          </div>

          {/* Responsable (solo lectura) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <User size={16} />
              <span>Responsable</span>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {iniciales}
                </div>
                <div>
                  <div className="font-bold text-foreground">{responsableNombre}</div>
                  {markup.responsable_detalle?.numero_empleado && (
                    <div className="text-sm text-muted-foreground">
                      Emp. {markup.responsable_detalle.numero_empleado}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <FileText size={16} />
              <span>Descripción del cambio</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Descripción detallada <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe los cambios realizados en este markup..."
                  className={`w-full bg-background border ${errors.descripcion ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all`}
                  value={formData.descripcion}
                  onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                />
                <div className="flex items-center justify-between text-xs">
                  {errors.descripcion ? (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle size={12} />
                      <span>{errors.descripcion}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Mínimo 10 caracteres</span>
                  )}
                  <span className={`${formData.descripcion.length < 10 ? 'text-muted-foreground' : 'text-primary'}`}>
                    {formData.descripcion.length} caracteres
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Tip: Presiona <kbd className="px-2 py-1 bg-secondary rounded border border-border">Esc</kbd> para cancelar
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary font-semibold text-sm transition-all rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMarkupModal;