const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TEMPLATE = path.join(__dirname, 'templates', 'project-charter-template.docx');

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function readZip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054B50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('docx_zip_invalid');
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = [];
  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014B50) throw new Error('docx_central_directory_invalid');
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const data = method === 8 ? zlib.inflateRawSync(compressed) : Buffer.from(compressed);
    entries.push({ name, data });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function writeZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data);
    const crc = crc32(data);
    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(0x04034B50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    name.copy(local, 30);
    locals.push(local, data);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014B50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centrals.push(central);
    offset += local.length + data.length;
  }
  const centralSize = centrals.reduce((sum, item) => sum + item.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054B50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, eocd]);
}

const esc = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function run(text, options = {}) {
  const color = options.color || '26352D';
  const size = options.size || 21;
  const bold = options.bold ? '<w:b/>' : '';
  const font = options.bold ? 'Poppins SemiBold' : 'Poppins';
  return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>${bold}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function paragraph(text, options = {}) {
  const after = options.after == null ? 100 : options.after;
  const align = options.align ? `<w:jc w:val="${options.align}"/>` : '';
  return `<w:p><w:pPr><w:spacing w:after="${after}"/>${align}</w:pPr>${run(text, options)}</w:p>`;
}

function heading(text, color = '0070C0') {
  return `<w:p><w:pPr><w:spacing w:before="220" w:after="100"/><w:keepNext/></w:pPr>${run(text, { bold: true, color, size: 25 })}</w:p>`;
}

function cell(text, options = {}) {
  const shade = options.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${options.shade}"/>` : '';
  const width = options.width ? `<w:tcW w:w="${options.width}" w:type="dxa"/>` : '';
  return `<w:tc><w:tcPr>${width}${shade}<w:vAlign w:val="center"/></w:tcPr>${paragraph(text || '—', { bold: options.bold, color: options.color || '26352D', size: options.size || 19, after: 20 })}</w:tc>`;
}

function table(rows, widths = [], hasHeader = true) {
  const grid = widths.length ? `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` : '';
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="D6DCE2"/><w:left w:val="single" w:sz="4" w:color="D6DCE2"/><w:bottom w:val="single" w:sz="4" w:color="D6DCE2"/><w:right w:val="single" w:sz="4" w:color="D6DCE2"/><w:insideH w:val="single" w:sz="4" w:color="D6DCE2"/><w:insideV w:val="single" w:sz="4" w:color="D6DCE2"/></w:tblBorders><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr>${grid}${rows.map((row, rowIndex) => { const header=hasHeader&&rowIndex===0; return `<w:tr>${row.map((value, i) => cell(value, { width: widths[i], bold: header || (!hasHeader && i === 0), shade: header ? '00B050' : 'FFFFFF', color: header ? 'FFFFFF' : '26352D' })).join('')}</w:tr>`; }).join('')}</w:tbl>`;
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  return day && month && year ? `${day}/${month}/${year}` : String(value);
}

function riskRow(value) {
  if (value && typeof value === 'object') return [value.riesgo || value.text || '—', value.mitigacion || 'Por definir'];
  const text = String(value || '');
  const parts = text.split(/\s*(?:\||;\s*mitigaci[oó]n\s*:|\s+-\s+mitigaci[oó]n\s*:)\s*/i);
  return [parts[0] || '—', parts.slice(1).join(' ') || 'Por definir'];
}

function buildDocument(project, originalXml) {
  const stakeholders = Array.isArray(project.stakeholders) ? project.stakeholders : [];
  const sponsor = stakeholders.find((item) => String(item.rol || '').toLowerCase().includes('sponsor'));
  const overview = [
    ['Nombre del proyecto:', project.tituloEjecutivo || project.nombre || ''],
    ['Sponsor del proyecto:', sponsor ? sponsor.persona : 'Por definir'],
    ['Gerente de proyecto (GP):', project.asignado || 'Por definir'],
    ['Fecha de inicio estimada:', formatDate(project.inicio)],
    ['Fecha de conclusión estimada:', formatDate(project.fin)],
  ];
  if (!project.presupuestoNA) {
    const symbol = project.presupuestoMoneda === 'USD' ? '$' : 'S/';
    overview.push(['Presupuesto estimado:', project.presupuestoMonto ? `${symbol} ${Number(project.presupuestoMonto).toLocaleString('es-PE')}` : 'Por definir']);
  }

  const teamRows = [['Miembros del equipo', 'Rol', 'Actividades']].concat(
    stakeholders.length
      ? stakeholders.map((item) => [item.persona || '—', item.rol || '—', item.actividades || '—'])
      : [['Por definir', 'Por definir', 'Por definir']]
  );
  const ganttRows = [['Actividad', 'Inicio', 'Fin', 'Responsable']];
  ganttRows.push([project.nombre || 'Proyecto', formatDate(project.inicio), formatDate(project.fin), project.asignado || '—']);
  for (const task of (project.tareas || [])) ganttRows.push([task.nombre || 'Tarea', formatDate(task.inicio), formatDate(task.fin), task.asignado || project.asignado || '—']);
  const risks = Array.isArray(project.riesgos) ? project.riesgos.filter((item) => typeof item === 'string' ? item.trim() : item && String(item.riesgo || item.text || '').trim()) : [];
  const riskRows = [['Riesgo potencial', 'Propuesta de mitigación de riesgo']].concat(risks.length ? risks.map(riskRow) : [['Por definir', 'Por definir']]);
  const objectives = (String(project.objetivo || '').trim()
    ? [project.objetivo]
    : (Array.isArray(project.objetivos) ? project.objetivos.map((item) => typeof item === 'string' ? item : item && (item.texto || item.objetivo)) : []))
    .map((item) => String(item || '').trim()).filter(Boolean);
  const objectiveParagraphs = (objectives.length ? objectives : ['Por definir'])
    .map((item) => paragraph(`• ${item}`, { after: 55 })).join('');
  const successCriteria = (Array.isArray(project.criteriosExito) ? project.criteriosExito : [])
    .map((item) => String(item || '').trim()).filter(Boolean);
  const successCriteriaParagraphs = (successCriteria.length ? successCriteria : ['Por definir'])
    .map((item) => paragraph(`• ${item}`, { after: 55 })).join('');
  const sect = (originalXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/) || ['<w:sectPr/>'])[0];

  const body = [
    paragraph('PROJECT CHARTER', { bold: true, color: '0070C0', size: 38, align: 'center', after: 260 }),
    heading('Visión general del proyecto', '44E44C'), table(overview, [3300, 5900], false),
    heading('Descripción del proyecto'), paragraph(project.descripcionEjecutiva || project.descripcion || 'Por definir'),
    heading('Objetivos'), objectiveParagraphs,
    heading('Criterios de Éxito del Proyecto'), successCriteriaParagraphs,
    heading('Alcance preliminar del proyecto'), paragraph(project.alcance || 'Por definir'),
    heading('Cronograma General'), table(ganttRows, [3600, 1600, 1600, 2200]),
    heading('Stakeholders'), table(teamRows, [2800, 2200, 4000]),
    heading('Riesgos Iniciales'), table(riskRows, [4500, 4500]),
    sect,
  ].join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}</w:body></w:document>`;
}

function buildProjectCharter(project) {
  const entries = readZip(fs.readFileSync(TEMPLATE));
  const documentEntry = entries.find((entry) => entry.name === 'word/document.xml');
  if (!documentEntry) throw new Error('docx_document_missing');
  documentEntry.data = Buffer.from(buildDocument(project, documentEntry.data.toString('utf8')), 'utf8');
  return writeZip(entries);
}

function safeFileName(value) {
  return String(value || 'Proyecto').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '_').slice(0, 80);
}

module.exports = { buildProjectCharter, safeFileName, _docx: { readZip, writeZip } };
