import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DEFAULT_DIR = path.join(process.cwd(), 'toeic-human-100');

export const RUNTIME_FILES = [
  'reading-content-v2.js',
  'reading-content-v2-days02-04.js',
  'reading-content-v2-days05-07.js',
  'reading-content-v2-days08-10.js',
  'reading-global-bridge.js',
  'reading-content-v2-days01-10-enrichment.js',
  'teps-extension-v2.js',
  'teps-extension-enrichment.js',
  'reading-content-v2-days11-100-builder.js',
  'reading-content-v2-generated-study-plan.js'
];

export const FINALIZER_FILES = [
  'reading-length-normalizer.js'
];

function runFile(context, dir, file) {
  const full = path.join(dir, file);
  if (!fs.existsSync(full)) throw new Error(`Missing TOEIC runtime file: ${file}`);
  vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: file });
}

export function loadToeicRuntime(dir = DEFAULT_DIR) {
  const context = { console };
  vm.createContext(context);

  for (const file of RUNTIME_FILES) runFile(context, dir, file);

  const masterFile = path.join(dir, 'master-lexicon-v2.json');
  if (!fs.existsSync(masterFile)) throw new Error('Missing TOEIC master lexicon: master-lexicon-v2.json');
  const master = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
  context.__MASTER__ = master;

  vm.runInContext('TOEIC_READING_V2_BUILDER.attach(TOEIC_READING_V2_BUILDER.build(__MASTER__));', context);

  for (const file of FINALIZER_FILES) runFile(context, dir, file);

  vm.runInContext(
    'globalThis.__PROGRAM__ = TOEIC_READING_V2; globalThis.__TEPS__ = TEPS_READING_EXTENSION_V2;',
    context
  );

  return {
    context,
    master,
    program: context.__PROGRAM__,
    teps: context.__TEPS__,
    runtimeFiles: [...RUNTIME_FILES, ...FINALIZER_FILES]
  };
}
