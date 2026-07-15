import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const REQUIRED_KEYS = ['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
const DOTENV_LINE = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/;

export function validateProductionEnv(source) {
  if (typeof source !== 'string' || source.trim().length === 0) {
    throw new Error('PRODUCTION_ENV is empty or unavailable');
  }

  const valuesByKey = new Map();

  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const match = DOTENV_LINE.exec(line);
    if (!match) {
      throw new Error(`PRODUCTION_ENV contains an invalid dotenv line at ${index + 1}`);
    }

    const [, key, rawValue] = match;
    const existing = valuesByKey.get(key) ?? [];
    existing.push(rawValue.trim());
    valuesByKey.set(key, existing);
  }

  for (const key of REQUIRED_KEYS) {
    const values = valuesByKey.get(key) ?? [];
    const hasOneNonEmptyValue =
      values.length === 1 && values[0] !== '' && values[0] !== "''" && values[0] !== '""';

    if (!hasOneNonEmptyValue) {
      throw new Error(`PRODUCTION_ENV must contain exactly one non-empty ${key} entry`);
    }
  }
}

async function main() {
  const envFile = process.argv[2];
  if (!envFile) {
    throw new Error('Usage: node scripts/validate-production-env.mjs <dotenv-file>');
  }

  validateProductionEnv(await readFile(envFile, 'utf8'));
  console.log('PRODUCTION_ENV validation passed');
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (entryPoint === import.meta.url) {
  main().catch((error) => {
    console.error(`::error::${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
