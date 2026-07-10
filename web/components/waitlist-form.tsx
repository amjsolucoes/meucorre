'use client';

import { useId, useState, useTransition } from 'react';
import { submitWaitlistEmail } from '@/app/actions';

export function WaitlistForm() {
  const inputId = useId();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitWaitlistEmail(formData);
      if ('error' in result) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
      }
    });
  }

  if (status === 'success') {
    return (
      <p className="rounded-full bg-accent/15 px-5 py-3 font-body text-sm font-semibold text-accent-dark">
        Prontinho! Avisamos você assim que o app estiver disponível.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form action={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Seu melhor e-mail
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className="w-full flex-1 rounded-full border border-border bg-white px-5 py-3 font-body text-sm text-text-primary placeholder:text-text-hint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent px-6 py-3 font-body text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
        >
          {isPending ? 'Enviando...' : 'Avise-me'}
        </button>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-2 font-body text-xs font-semibold text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}
