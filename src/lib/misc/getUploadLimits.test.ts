import { getUploadLimits } from './getUploadLimits';

describe('getUploadLimits', () => {
  const previousLocalDev = process.env.LOCAL_DEV;

  afterEach(() => {
    if (previousLocalDev == null) {
      delete process.env.LOCAL_DEV;
      return;
    }
    process.env.LOCAL_DEV = previousLocalDev;
  });

  test('not patron', () => {
    delete process.env.LOCAL_DEV;
    const limits = getUploadLimits(false);
    const about100MB = 104857600;
    expect(limits.fileSize).toBe(about100MB);
  });

  test('paying', () => {
    delete process.env.LOCAL_DEV;
    const limits = getUploadLimits(true);
    const about1GB = 10485760000;
    expect(limits.fileSize).toBe(about1GB);
  });

  test('local dev returns unrestricted limits', () => {
    process.env.LOCAL_DEV = 'true';
    const limits = getUploadLimits(false);
    expect(limits.fileSize).toBe(Number.MAX_SAFE_INTEGER);
    expect(limits.fieldSize).toBe(Number.MAX_SAFE_INTEGER);
  });
});
