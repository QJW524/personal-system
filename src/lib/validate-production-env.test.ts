import { describe, expect, it } from 'vitest';

import { validateProductionEnv } from '../../scripts/validate-production-env.mjs';

const validEnv = `
# Production database
POSTGRES_DB=personal_system
POSTGRES_USER=personal_system
POSTGRES_PASSWORD=a-strong-password
OPTIONAL_EMPTY=
`;

describe('validateProductionEnv', () => {
  it('accepts valid dotenv content with comments and optional empty values', () => {
    expect(() => validateProductionEnv(validEnv)).not.toThrow();
  });

  it('rejects empty content', () => {
    expect(() => validateProductionEnv('  \n')).toThrow('PRODUCTION_ENV is empty or unavailable');
  });

  it('rejects malformed dotenv lines without exposing their content', () => {
    expect(() => validateProductionEnv(`${validEnv}\nnot-a-valid-line`)).toThrow(
      'PRODUCTION_ENV contains an invalid dotenv line at 8',
    );
  });

  it.each(['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'])(
    'rejects a missing %s entry',
    (key) => {
      const withoutKey = validEnv
        .split('\n')
        .filter((line) => !line.startsWith(`${key}=`))
        .join('\n');

      expect(() => validateProductionEnv(withoutKey)).toThrow(
        `PRODUCTION_ENV must contain exactly one non-empty ${key} entry`,
      );
    },
  );

  it('rejects duplicate required entries', () => {
    expect(() => validateProductionEnv(`${validEnv}\nPOSTGRES_DB=duplicate`)).toThrow(
      'PRODUCTION_ENV must contain exactly one non-empty POSTGRES_DB entry',
    );
  });

  it.each(['', "''", '""'])('rejects an empty required value represented as %j', (value) => {
    const withEmptyPassword = validEnv.replace(
      'POSTGRES_PASSWORD=a-strong-password',
      `POSTGRES_PASSWORD=${value}`,
    );

    expect(() => validateProductionEnv(withEmptyPassword)).toThrow(
      'PRODUCTION_ENV must contain exactly one non-empty POSTGRES_PASSWORD entry',
    );
  });
});
