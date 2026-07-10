import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitWaitlistEmail } from './actions';

const insertMock = vi.fn();

vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

function formDataWith(email: string) {
  const fd = new FormData();
  fd.set('email', email);
  return fd;
}

describe('submitWaitlistEmail', () => {
  beforeEach(() => {
    insertMock.mockReset();
  });

  it('rejects an empty email', async () => {
    const result = await submitWaitlistEmail(formDataWith(''));
    expect(result).toEqual({ error: 'Digite um e-mail válido.' });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects a string without an @', async () => {
    const result = await submitWaitlistEmail(formDataWith('nao-e-email'));
    expect(result).toEqual({ error: 'Digite um e-mail válido.' });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('saves a valid email', async () => {
    insertMock.mockResolvedValue({ error: null });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(insertMock).toHaveBeenCalledWith({ email: 'ana@example.com' });
    expect(result).toEqual({ success: true });
  });

  it('treats a duplicate email as success', async () => {
    insertMock.mockResolvedValue({ error: { code: '23505', message: 'duplicate key' } });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(result).toEqual({ success: true });
  });

  it('surfaces a generic error for other failures', async () => {
    insertMock.mockResolvedValue({ error: { code: '500', message: 'network down' } });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(result).toEqual({
      error: 'Não foi possível salvar seu e-mail agora. Tente de novo em instantes.',
    });
  });
});
