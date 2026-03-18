export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryable: boolean = false,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  NETWORK_OFFLINE: new AppError(
    'NETWORK_OFFLINE',
    'Voce esta sem internet. Seus dados estao salvos localmente.',
    true,
  ),
  AUTH_FAILED: new AppError(
    'AUTH_FAILED',
    'Nao foi possivel entrar. Tente novamente.',
    true,
  ),
  AUTH_EXPIRED: new AppError(
    'AUTH_EXPIRED',
    'Sua sessao expirou. Faca login novamente.',
    false,
    401,
  ),
  PAYMENT_FAILED: new AppError(
    'PAYMENT_FAILED',
    'Nao foi possivel gerar o PIX. Tente novamente ou marque como pago manualmente.',
    true,
  ),
  SYNC_FAILED: new AppError(
    'SYNC_FAILED',
    'Erro ao sincronizar dados. Tentaremos novamente automaticamente.',
    true,
  ),
} as const;
