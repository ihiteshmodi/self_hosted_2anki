import { getMaxUploadCount } from './getMaxUploadCount';

describe('getMaxUploadCount', () => {
  const previousLocalDev = process.env.LOCAL_DEV;

  afterEach(() => {
    if (previousLocalDev == null) {
      delete process.env.LOCAL_DEV;
      return;
    }
    process.env.LOCAL_DEV = previousLocalDev;
  });

  test('free users get default cap', () => {
    delete process.env.LOCAL_DEV;
    expect(getMaxUploadCount(false)).toBe(21);
  });

  test('paid users get expanded cap', () => {
    delete process.env.LOCAL_DEV;
    expect(getMaxUploadCount(true)).toBe(2100);
  });

  test('local dev removes cap', () => {
    process.env.LOCAL_DEV = 'true';
    expect(getMaxUploadCount(false)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
