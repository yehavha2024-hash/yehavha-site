import fs from 'node:fs';

const edits = [
  ['nexus/portal-enhancements.css', [['background:#071426!important','background:#ffffff!important']]],
  ['nexus/toeic-human-v2/style.css', [['.lexicon-item{background:#f9fbfe','.lexicon-item{background:#ffffff']]],
  ['nexus/university/university.css', [
    ['.progress-card{margin:8px 0 12px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:rgba(8,18,38,.78)', '.progress-card{margin:8px 0 12px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:#ffffff'],
    ['.progress-track{height:6px;overflow:hidden;border-radius:999px;background:#06101f}', '.progress-track{height:6px;overflow:hidden;border-radius:999px;background:#e5e7eb}']
  ]]
];

const changed=[];
for(const [file,replacements] of edits){let source=fs.readFileSync(file,'utf8'),next=source;for(const [from,to] of replacements)next=next.replace(from,to);if(next!==source){fs.writeFileSync(file,next);changed.push(file)}}

const preserved=[];
const unexpected=[];
function walk(dir,predicate,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=`${dir}/${e.name}`;if(e.isDirectory()){if(e.name==='assets'||e.name==='.git')continue;walk(full,predicate,out)}else if(predicate(full))out.push(full)}return out}
function scan(css,file){const src=css.replace(/\/\*[\s\S]*?\*\//g,'');for(const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const selector=m[1].trim();if(!selector||selector.startsWith('@'))continue;for(const d of m[2].matchAll(/(^|;)\s*(background(?:-color|-image)?)\s*:\s*([^;}]*)/g)){const value=d[3].replace(/\s*!important\s*$/i,'').trim().toLowerCase();if(['#fff','#ffffff','white','transparent','none'].includes(value))continue;if(/url\(/i.test(value)){preserved.push(`${file} | ${selector} | ${d[2]}: ${d[3].trim()}`);continue}if(/(?:icon|glyph|svg|logo|mark|dot|artwork|avatar|illustration|pictogram|emoji|swatch|progress-(?:bar|fill|ring)|meter-(?:bar|fill)|chart|spark)/i.test(selector)){preserved.push(`${file} | ${selector} | ${d[2]}: ${d[3].trim()}`);continue}if(/(?:progress|meter)-track/i.test(selector)&&['#e5e7eb','#e4ebf3'].includes(value)){preserved.push(`${file} | ${selector} | ${d[2]}: ${d[3].trim()}`);continue}unexpected.push(`${file} | ${selector} | ${d[2]}: ${d[3].trim()}`)}}}}
for(const file of walk('nexus',f=>f.endsWith('.css')))scan(fs.readFileSync(file,'utf8'),file);
for(const file of walk('nexus',f=>f.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');for(const s of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))scan(s[1],`${file}#style`)}

const base=fs.existsSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt')?fs.readFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt','utf8').replace(/\nBACKGROUND INVENTORY[\s\S]*$/,'').trim():'';
const report=[base,'','FINAL SURFACE CHECK',`direct cleanup files: ${changed.length}`,`unexpected non-white backgrounds: ${unexpected.length}`,`preserved icon/image/progress visuals: ${preserved.length}`,...unexpected,'','PRESERVED VISUALS',...preserved].join('\n').trim()+'\n';
fs.writeFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt',report);console.log(report);
