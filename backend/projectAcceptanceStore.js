const fs = require('fs');
const path = require('path');
const { _docx } = require('./projectCharterStore');

const TEMPLATE = path.join(__dirname, 'templates', 'project-acceptance-template.docx');

const esc = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function run(text, options = {}) {
  const font = 'Arial';
  const bold = options.bold ? '<w:b/>' : '';
  const italic = options.italic ? '<w:i/>' : '';
  return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>${bold}${italic}<w:color w:val="${options.color || '1F1F1F'}"/><w:sz w:val="${options.size || 21}"/><w:szCs w:val="${options.size || 21}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function paragraph(text, options = {}) {
  const align = options.align ? `<w:jc w:val="${options.align}"/>` : '';
  const keep = options.keepNext ? '<w:keepNext/>' : '';
  return `<w:p><w:pPr><w:spacing w:before="${options.before || 0}" w:after="${options.after == null ? 100 : options.after}"/>${align}${keep}</w:pPr>${run(text, options)}</w:p>`;
}

function heading(number, text) {
  return `<w:p><w:pPr><w:spacing w:before="250" w:after="100"/><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="00B050"/></w:pBdr></w:pPr>${run(`${number}. ${text}`, { bold: true, color: '0070C0', size: 25 })}</w:p>`;
}

function cell(text, options = {}) {
  const shade = options.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${options.shade}"/>` : '';
  const width = options.width ? `<w:tcW w:w="${options.width}" w:type="dxa"/>` : '';
  return `<w:tc><w:tcPr>${width}${shade}<w:vAlign w:val="center"/></w:tcPr>${paragraph(text || '—', { bold: options.bold, color: options.color || '26352D', size: options.size || 19, after: 20 })}</w:tc>`;
}

function table(rows, widths) {
  const grid = `<w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>`;
  const borders = '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="D6DCE2"/><w:left w:val="single" w:sz="4" w:color="D6DCE2"/><w:bottom w:val="single" w:sz="4" w:color="D6DCE2"/><w:right w:val="single" w:sz="4" w:color="D6DCE2"/><w:insideH w:val="single" w:sz="4" w:color="D6DCE2"/><w:insideV w:val="single" w:sz="4" w:color="D6DCE2"/></w:tblBorders>';
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>${borders}<w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr>${grid}${rows.map((row, rowIndex) => `<w:tr>${row.map((value, index) => cell(value, { width: widths[index], bold: rowIndex === 0, shade: rowIndex === 0 ? '00B050' : 'FFFFFF', color: rowIndex === 0 ? 'FFFFFF' : '26352D' })).join('')}</w:tr>`).join('')}</w:tbl>`;
}

function formatDate(value) {
  if (!value) return 'Por definir';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return day && month && year ? `${day}/${month}/${year}` : String(value);
}

function meaningful(items, key) {
  return (Array.isArray(items) ? items : []).filter((item) => item && String(item[key] || '').trim());
}

function buildAcceptanceDocument(project, acceptance, originalXml) {
  const objectives = meaningful(project.objetivos, 'texto');
  if (!objectives.length && String(project.objetivo || '').trim()) {
    objectives.push({ texto: project.objetivo, resultadoEsperado: '', resultadoObtenido: '', estado: '' });
  }
  const objectiveRows = [['Objetivo', 'Resultado Esperado', 'Resultado Obtenido', 'Estado']].concat(
    objectives.length ? objectives.map((item) => [item.texto, item.resultadoEsperado || 'Por definir', item.resultadoObtenido || 'Por definir', item.estado || 'Sin evaluar']) : [['Por definir', 'Por definir', 'Por definir', 'Sin evaluar']]
  );
  const deliverables = meaningful(project.entregables, 'nombre');
  const deliverableRows = [['Entregable', 'Fecha de Entrega', 'Aprobado por', 'Comentarios']].concat(
    deliverables.length ? deliverables.map((item) => [item.nombre, formatDate(item.fechaEntrega), item.aprobadoPor || 'Por definir', item.comentarios || '—']) : [['Por definir', 'Por definir', 'Por definir', '—']]
  );
  const pending = meaningful(project.pendientesRecomendaciones, 'elemento');
  const pendingRows = [['Elemento', 'Acción Recomendada', 'Responsable', 'Fecha de Seguimiento']].concat(
    pending.map((item) => [item.elemento, item.accionRecomendada || 'Por definir', item.responsable || 'Por definir', formatDate(item.fechaSeguimiento)])
  );
  const signatures = meaningful(acceptance.firmantes, 'nombre');
  const signatureRows = [['Rol', 'Nombre', 'Firma', 'Fecha']].concat(
    signatures.length ? signatures.map((item) => [item.rol || 'Aprobador', item.nombre, '____________________', formatDate(item.fecha)]) : [['Por definir', 'Por definir', '____________________', 'Por definir']]
  );
  const projectObjectives = objectives.map((item) => item.texto).join('; ');
  const mainObjective = String(project.objetivo || projectObjectives || 'Por definir').trim().replace(/[.\s]+$/, '');
  const defaultSummary = `El proyecto “${project.tituloEjecutivo || project.nombre || 'Por definir'}” se desarrolló entre ${formatDate(project.inicio)} y ${formatDate(project.fin)}. ${project.descripcionEjecutiva || project.descripcion || ''} Su objetivo fue ${mainObjective}. El resultado general registrado es ${project.estado || 'Por definir'}, con ${Number(project.avance) || 0}% de avance.`.replace(/\s+/g, ' ').trim();
  const summary = acceptance.resumenEjecutivo || defaultSummary;
  const declaration = acceptance.declaracion || 'Declaro que el proyecto ha sido completado de acuerdo con los requerimientos establecidos y que los entregables cumplen con los criterios de aceptación definidos.';
  const formalName = acceptance.aceptacionNombre || 'Por definir';
  const formalDate = formatDate(acceptance.aceptacionFecha);
  const sect = (originalXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/) || ['<w:sectPr/>'])[0];
  const body = [
    paragraph('ACTA DE ACEPTACIÓN DE PROYECTO', { bold: true, color: '0070C0', size: 34, align: 'center', after: 80 }),
    paragraph(project.tituloEjecutivo || project.nombre || 'Proyecto', { bold: true, color: '00B050', size: 24, align: 'center', after: 220 }),
    heading(1, 'Resumen Ejecutivo'), paragraph(summary),
    heading(2, 'Cumplimiento de Objetivos'), table(objectiveRows, [2600, 2200, 2200, 1800]),
    heading(3, 'Entregables Finales Aprobados'), paragraph('Entregables validados y aceptados formalmente.', { italic: true, color: '6B7684', size: 19 }), table(deliverableRows, [2800, 1800, 2300, 2300]),
    heading(4, 'Aceptación Formal del Cliente/Usuario Final'), paragraph(declaration),
    paragraph(`Firma Cliente/Usuario Final: ____________________    Nombre: ${formalName}    Fecha: ${formalDate}`, { bold: true, before: 100, after: 150 }),
    pending.length ? heading(5, 'Pendientes y Recomendaciones') + paragraph('Elementos no concluidos, transferencias a operaciones o soporte.', { italic: true, color: '6B7684', size: 19 }) + table(pendingRows, [2500, 3000, 2000, 1700]) : '',
    heading(pending.length ? 6 : 5, 'Firmas de Aprobación'), table(signatureRows, [2300, 2600, 2200, 1800]),
    sect,
  ].join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}</w:body></w:document>`;
}

function buildProjectAcceptance(project, acceptance = {}) {
  const entries = _docx.readZip(fs.readFileSync(TEMPLATE));
  const documentEntry = entries.find((entry) => entry.name === 'word/document.xml');
  if (!documentEntry) throw new Error('docx_document_missing');
  documentEntry.data = Buffer.from(buildAcceptanceDocument(project, acceptance, documentEntry.data.toString('utf8')), 'utf8');
  return _docx.writeZip(entries);
}

module.exports = { buildProjectAcceptance };
