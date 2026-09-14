// Run with the server stopped. Only users.csv is modified; back up all data first.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { readCSVFile, writeCSVFileAtomic } = require('../backend/csvStore');
const { normalizeGroup, parseGroups } = require('../backend/teamScope');

const PROFILES = [
  { email:'bperezc@intercorp.com.pe', nombre:'Mauricio', rol:'jefe', grupo:'', gruposSupervisados:'datalab;pmo' },
  { email:'pvallejoe@intercorp.com.pe', nombre:'Paolo', rol:'jefe', grupo:'', gruposSupervisados:'datalab;pmo;smartdesk' },
  { email:'jgomezg@intercorp.com.pe', nombre:'Johannes', rol:'coordinador', grupo:'pmo', gruposSupervisados:'' },
  { email:'jmontesdeoca@intercorp.com.pe', nombre:'Jean Pierre', rol:'coordinador', grupo:'datalab', gruposSupervisados:'' },
  { email:'snovoam@intercorp.com.pe', nombre:'Silbana', rol:'analista', grupo:'smartdesk', gruposSupervisados:'' },
  { email:'ffrassinellif@intercorp.com.pe', nombre:'Franchesca', rol:'analista', grupo:'pmo', gruposSupervisados:'' },
  { email:'pazana@intercorp.com.pe', nombre:'Patty', rol:'jefe', grupo:'', gruposSupervisados:'smartdesk' },
];
function prepareUsers(source, passwords = {}) {
  const rows = source.rows.map(row => ({...row}));
  const byEmail = new Map();
  for (const row of rows) {
    const key = String(row.email || '').trim().toLowerCase();
    if (byEmail.has(key)) throw new Error('Duplicate user email; migration cancelled');
    byEmail.set(key,row);
  }
  const missingPasswords = [];
  for (const profile of PROFILES) {
    const existing = byEmail.get(profile.email);
    const row = existing || { email:profile.email, nombre:profile.nombre, modulos:'gantt' };
    // Keep existing names: assignment relationships use these exact strings.
    Object.assign(row, {rol:profile.rol,grupo:normalizeGroup(profile.grupo),gruposSupervisados:parseGroups(profile.gruposSupervisados).join(';')});
    if (!existing) { rows.push(row); byEmail.set(profile.email,row); }
  }
  // Password-only changes must also cover existing users whose role is unchanged.
  for (const [email,password] of Object.entries(passwords)) {
    const row = byEmail.get(email.trim().toLowerCase());
    if (!row) throw new Error('Unknown password account; migration cancelled: '+email);
    if (typeof password !== 'string' || !password.trim()) throw new Error('Empty password; migration cancelled');
    row.password = password;
  }
  for (const profile of PROFILES) if (!byEmail.get(profile.email).password) missingPasswords.push(profile.email);
  return { headers:[...new Set([...source.headers,'email','password','nombre','rol','grupo','modulos','gruposSupervisados'])], rows, missingPasswords };
}
function migrate(dataDir, passwords = {}) {
  const target = path.resolve(dataDir);
  const usersFile = path.join(target,'users.csv');
  if (!fs.existsSync(usersFile)) throw new Error('Existing users.csv required');
  const prepared = prepareUsers(readCSVFile(usersFile),passwords);
  if (prepared.missingPasswords.length) throw new Error('Passwords required for new accounts: '+prepared.missingPasswords.join(', '));
  const protectedFiles = ['projects.csv','tasks.csv','independent_tasks.csv','audit_log.csv'];
  const hash = file => fs.existsSync(file) ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null;
  const before = Object.fromEntries(protectedFiles.map(name=>[name,hash(path.join(target,name))]));
  const backup = path.join(path.dirname(target),'data-backup-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex'));
  fs.cpSync(target,backup,{recursive:true,errorOnExist:true,force:false});
  writeCSVFileAtomic(usersFile,prepared.headers,prepared.rows);
  for (const [name,digest] of Object.entries(before)) {
    if (hash(path.join(target,name)) !== digest) throw new Error('Data changed during migration; stop the server and inspect backup: '+backup);
  }
  return { backup, users:prepared.rows.length, unchanged:protectedFiles.filter(name=>before[name] !== null) };
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const value = name => args.includes(name) ? args[args.indexOf(name)+1] : undefined;
    const dataDir = value('--data-dir') || path.join(__dirname,'../backend/data');
    const passwordFile = value('--passwords');
    const passwords = passwordFile ? JSON.parse(fs.readFileSync(passwordFile,'utf8').replace(/^\uFEFF/,'')) : {};
    if (args.includes('--check')) {
      const plan = prepareUsers(readCSVFile(path.join(dataDir,'users.csv')),passwords);
      console.log(JSON.stringify({users:plan.rows.length,missingPasswords:plan.missingPasswords},null,2));
    } else console.log(JSON.stringify(migrate(dataDir,passwords),null,2));
  } catch (error) { console.error(error.message); process.exitCode=1; }
}
module.exports = { PROFILES, prepareUsers, migrate };
