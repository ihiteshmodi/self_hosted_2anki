export const isPaying = (locals?: Record<string, unknown>) => {
  if (process.env.LOCAL_DEV === 'true') {
    return true;
  }
  if (!locals) {
    return false;
  }
  return locals.patreon === true || locals.subscriber === true;
};
