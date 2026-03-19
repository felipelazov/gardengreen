import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GardenGreen — O app do jardineiro brasileiro',
  description:
    'Gestao completa para jardineiros profissionais. Agenda, clientes, orcamentos, cobranca PIX, tudo no celular.',
  keywords: ['jardineiro', 'gestao', 'app', 'jardinagem', 'pix', 'agenda'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="m-0 antialiased">
        {children}
      </body>
    </html>
  );
}
