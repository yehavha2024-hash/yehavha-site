import fs from 'node:fs';

const jobs = [
  {
    file: 'nexus/portal-enhancements.css',
    replacements: [
      ['background:#071426!important', 'background:#ffffff!important']
    ]
  },
  {
    file: 'nexus/toeic-human-v2/style.css',
    replacements: [
      ['.lexicon-item{background:#f9fbfe', '.lexicon-item{background:#ffffff']
    ]
  },
  {
    file: 'nexus/university/university.css',
    replacements: [
      ['.progress-card{margin:8px 0 12px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:rgba(8,18,38,.78)', '.progress-card{margin:8px 0 12px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:#ffffff'],
      ['.progress-track{height:6px;overflow:hidden;border-radius:999px;background:#06101f}', '.progress-track{height:6px;overflow:hidden;border-radius:999px;background:#e5e7eb}']
    ]
  }
];

for (const job of jobs) {
  const source = fs.readFileSync(job.file, 'utf8');
  let next = source;
  for (const [from, to] of job.replacements) next = next.replace(from, to);
  if (next !== source) fs.writeFileSync(job.file, next);
}
