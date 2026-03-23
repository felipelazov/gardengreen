// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-6">
      <div className="max-w-[1140px] mx-auto h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-[28px]">🌱</span>
          <span className="font-extrabold text-xl text-primary-dark tracking-tight">
            GardenGreen
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {['Funcionalidades', 'Preços', 'Depoimentos'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground no-underline text-[15px] font-medium transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className="text-primary-dark no-underline text-[15px] font-semibold"
          >
            Entrar
          </a>
          <a
            href="/login"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-[10px] no-underline text-sm font-bold tracking-tight"
          >
            Começar grátis
          </a>
        </div>
        {/* Mobile CTAs */}
        <div className="flex md:hidden items-center gap-3">
          <a href="/login" className="text-primary-dark no-underline text-sm font-semibold">Entrar</a>
          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg no-underline text-sm font-bold">Começar</a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="download"
      className="bg-[#0a0a0a] text-white pt-28 pb-24 px-6 text-center relative overflow-hidden"
    >
      {/* Ambient glow effects */}
      <div
        aria-hidden
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(22,163,74,0.15) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute top-[40%] left-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[860px] mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-5 py-2 mb-10 text-[13px] font-medium tracking-wide text-white/70">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Feito para o jardineiro brasileiro</span>
        </div>

        <h1
          className="font-black leading-[1.05] mb-8 tracking-[-3px]"
          style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
        >
          O app do
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #16A34A 0%, #4ade80 50%, #F59E0B 100%)' }}
          >
            jardineiro
          </span>
          {' '}brasileiro
        </h1>

        <p
          className="text-white/60 leading-relaxed mx-auto mb-14 max-w-[540px] font-normal"
          style={{ fontSize: 'clamp(17px, 2.5vw, 22px)' }}
        >
          Agenda, clientes, orçamentos e cobrança PIX —
          <br />
          tudo no celular, em{' '}
          <span className="text-white font-semibold">3 toques</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-20">
          <a
            href="/login"
            className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl no-underline font-bold text-[17px] transition-all shadow-[0_0_40px_rgba(22,163,74,0.3)] hover:shadow-[0_0_60px_rgba(22,163,74,0.5)]"
          >
            Começar grátis
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#funcionalidades"
            className="bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white px-8 py-4 rounded-2xl no-underline font-semibold text-[17px] border border-white/[0.08] transition-all"
          >
            Ver funcionalidades
          </a>
        </div>

        {/* Stats row */}
        <div className="flex gap-12 justify-center flex-wrap">
          {[
            { value: '14 dias', label: 'grátis pra testar' },
            { value: '3 toques', label: 'pra cobrar no PIX' },
            { value: '100%', label: 'offline no jardim' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[32px] font-black bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #16A34A, #4ade80)' }}
              >
                {stat.value}
              </div>
              <div className="text-[13px] text-white/40 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ───────────────────────────────────────────────────────
function ProblemSection() {
  const pains = [
    {
      emoji: '📅',
      title: 'Esquece clientes',
      desc: 'Sem agenda, você perde visita e o cliente vai embora sem falar nada.',
    },
    {
      emoji: '💰',
      title: 'Não sabe quanto ganhou',
      desc: 'O dinheiro entra pelo PIX, mas some. No fim do mês, zero controle.',
    },
    {
      emoji: '📱',
      title: 'Cobra por mensagem',
      desc: 'Pedir pagamento pelo WhatsApp é constrangedor e parece pouco profissional.',
    },
  ];

  return (
    <section className="bg-[var(--color-problem-bg)] py-20 px-6 text-center">
      <div className="max-w-[860px] mx-auto">
        <div className="inline-block bg-[var(--color-problem-badge-bg)] border border-[var(--color-problem-badge-border)] rounded-lg px-3.5 py-1 text-[13px] font-bold text-[var(--color-problem-badge-text)] mb-5 tracking-wide">
          Você se identifica?
        </div>

        <h2
          className="font-black text-[var(--color-problem-text)] mb-4 tracking-tight"
          style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}
        >
          Ainda gerencia seus clientes <br />
          <span className="text-[var(--color-problem-highlight)]">pelo WhatsApp?</span>
        </h2>

        <p className="text-[var(--color-problem-subtext)] text-[17px] mx-auto mb-14 max-w-[540px] leading-relaxed">
          Jardineiros que não usam um app perdem em média{' '}
          <strong className="text-[var(--color-problem-strong)]">R$3.600 por ano</strong> em serviços
          esquecidos e clientes sem retorno.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {pains.map((p) => (
            <div
              key={p.title}
              className="bg-[var(--color-problem-card)] border border-[var(--color-problem-border)] rounded-2xl py-8 px-6 text-center shadow-[0_4px_16px_rgba(234,179,8,0.08)]"
            >
              <div className="text-[44px] mb-4">{p.emoji}</div>
              <div className="font-extrabold text-lg text-[var(--color-problem-text)] mb-2.5">{p.title}</div>
              <div className="text-[var(--color-problem-subtext)] text-sm leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Arrow / transition */}
        <div className="mt-14 text-sm font-bold text-primary flex items-center justify-center gap-2">
          <span>Existe uma solução mais simples</span>
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      emoji: '📅',
      title: 'Agenda inteligente',
      desc: 'Saiba quem atender hoje e amanhã. Receba lembretes antes de cada visita.',
    },
    {
      emoji: '👥',
      title: 'Clientes organizados',
      desc: 'Histórico completo de cada jardim, observações e frequência de atendimento.',
    },
    {
      emoji: '💰',
      title: 'Cobrança PIX',
      desc: 'Cobre na hora, receba na hora. QR code gerado automaticamente após o serviço.',
    },
    {
      emoji: '📊',
      title: 'Quanto ganhei',
      desc: 'Veja seus ganhos do mês em 1 toque. Relatório simples, sem complicação.',
    },
    {
      emoji: '📄',
      title: 'Orçamentos profissionais',
      desc: 'Monte orçamentos bonitos e envie por WhatsApp em menos de 1 minuto.',
    },
    {
      emoji: '📴',
      title: 'Funciona offline',
      desc: 'Use no jardim, sem internet. Tudo sincroniza quando você conectar o Wi-Fi.',
    },
  ];

  return (
    <section id="funcionalidades" className="bg-primary-light py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary-light-mid border border-primary/20 rounded-lg px-3.5 py-1 text-[13px] font-bold text-primary-dark mb-5">
            Funcionalidades
          </div>
          <h2
            className="font-black text-foreground mb-4 tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Tudo que você precisa,
            <br />
            <span className="text-primary">sem complicação</span>
          </h2>
          <p className="text-muted-foreground text-[17px] max-w-[480px] mx-auto leading-relaxed">
            Desenvolvido pensando em quem trabalha com as mãos na terra e o celular no bolso.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-[20px] py-9 px-7 flex gap-5 items-start shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] shrink-0 ${
                  i % 2 === 0 ? 'bg-primary-light' : 'bg-primary-light-mid'
                }`}
              >
                {f.emoji}
              </div>
              <div>
                <div className="font-extrabold text-[17px] text-card-foreground mb-2 tracking-tight">
                  {f.title}
                </div>
                <div className="text-muted-foreground text-sm leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ───────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: 'Grátis',
      price: 'R$0',
      period: '14 dias',
      sub: 'Sem cartão de crédito',
      features: [
        '✓ Agenda de clientes',
        '✓ Cobrança PIX',
        '✓ Relatório básico',
        '✓ Funciona offline',
        '— Orçamentos ilimitados',
        '— Múltiplos membros',
      ],
      cta: 'Começar grátis',
      ctaHref: '/login',
      highlight: false,
      variant: 'free' as const,
    },
    {
      name: 'Solo',
      price: 'R$39',
      period: '/mês',
      sub: 'Ou R$390/ano (2 meses grátis)',
      features: [
        '✓ Tudo do Grátis',
        '✓ Orçamentos ilimitados',
        '✓ Relatório completo',
        '✓ Exportar para PDF',
        '✓ Suporte prioritário',
        '— Múltiplos membros',
      ],
      cta: 'Assinar Solo',
      ctaHref: '/login',
      highlight: true,
      variant: 'solo' as const,
    },
    {
      name: 'Equipe',
      price: 'R$99',
      period: '/mês',
      sub: 'Até 5 membros da equipe',
      features: [
        '✓ Tudo do Solo',
        '✓ Até 5 membros',
        '✓ Dashboard da equipe',
        '✓ Controle de rotas',
        '✓ Relatório por membro',
        '✓ Integração WhatsApp',
      ],
      cta: 'Assinar Equipe',
      ctaHref: '/login',
      highlight: false,
      variant: 'team' as const,
    },
  ];

  return (
    <section id="precos" className="bg-background py-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary-light-mid border border-primary/20 rounded-lg px-3.5 py-1 text-[13px] font-bold text-primary-dark mb-5">
            Preços
          </div>
          <h2
            className="font-black text-foreground mb-4 tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Simples. Justo. Sem pegadinha.
          </h2>
          <p className="text-muted-foreground text-[17px] max-w-[440px] mx-auto leading-relaxed">
            Comece grátis por 14 dias. Cancele quando quiser, sem burocracia.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-10 flex flex-col relative ${
                plan.variant === 'solo'
                  ? 'bg-primary text-white border-2 border-primary shadow-[0_20px_60px_rgba(22,163,74,0.25)] scale-[1.04]'
                  : 'bg-card text-card-foreground border-2 border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber text-[#7C2D12] text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap tracking-wide uppercase">
                  Mais popular
                </div>
              )}

              <div className="mb-2 text-[15px] font-bold opacity-80">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[44px] font-black tracking-[-2px]">{plan.price}</span>
                <span className="text-base opacity-75">{plan.period}</span>
              </div>
              <div className="text-[13px] opacity-65 mb-8">{plan.sub}</div>

              <div className="flex-1 flex flex-col gap-3 mb-8">
                {plan.features.map((feat) => (
                  <div
                    key={feat}
                    className={`text-sm ${
                      feat.startsWith('—') ? 'opacity-40 font-normal' : 'opacity-100 font-medium'
                    }`}
                  >
                    {feat}
                  </div>
                ))}
              </div>

              <a
                href={plan.ctaHref}
                className={`block text-center py-3.5 rounded-xl no-underline font-extrabold text-[15px] ${
                  plan.variant === 'solo'
                    ? 'bg-white text-primary'
                    : plan.variant === 'team'
                      ? 'bg-primary-dark text-white'
                      : 'bg-primary-light text-primary-dark border border-border'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof / Testimonials ───────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Carlos Mendonça',
      role: 'Jardineiro autônomo — São Paulo, SP',
      avatar: '👨‍🌾',
      text: 'Antes eu perdia umas 3 visitas por mês por esquecimento. Hoje a agenda me avisa no dia. Já paguei o plano só nisso.',
    },
    {
      name: 'Ana Paula Ferreira',
      role: 'Proprietária — JardimBelo, Curitiba, PR',
      avatar: '👩‍🌾',
      text: 'O PIX direto do app é o que meus clientes mais gostam. Eles pagam na hora, eu não preciso ficar cobrando.',
    },
    {
      name: 'João Batista',
      role: 'Equipe de 3 jardineiros — Belo Horizonte, MG',
      avatar: '🧑‍🌾',
      text: 'Eu e meus dois parceiros usamos o plano Equipe. Cada um vê sua agenda, eu vejo o total. Simples demais.',
    },
  ];

  return (
    <section
      id="depoimentos"
      className="bg-linear-to-b from-[#14532D] to-[#166534] py-24 px-6 text-white"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-white/[0.12] border border-white/20 rounded-lg px-3.5 py-1 text-[13px] font-bold mb-5">
            Depoimentos
          </div>
          <h2
            className="font-black mb-4 tracking-tight"
            style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}
          >
            Feito para quem trabalha
            <br />
            <span className="text-amber">no sol, com luvas, com pressa</span>
          </h2>
          <p className="opacity-70 text-[17px] max-w-[480px] mx-auto leading-relaxed">
            Jardineiros reais, resultados reais. Sem enrolação.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.08] border border-white/[0.12] rounded-[20px] py-8 px-7 backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="mb-5 text-amber text-lg tracking-widest">★★★★★</div>

              <p className="text-[15px] leading-relaxed opacity-[0.88] mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-[22px] shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-[15px]">{t.name}</div>
                  <div className="opacity-60 text-[13px]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-12 border-t border-white/[0.12] flex justify-center gap-12 flex-wrap">
          {[
            { emoji: '🔒', label: 'Dados protegidos', sub: 'LGPD compliant' },
            { emoji: '🇧🇷', label: 'Servidor no Brasil', sub: 'Baixa latência' },
            { emoji: '💳', label: 'Sem cartão', sub: 'Pra começar' },
          ].map((badge) => (
            <div key={badge.label} className="text-center opacity-75">
              <div className="text-[28px] mb-1.5">{badge.emoji}</div>
              <div className="font-bold text-[13px]">{badge.label}</div>
              <div className="text-xs opacity-70">{badge.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="bg-primary-light py-24 px-6 text-center">
      <div className="max-w-[640px] mx-auto">
        <div className="text-[56px] mb-6">🌱</div>
        <h2
          className="font-black text-foreground mb-4 tracking-tight"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
        >
          Pronto pra organizar
          <br />
          seus jardins?
        </h2>
        <p className="text-muted-foreground text-[17px] mb-10 leading-relaxed">
          14 dias grátis. Sem cartão. Cancele quando quiser. <br />
          Comece agora e veja a diferença na próxima semana.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/login"
            className="bg-primary text-white px-9 py-4 rounded-[14px] no-underline font-extrabold text-[17px] tracking-tight shadow-[0_8px_32px_rgba(22,163,74,0.33)]"
          >
            Começar grátis agora
          </a>
          <a
            href="/login"
            className="bg-card text-primary-dark px-9 py-4 rounded-[14px] no-underline font-extrabold text-[17px] border border-border"
          >
            Já tenho conta
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#14532D] text-white/65 pt-12 pb-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-between items-start flex-wrap gap-8 mb-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌱</span>
              <span className="font-extrabold text-lg text-white">GardenGreen</span>
            </div>
            <div className="text-sm leading-relaxed max-w-[220px]">
              O app que organiza a vida do jardineiro brasileiro.
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-12 flex-wrap">
            <div>
              <div className="font-bold text-white text-[13px] mb-4 uppercase tracking-wide">
                Produto
              </div>
              {[
                { label: 'Funcionalidades', href: '#funcionalidades' },
                { label: 'Preços', href: '#precos' },
                { label: 'Atualizações', href: '#' },
                { label: 'Roadmap', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-white/55 no-underline text-sm mb-2.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div>
              <div className="font-bold text-white text-[13px] mb-4 uppercase tracking-wide">
                Legal
              </div>
              {[
                { label: 'Sobre nós', href: '#' },
                { label: 'Privacidade', href: '#' },
                { label: 'Termos de uso', href: '#' },
                { label: 'Contato', href: 'mailto:contato@gardengreen.com.br' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-white/55 no-underline text-sm mb-2.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3 text-[13px]">
          <div>© 2025 GardenGreen. Todos os direitos reservados.</div>
          <div>Feito com 🌱 para jardineiros brasileiros</div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
