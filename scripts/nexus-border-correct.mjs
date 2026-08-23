import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const ROOTS=['nexus','legal-knowledge','legal-philosophy','ai-law-tech-foresight','living-law-100','toeic-human','toeic-human-v2'];
function walk(d,o=[]){if(!fs.existsSync(d))return o;for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='.git'||e.name==='node_modules')continue;const f=path.join(d,e.name);e.isDirectory()?walk(f,o):o.push(f)}return o}
for(const f of ROOTS.flatMap(r=>walk(path.join(ROOT,r)))){if(!f.endsWith('.css'))continue;const b=fs.readFileSync(f,'utf8');const a=b
.replace(/border-color\s*:\s*#111111/gi,'border-color:#b8c6d3')
.replace(/border-color\s*:\s*#111\b/gi,'border-color:#b8c6d3')
.replace(/border\s*:\s*([0-9.]+px)\s+solid\s+#111111/gi,'border:$1 solid #b8c6d3')
.replace(/border\s*:\s*([0-9.]+px)\s+solid\s+#111\b/gi,'border:$1 solid #b8c6d3')
.replace(/border-(top|right|bottom|left)\s*:\s*([0-9.]+px)\s+solid\s+#111111/gi,'border-$1:$2 solid #b8c6d3')
.replace(/border-(top|right|bottom|left)\s*:\s*([0-9.]+px)\s+solid\s+#111\b/gi,'border-$1:$2 solid #b8c6d3');
if(a!==b)fs.writeFileSync(f,a)}
console.log('Nexus border contrast corrected');
