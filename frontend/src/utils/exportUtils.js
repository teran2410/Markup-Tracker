// utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const calcDias = (fecha) => {
  if (!fecha) return null;
  return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
};

const prepareRows = (markups) =>
  markups.map((m) => ({
    ID: m.id,
    'Número de Parte': m.numero_parte,
    Revisión: m.nueva_revision || '',
    Tipo: m.tipo_markup_detalle?.descripcion || '',
    Responsable: m.responsable_detalle?.nombre || '',
    Estado: m.estado_detalle?.nombre || '',
    'Fecha Compromiso': m.fecha_compromiso || '',
    'Días Restantes': calcDias(m.fecha_compromiso) ?? 'N/A',
    Descripción: m.descripcion || '',
  }));

export const exportToExcel = (markups, filename = 'markups') => {
  const rows = prepareRows(markups);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Markups');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportToPDF = (markups, filename = 'markups') => {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('Reporte de Markups', 14, 18);
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 14, 25);

  const rows = prepareRows(markups);
  const cols = Object.keys(rows[0] || {});

  autoTable(doc, {
    startY: 30,
    head: [cols],
    body: rows.map((r) => cols.map((c) => r[c])),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
