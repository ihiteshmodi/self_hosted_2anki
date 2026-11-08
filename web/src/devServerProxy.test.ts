import { describe, expect, it } from 'vitest';
import viteConfig from '../vite.config';

type DevProxyTable = Record<string, { target: string }>;

const devServerProxy = (
  viteConfig({
    command: 'serve',
    mode: 'development',
    isSsrBuild: false,
    isPreview: false,
  }) as { server: { proxy: DevProxyTable } }
).server.proxy;

const API_SERVER = 'http://localhost:2020';

function proxyTargetFor(url: string): string | undefined {
  const matchingKey = Object.keys(devServerProxy).find((key) =>
    key.startsWith('^') ? new RegExp(key).test(url) : url.startsWith(key)
  );
  return matchingKey === undefined ? undefined : devServerProxy[matchingKey].target;
}

describe('dev server proxy', () => {
  it.each([
    ['an API call', '/api/upload/file'],
    ['a single deck link in the multi-deck result', '/download/3f2a-ws/Deck-1.apkg'],
    ['the bulk zip link in the multi-deck result', '/download/3f2a-ws/bulk'],
  ])('forwards %s to the API server', (_what, url) => {
    expect(proxyTargetFor(url)).toBe(API_SERVER);
  });

  it('keeps the /downloads page in the web app', () => {
    expect(proxyTargetFor('/downloads')).toBeUndefined();
  });
});
