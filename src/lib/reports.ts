/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  name: string;
  controlNumber: string;
  curp: string;
  career: string;
  semester: string;
  group: string;
  module: string;
  registeredAt: string;
  status: string;
}

export async function exportToExcel(data: ExportData[], title: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Lista de Inscritos');

  // Set header style
  const headerFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E78' }
  };
  const headerFont: any = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };

  // Add columns
  worksheet.columns = [
    { header: 'Nombre Completo', key: 'name', width: 35 },
    { header: 'Número de Control', key: 'controlNumber', width: 20 },
    { header: 'CURP', key: 'curp', width: 25 },
    { header: 'Carrera', key: 'career', width: 30 },
    { header: 'Semestre', key: 'semester', width: 12 },
    { header: 'Grupo', key: 'group', width: 10 },
    { header: 'Módulo', key: 'module', width: 10 },
    { header: 'Fecha Registro', key: 'registeredAt', width: 20 },
    { header: 'Estatus', key: 'status', width: 15 }
  ];

  // Apply styles to header
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Add data
  data.forEach(item => {
    const row = worksheet.addRow({
      ...item,
      registeredAt: item.registeredAt ? new Date(item.registeredAt).toLocaleDateString() : 'N/A'
    });
    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        cell.alignment = { horizontal: 'center' };
      }
    });
  });

  // Buffer and Save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToPDF(data: ExportData[], title: string, institutionName: string) {
  const doc: any = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(31, 78, 120);
  doc.text(institutionName, 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(title, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 37);

  // Table
  const tableData = data.map(item => [
    item.name,
    item.controlNumber,
    item.curp,
    item.career,
    `${item.semester} / ${item.group}`,
    item.module,
    item.status
  ]);

  (doc as any).autoTable({
    startY: 45,
    head: [['Nombre', 'Control', 'CURP', 'Carrera', 'Sem/Grup', 'Mod', 'Estatus']],
    body: tableData,
    headStyles: { fillColor: [31, 78, 120] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 45 }
  });

  // Watermark
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
    doc.text('DOCUMENTO OFICIAL TECNOLINGO AI', 35, doc.internal.pageSize.height / 2, { angle: 45 });
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
