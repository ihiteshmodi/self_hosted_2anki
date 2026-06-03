import {
  AiTemplateQuotaService,
  FREE_GENERATE_LIMIT,
  FREE_MODIFY_LIMIT,
} from './AiTemplateQuotaService';

function buildUsers(counts: { generate: number; modify: number }) {
  return {
    getAiTemplateCounts: jest.fn().mockResolvedValue(counts),
    incrementAiTemplateGenerateCount: jest.fn().mockResolvedValue(1),
    incrementAiTemplateModifyCount: jest.fn().mockResolvedValue(1),
  };
}

describe('AiTemplateQuotaService.check', () => {
  const previousLocalDev = process.env.LOCAL_DEV;

  afterEach(() => {
    if (previousLocalDev == null) {
      delete process.env.LOCAL_DEV;
      return;
    }
    process.env.LOCAL_DEV = previousLocalDev;
  });

  it('returns unlimited for patreon users', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: 1000, modify: 1000 });
    const service = new AiTemplateQuotaService(users as never);

    const generate = await service.check(1, 'generate', { patreon: true });
    expect(generate.allowed).toBe(true);
    expect(generate.unlimited).toBe(true);
    expect(generate.remaining).toBe(Number.POSITIVE_INFINITY);
    expect(users.getAiTemplateCounts).not.toHaveBeenCalled();
  });

  it('returns unlimited for Stripe subscribers', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: 0, modify: 0 });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(1, 'modify', { subscriber: true });
    expect(result.unlimited).toBe(true);
  });

  it('allows a free user under the generate cap', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: 1, modify: 0 });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(7, 'generate', {});
    expect(result).toMatchObject({
      allowed: true,
      remaining: FREE_GENERATE_LIMIT - 1,
      limit: FREE_GENERATE_LIMIT,
      used: 1,
      unlimited: false,
    });
  });

  it('denies a free user at the generate cap', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: FREE_GENERATE_LIMIT, modify: 0 });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(7, 'generate', {});
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('uses the modify cap when checking modify', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: 0, modify: FREE_MODIFY_LIMIT });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(7, 'modify', {});
    expect(result.allowed).toBe(false);
    expect(result.limit).toBe(FREE_MODIFY_LIMIT);
  });

  it('treats null locals as non-paying', async () => {
    delete process.env.LOCAL_DEV;
    const users = buildUsers({ generate: FREE_GENERATE_LIMIT, modify: 0 });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(7, 'generate', null);
    expect(result.allowed).toBe(false);
    expect(result.unlimited).toBe(false);
  });

  it('returns unlimited in local dev even for free locals', async () => {
    process.env.LOCAL_DEV = 'true';
    const users = buildUsers({ generate: FREE_GENERATE_LIMIT, modify: FREE_MODIFY_LIMIT });
    const service = new AiTemplateQuotaService(users as never);
    const result = await service.check(7, 'generate', {});
    expect(result.allowed).toBe(true);
    expect(result.unlimited).toBe(true);
    expect(users.getAiTemplateCounts).not.toHaveBeenCalled();
  });
});

describe('AiTemplateQuotaService.record', () => {
  it('increments the matching counter', async () => {
    const users = buildUsers({ generate: 0, modify: 0 });
    const service = new AiTemplateQuotaService(users as never);

    await service.record(42, 'generate');
    expect(users.incrementAiTemplateGenerateCount).toHaveBeenCalledWith(42);

    await service.record(42, 'modify');
    expect(users.incrementAiTemplateModifyCount).toHaveBeenCalledWith(42);
  });
});
