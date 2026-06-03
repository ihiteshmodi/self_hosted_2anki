import { isPaying } from './isPaying';

describe('isPaying', () => {
  const previousLocalDev = process.env.LOCAL_DEV;

  afterEach(() => {
    if (previousLocalDev == null) {
      delete process.env.LOCAL_DEV;
      return;
    }
    process.env.LOCAL_DEV = previousLocalDev;
  });

  test('returns false with empty locals outside local dev', () => {
    delete process.env.LOCAL_DEV;
    expect(isPaying()).toBe(false);
  });

  test('returns true for paid locals outside local dev', () => {
    delete process.env.LOCAL_DEV;
    expect(isPaying({ patreon: true })).toBe(true);
    expect(isPaying({ subscriber: true })).toBe(true);
  });

  test('returns true in local dev regardless of locals', () => {
    process.env.LOCAL_DEV = 'true';
    expect(isPaying()).toBe(true);
    expect(isPaying({})).toBe(true);
  });
});
