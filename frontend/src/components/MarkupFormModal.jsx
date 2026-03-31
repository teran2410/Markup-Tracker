// MarkupFormModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Save, Package, Tag, Calendar, User, FileText, Check, AlertCircle, Link } from 'lucide-react';
import { markupService } from '../services/api';
import { toast } from 'sonner';
import LoadingOverlay from './LoadingOverlay';
import Tooltip, { TooltipLabel } from './Tooltip';
import { useAuth } from '../context/AuthContext';

const MarkupFormModal = ({ isOpen, onClose, onMarkupCreated, options }) => {
  const { user } = useAuth();
  const empleado = user?.empleado;

  // Helpers para fechas
  const getTodayISO = () => new Date().toISOString().slice(0, 10);

  const formatLongDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const formatShortDate = (iso) => {
    if (!iso) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, d] = iso.split('-');
      return `${m}/${d}/${y}`;
    }
    const dObj = new Date(iso);
    if (Number.isNaN(dObj.getTime())) return '';
    const mm = String(dObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dObj.getDate()).padStart(2, '0');
    const yy = dObj.getFullYear();
    return `${mm}/${dd}/${yy}`;
  };

  const addBusinessDays = (startISO, days) => {
    if (!startISO) return '';
    const d = new Date(startISO);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return d.toISOString().slice(0, 10);
  };

  const [formData, setFormData] = useState({
    numero_parte: '',
    nueva_revision: '',
    descripcion: '',
    url_archivo: '',
    tipo_markup: '',
    fecha_registro: getTodayISO(),
    fecha_compromiso: addBusinessDays(getTodayISO(), 7)
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        fecha_registro: getTodayISO(),
        fecha_compromiso: addBusinessDays(getTodayISO(), 7)
      }));
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.fecha_registro) {
      const computed = addBusinessDays(formData.fecha_registro, 7);
      setFormData(prev => ({ ...prev, fecha_compromiso: computed }));
    }
  }, [formData.fecha_registro]);

  // Validación en tiempo real
  const validateField = (name, value) => {
    switch(name) {
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

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, formData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todo antes de enviar
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Formulario incompleto', {
        description: `Hay ${Object.keys(newErrors).length} error(es) que corregir`,
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);

    const tipoSeleccionado = options.tipos?.find(t => t.id === parseInt(formData.tipo_markup));

    const optimisticMarkup = {
      id: Date.now(),
      numero_parte: formData.numero_parte,
      nueva_revision: formData.nueva_revision,
      descripcion: formData.descripcion,
      responsable_detalle: { nombre: empleado?.nombre || user?.username || 'Usuario' },
      estado_detalle: { nombre: "Abierto" },
      tipo_markup_detalle: { descripcion: tipoSeleccionado?.descripcion || '' },
      isOptimistic: true
    };

    onMarkupCreated(optimisticMarkup); 
    onClose();

    try {
      const payload = {
        ...formData,
        estado: 1,
        tipo_markup: parseInt(formData.tipo_markup)
      };

      const response = await markupService.create(payload);
      toast.success('¡Markup creado!', {
        description: `${formData.numero_parte} Rev. ${formData.nueva_revision} registrado correctamente`,
        duration: 3000,
      });
      
      setFormData({
        numero_parte: '', nueva_revision: '', descripcion: '',
        url_archivo: '', tipo_markup: '', 
        fecha_registro: getTodayISO(),
        fecha_compromiso: addBusinessDays(getTodayISO(), 7)
      });
    } catch (err) {
      console.error("Error:", err.response?.data);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Error desconocido';
      toast.error('Error al guardar markup', {
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header con gradiente */}
        <div className="relative px-8 py-6 border-b border-border bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Nuevo Markup</h3>
                <p className="text-sm text-muted-foreground">Registra los cambios de ingeniería</p>
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
          
          {/* Sección: Información del Parte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Package size={16} />
              <span>Información del Parte</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-foreground">
                      Número de parte <span className="text-destructive">*</span>
                    </label>
                    <Tooltip content="Ingresa el código único del componente. Formato típico: XXX-XXXXX-XXX (mínimo 5 caracteres)" />
                  </div>
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
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-foreground">
                      Nueva revisión <span className="text-destructive">*</span>
                    </label>
                    <Tooltip content="Letra o número que identifica la versión del cambio (ej: A, B, C o 1, 2, 3). Máximo 3 caracteres." />
                  </div>
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

          {/* Sección: Clasificación */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Tag size={16} />
              <span>Clasificación</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Tipo de Markup <span className="text-destructive">*</span>
                </label>
                <select 
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.tipo_markup}
                  onChange={(e) => setFormData({...formData, tipo_markup: e.target.value})}
                >
                  <option value="">Seleccionar tipo...</option>
                  {options.tipos?.map(t => (
                    <option key={t.id} value={t.id}>{t.id} - {t.descripcion}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Fechas con timeline visual */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Calendar size={16} />
              <span>Fechas</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5 space-y-4">
              
              {/* Timeline visual */}
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Registro</div>
                  <div className="font-bold text-sm text-primary">
                    {formatShortDate(formData.fecha_registro)}
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
                    {formatShortDate(formData.fecha_compromiso)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Fecha de registro <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    max={getTodayISO()}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.fecha_registro}
                    onChange={(e) => setFormData({...formData, fecha_registro: e.target.value})}
                  />
                  <div className="text-xs text-muted-foreground">Formato: MM/DD/YYYY</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Fecha compromiso</label>
                  <div className="relative">
                    <input
                      type="date"
                      readOnly
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground outline-none cursor-not-allowed"
                      value={formData.fecha_compromiso || ''}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check size={16} className="text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Auto-calculado (7 días hábiles)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: URL del archivo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <Link size={16} />
              <span>Archivo en SharePoint</span>
            </div>
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">URL del archivo</label>
                <input
                  type="url"
                  placeholder="https://sharepoint.com/sites/.../archivo.pdf"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.url_archivo}
                  onChange={(e) => setFormData({...formData, url_archivo: e.target.value})}
                />
                <div className="text-xs text-muted-foreground">Opcional — enlace al documento en SharePoint</div>
              </div>
            </div>
          </div>

          {/* Sección: Responsable */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
              <User size={16} />
              <span>Responsable</span>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {empleado?.nombre ? empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2) : (user?.username?.[0]?.toUpperCase() || '?')}
                </div>
                <div>
                  <div className="font-bold text-foreground">{empleado?.nombre || user?.first_name + ' ' + user?.last_name || user?.username}</div>
                  <div className="text-sm text-muted-foreground">{empleado ? `#${empleado.numero_empleado} · ${empleado.rol}` : user?.username}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Descripción */}
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

          {/* Botones de acción */}
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
                    <Save size={18} /> Guardar Markup
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Loading Overlay */}
        {isSaving && (
          <LoadingOverlay message="Guardando markup..." />
        )}
      </div>
    </div>
  );
};

export default MarkupFormModal;