import fs from 'node:fs';
import path from 'node:path';

const ROOT='nexus';
const rows=[];
function walk(dir,predicate,out=[]){if(!fs.existsSync(dir))return out;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory()){if(e.name==='assets'||e.name==='.git')continue;walk(full,predicate,out)}else if(predicate(full))out.push(full)}return out}
function clean(v){return v.replace(/\s*!important\s*$/i,'').trim().toLowerCase()}
function scan(css,file){const src=css.replace(/\/\*[\s\S]*?\*\//g,'');for(const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const selector=m[1].trim();if(!selector||selector.startsWith('@'))continue;for(const d of m[2].matchAll(/(^|;)\s*([\w-]+)\s*:\s*([^;}]*)/g)){const prop=d[2].toLowerCase(),value=clean(d[3]);if(prop==='background'||prop==='background-color'||prop==='background-image'){if(!['#fff','#ffffff','white','transparent','none'].includes(value))rows.push(`${file} | ${selector} | ${prop}: ${d[3].trim()}`)}}}}
for(const file of walk(ROOT,f=>f.endsWith('.css')))scan(fs.readFileSync(file,'utf8'),file);
for(const file of walk(ROOT,f=>f.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');for(const s of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))scan(s[1],`${file}#style`)}
const base=fs.existsSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt')?fs.readFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt','utf8').replace(/\nBACKGROUND INVENTORY[\s\S]*$/,'').trim():'';
const report=[base,'','BACKGROUND INVENTORY',`non-white background declarations: ${rows.length}`,...rows].join('\n').trim()+'\n';fs.writeFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt',report);console.log(report);
