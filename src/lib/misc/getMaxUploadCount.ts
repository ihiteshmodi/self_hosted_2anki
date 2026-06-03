export function getMaxUploadCount(paying?: boolean) {
  if (process.env.LOCAL_DEV === 'true') {
    return Number.MAX_SAFE_INTEGER;
  }

  const maxUploadCount = 21;
  if (paying) {
    return maxUploadCount * 100;
  }
  return maxUploadCount;
}
