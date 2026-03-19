// ─── Shared style tokens ───────────────────────────────────────────────────
const colors = {
  primary: '#16A34A',
  dark: '#166534',
  darker: '#14532D',
  light: '#F0FDF4',
  lightMid: '#DCFCE7',
  amber: '#F59E0B',
  amberDark: '#D97706',
  text: '#1C1917',
  textMuted: '#57534E',
  textLight: '#A8A29E',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  border: '#E7E5E4',
};

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.border}`,
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌱</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: colors.dark,
              letterSpacing: '-0.5px',
            }}
          >
            GardenGreen
          </span>
        </div>

        {/* Links desktop */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
        >
          {['Funcionalidades', 'Preços', 'Depoimentos'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: colors.textMuted,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            style={{
              color: colors.dark,
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Entrar
          </a>
          <a
            href="/login"
            style={{
              background: colors.primary,
              color: colors.white,
              padding: '10px 20px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.2px',
            }}
          >
            Começar grátis
          </a>
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
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.darker} 100%)`,
        color: colors.white,
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          <span>🌱</span>
          <span>Feito para o jardineiro brasileiro</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 900,
            lineHeight: 1.08,
            margin: '0 0 24px',
            letterSpacing: '-2px',
          }}
        >
          O app do
          <br />
          <span style={{ color: colors.amber }}>jardineiro</span> brasileiro
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            opacity: 0.88,
            lineHeight: 1.6,
            margin: '0 auto 48px',
            maxWidth: 580,
            fontWeight: 400,
          }}
        >
          Agenda, clientes, orçamentos e cobrança PIX —<br />
          tudo no celular, em <strong style={{ color: colors.amber }}>3 toques</strong>
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 64,
          }}
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#1B1B1B',
              color: colors.white,
              padding: '14px 24px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 15,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: 24 }}>▶</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Disponível no
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Google Play</div>
            </div>
          </a>
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#1B1B1B',
              color: colors.white,
              padding: '14px 24px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 15,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: 24 }}>🍎</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Baixe na
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>App Store</div>
            </div>
          </a>
        </div>

        {/* Phone Mockup */}
        <div
          style={{
            margin: '0 auto',
            width: 220,
            height: 420,
            border: '3px solid rgba(255,255,255,0.35)',
            borderRadius: 36,
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            backdropFilter: 'blur(4px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 6,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.3)',
            }}
          />
          <span style={{ fontSize: 48 }}>🌿</span>
          <div style={{ textAlign: 'center', opacity: 0.7, fontSize: 13, padding: '0 20px' }}>
            App screenshot
            <br />
            (em breve)
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 64,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {[
            { value: '14 dias', label: 'grátis pra testar' },
            { value: '3 toques', label: 'pra cobrar no PIX' },
            { value: '100%', label: 'offline no jardim' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: colors.amber }}>{stat.value}</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{stat.label}</div>
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
    <section
      style={{
        background: '#FEF9C3',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#FEF08A',
            border: '1px solid #EAB308',
            borderRadius: 8,
            padding: '4px 14px',
            fontSize: 13,
            fontWeight: 700,
            color: '#713F12',
            marginBottom: 20,
            letterSpacing: '0.3px',
          }}
        >
          Você se identifica?
        </div>

        <h2
          style={{
            fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 900,
            color: colors.text,
            margin: '0 0 16px',
            letterSpacing: '-1px',
          }}
        >
          Ainda gerencia seus clientes <br />
          <span style={{ color: '#CA8A04' }}>pelo WhatsApp?</span>
        </h2>

        <p
          style={{
            color: colors.textMuted,
            fontSize: 17,
            margin: '0 auto 56px',
            maxWidth: 540,
            lineHeight: 1.6,
          }}
        >
          Jardineiros que não usam um app perdem em média <strong style={{ color: '#B45309' }}>R$3.600 por ano</strong>{' '}
          em serviços esquecidos e clientes sem retorno.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {pains.map((p) => (
            <div
              key={p.title}
              style={{
                background: colors.white,
                border: '1px solid #FDE68A',
                borderRadius: 16,
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(234,179,8,0.08)',
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>{p.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: colors.text, marginBottom: 10 }}>{p.title}</div>
              <div style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Arrow / transition */}
        <div
          style={{
            marginTop: 56,
            fontSize: 14,
            fontWeight: 700,
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>Existe uma solução mais simples</span>
          <span style={{ fontSize: 20 }}>↓</span>
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
    <section
      id="funcionalidades"
      style={{
        background: colors.light,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-block',
              background: colors.lightMid,
              border: `1px solid ${colors.primary}33`,
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: colors.dark,
              marginBottom: 20,
            }}
          >
            Funcionalidades
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 900,
              color: colors.text,
              margin: '0 0 16px',
              letterSpacing: '-1px',
            }}
          >
            Tudo que você precisa,
            <br />
            <span style={{ color: colors.primary }}>sem complicação</span>
          </h2>
          <p
            style={{
              color: colors.textMuted,
              fontSize: 17,
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Desenvolvido pensando em quem trabalha com as mãos na terra e o celular no bolso.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: '36px 28px',
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: i % 2 === 0 ? colors.light : colors.lightMid,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {f.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 17,
                    color: colors.text,
                    marginBottom: 8,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {f.title}
                </div>
                <div style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.65 }}>{f.desc}</div>
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
      color: colors.textMuted,
      bg: colors.white,
      border: colors.border,
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
      ctaBg: colors.light,
      ctaColor: colors.dark,
      highlight: false,
    },
    {
      name: 'Solo',
      price: 'R$39',
      period: '/mês',
      sub: 'Ou R$390/ano (2 meses grátis)',
      color: colors.white,
      bg: colors.primary,
      border: colors.primary,
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
      ctaBg: colors.white,
      ctaColor: colors.primary,
      highlight: true,
    },
    {
      name: 'Equipe',
      price: 'R$99',
      period: '/mês',
      sub: 'Até 5 membros da equipe',
      color: colors.text,
      bg: colors.white,
      border: colors.border,
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
      ctaBg: colors.dark,
      ctaColor: colors.white,
      highlight: false,
    },
  ];

  return (
    <section
      id="precos"
      style={{
        background: colors.white,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-block',
              background: colors.lightMid,
              border: `1px solid ${colors.primary}33`,
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: colors.dark,
              marginBottom: 20,
            }}
          >
            Preços
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 900,
              color: colors.text,
              margin: '0 0 16px',
              letterSpacing: '-1px',
            }}
          >
            Simples. Justo. Sem pegadinha.
          </h2>
          <p style={{ color: colors.textMuted, fontSize: 17, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Comece grátis por 14 dias. Cancele quando quiser, sem burocracia.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.bg,
                border: `2px solid ${plan.border}`,
                borderRadius: 24,
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                color: plan.color,
                boxShadow: plan.highlight ? '0 20px 60px rgba(22,163,74,0.25)' : '0 2px 12px rgba(0,0,0,0.04)',
                transform: plan.highlight ? 'scale(1.04)' : 'scale(1)',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: colors.amber,
                    color: '#7C2D12',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '4px 16px',
                    borderRadius: 100,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Mais popular
                </div>
              )}

              <div style={{ marginBottom: 8, fontSize: 15, fontWeight: 700, opacity: 0.8 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px' }}>{plan.price}</span>
                <span style={{ fontSize: 16, opacity: 0.75 }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.65, marginBottom: 32 }}>{plan.sub}</div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map((feat) => (
                  <div
                    key={feat}
                    style={{
                      fontSize: 14,
                      opacity: feat.startsWith('—') ? 0.4 : 1,
                      fontWeight: feat.startsWith('✓') ? 500 : 400,
                    }}
                  >
                    {feat}
                  </div>
                ))}
              </div>

              <a
                href={plan.ctaHref}
                style={{
                  display: 'block',
                  background: plan.ctaBg,
                  color: plan.ctaColor,
                  textAlign: 'center',
                  padding: '14px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 15,
                  border: plan.highlight ? 'none' : `1px solid ${colors.border}`,
                }}
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
      style={{
        background: `linear-gradient(180deg, ${colors.darker} 0%, ${colors.dark} 100%)`,
        padding: '100px 24px',
        color: colors.white,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Depoimentos
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 900,
              margin: '0 0 16px',
              letterSpacing: '-1px',
            }}
          >
            Feito para quem trabalha
            <br />
            <span style={{ color: colors.amber }}>no sol, com luvas, com pressa</span>
          </h2>
          <p style={{ opacity: 0.7, fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Jardineiros reais, resultados reais. Sem enrolação.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: '32px 28px',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: 20, color: colors.amber, fontSize: 18, letterSpacing: 2 }}>★★★★★</div>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  opacity: 0.88,
                  margin: '0 0 24px',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ opacity: 0.6, fontSize: 13 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 48,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          {[
            { emoji: '🔒', label: 'Dados protegidos', sub: 'LGPD compliant' },
            { emoji: '🇧🇷', label: 'Servidor no Brasil', sub: 'Baixa latência' },
            { emoji: '💳', label: 'Sem cartão', sub: 'Pra começar' },
          ].map((badge) => (
            <div key={badge.label} style={{ textAlign: 'center', opacity: 0.75 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{badge.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{badge.sub}</div>
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
    <section
      style={{
        background: colors.light,
        padding: '100px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🌱</div>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 900,
            color: colors.text,
            margin: '0 0 16px',
            letterSpacing: '-1px',
          }}
        >
          Pronto pra organizar
          <br />
          seus jardins?
        </h2>
        <p style={{ color: colors.textMuted, fontSize: 17, margin: '0 0 40px', lineHeight: 1.6 }}>
          14 dias grátis. Sem cartão. Cancele quando quiser. <br />
          Comece agora e veja a diferença na próxima semana.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/login"
            style={{
              background: colors.primary,
              color: colors.white,
              padding: '16px 36px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '-0.3px',
              boxShadow: `0 8px 32px ${colors.primary}55`,
            }}
          >
            Começar grátis agora
          </a>
          <a
            href="/login"
            style={{
              background: colors.white,
              color: colors.dark,
              padding: '16px 36px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: 17,
              border: `1px solid ${colors.border}`,
            }}
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
    <footer
      style={{
        background: colors.darker,
        color: 'rgba(255,255,255,0.65)',
        padding: '48px 24px 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 32,
            marginBottom: 40,
            paddingBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🌱</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: colors.white }}>GardenGreen</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 220 }}>
              O app que organiza a vida do jardineiro brasileiro.
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, color: colors.white, fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Produto
              </div>
              {['Funcionalidades', 'Preços', 'Atualizações', 'Roadmap'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: colors.white, fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Legal
              </div>
              {['Sobre nós', 'Privacidade', 'Termos de uso', 'Contato'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
          }}
        >
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
