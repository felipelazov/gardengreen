# Project Brief: GardenGreen

**Preparado por:** Atlas (Analyst Agent)
**Data:** 2026-03-17
**Versao:** 1.0
**Status:** Pronto para handoff → @pm (PRD)

---

## 1. Executive Summary

**GardenGreen** e uma plataforma SaaS mobile-first de gestao completa para jardineiros profissionais brasileiros. O produto resolve o caos operacional do jardineiro autonomo — que hoje gerencia clientes, agenda, orcamentos e financas por WhatsApp e caderninho — com uma ferramenta tao simples que ele adota no primeiro dia.

**Problema:** Jardineiros brasileiros (~285.000 profissionais) nao tem nenhuma ferramenta digital verticalizada. Perdem clientes por esquecimento, nao sabem quanto ganham, cobram errado, e nao conseguem crescer.

**Mercado:** R$ 40M SAM, zero concorrentes diretos no Brasil.

**Proposta de valor:** O app do jardineiro brasileiro — agenda, clientes, orcamentos, cobranca por PIX, tudo no celular, em 3 toques.

---

## 2. Problem Statement

### Estado Atual

O jardineiro autonomo brasileiro opera em modo **100% informal e manual**:

| Atividade | Como faz hoje | Problema |
|---|---|---|
| Agenda | Caderninho ou memoria | Esquece clientes, conflitos de horario |
| Clientes | Contatos do WhatsApp | Sem historico de servico, perde dados |
| Orcamentos | Mensagem de texto ou verbal | Sem registro, sem padrao, sem follow-up |
| Cobranca | "Depois a gente acerta" ou PIX manual | Inadimplencia, esquece de cobrar |
| Financas | Nenhum controle | Nao sabe se mes fechou no lucro ou prejuizo |
| Marketing | Boca-a-boca passivo | Cresce devagar, depende de sorte |

### Impacto Quantificado

- **Perda de receita por esquecimento:** Jardineiro com 25 clientes que esquece 2 visitas/mes a R$150 = **R$300/mes perdidos** = R$3.600/ano
- **Inadimplencia por cobranca informal:** Estimativa 10-15% de servicos nao cobrados
- **Tempo desperdicado:** ~3-5h/semana em gestao manual (agenda, mensagens, calculos)
- **Oportunidade perdida:** Sem relatorio de ganhos, nao percebe que pode cobrar mais ou atender mais clientes

### Por que Solucoes Existentes Nao Servem

| Solucao | Por que falha |
|---|---|
| **Jobber** (lider global) | ~R$200/mes em dolar, sem PIX, sem PT-BR, sem NFS-e |
| **Housecall Pro** | ~R$350/mes, sem mercado BR |
| **GestaoClick** (BR) | Feito para loja, nao para servico de campo |
| **MeuJardim** (BR) | Feito para consumidor, nao para profissional |
| **Planilha/Excel** | Complexo, nao mobile, sem notificacoes |
| **WhatsApp** | Sem estrutura, conversas se perdem, sem relatorios |

### Urgencia

- **3,87M novos MEIs** abertos em 2025 (+18.7%) — profissionais se formalizando
- **48% das empresas** planejam digitalizar (Sebrae)
- Mercado de FSM SaaS cresce **12-16% a.a.** globalmente
- Tendencia de **verticalizacao SaaS** favorece solucoes nichadas
- Janela de oportunidade: **primeiro a verticalizar para jardinagem no BR ganha o mercado**

---

## 3. Proposed Solution

### Conceito Core

App mobile (Android + iOS) que organiza a vida profissional do jardineiro em **3 toques**:
1. **Agenda** — Sabe quem atender hoje, amanha, na semana
2. **Clientes** — Historico completo de cada jardim
3. **Dinheiro** — Quanto cobrar, quanto recebeu, quanto ganhou no mes

### Diferenciais vs Concorrencia

| Diferencial | Detalhe |
|---|---|
| **Unico brasileiro** | PT-BR nativo, PIX, NFS-e, MEI, sazonalidade BR |
| **4-5x mais barato** | R$39/mes vs ~R$200/mes (Jobber em dolar) |
| **Ultra-simples** | Feito para quem usa WhatsApp, nao para quem usa ERP |
| **Mobile-first + offline** | Funciona no jardim sem Wi-Fi |
| **PIX integrado** | Cobra cliente direto do app — nenhum FSM global tem isso |
| **Comunidade** | Rede de jardineiros para indicacoes e conhecimento |

### Por que Vai Funcionar

1. **Dor real e comprovada** — todo jardineiro perde dinheiro por desorganizacao
2. **Zero concorrencia local** — espaco completamente vazio no BR
3. **Modelo validado globalmente** — Jobber ($39/mes, 250K+ users) prova que o modelo funciona
4. **Barreira cultural baixa** — interface simples como WhatsApp, que eles ja usam
5. **Flywheel de upgrade** — jardineiro solo cresce → contrata ajudante → precisa plano Equipe

---

## 4. Target Users

### 4.1 Segmento Primario: Jardineiro Solo ("Seu Joao")

| Atributo | Detalhe |
|---|---|
| **Perfil** | Homem, 30-55 anos, ensino medio, autonomo |
| **Renda** | R$ 3.000-6.000/mes |
| **Clientes** | 15-30 fixos (visitas recorrentes semanais/quinzenais) |
| **Servicos** | Manutencao, poda, plantio, limpeza, paisagismo basico |
| **Celular** | Android medio (Samsung Galaxy A, Motorola G) |
| **Literacia digital** | Baixa — WhatsApp, YouTube, Instagram |
| **Rotina** | 05:30-18:00, 5-6 dias/semana, 3-5 clientes/dia |
| **Dores principais** | Esquece clientes, nao sabe quanto ganha, cobra errado, nao consegue crescer |
| **Motivacao** | "Quero parar de perder dinheiro e ter controle" |
| **Canais** | WhatsApp (grupos de jardineiros), indicacao, Instagram, loja de insumos |
| **Disposicao para pagar** | R$ 29-49/mes SE perceber valor em <7 dias |
| **Tamanho estimado** | ~200.000+ no Brasil (formais + informais) |

### 4.2 Segmento Secundario: Gestora de Empresa ("Dona Maria")

| Atributo | Detalhe |
|---|---|
| **Perfil** | 35-50 anos, dono(a) de empresa de jardinagem |
| **Renda empresa** | R$ 15.000-50.000/mes |
| **Equipe** | 3-15 jardineiros |
| **Clientes** | 50-150 contratos |
| **Dores** | Dispatch manual, nao sabe onde cada jardineiro esta, retrabalho |
| **Motivacao** | "Preciso organizar minha equipe e crescer sem caos" |
| **Disposicao para pagar** | R$ 99-199/mes |
| **Tamanho estimado** | ~12.750 empresas formais (CNAE 8130) |

---

## 5. Goals & Success Metrics

### 5.1 Business Objectives

- **Lancamento MVP** em 12-16 semanas (app mobile + backend funcional)
- **100 jardineiros ativos** nos primeiros 3 meses pos-lancamento
- **MRR R$ 5.000** em 6 meses (128 usuarios Solo a R$39)
- **MRR R$ 50.000** em 12 meses (mix Solo + Equipe)
- **Churn < 5%/mes** apos primeiros 6 meses

### 5.2 User Success Metrics

- **Time to First Value:** < 5 minutos (primeiro cliente cadastrado + primeiro servico agendado)
- **Onboarding Completion:** > 80% completam onboarding
- **Day 7 Retention:** > 60%
- **Day 30 Retention:** > 40%
- **Activation:** > 50% adicionam 3+ clientes na primeira semana
- **Aha Moment:** Primeiro relatorio mensal de ganhos visualizado

### 5.3 KPIs

| KPI | Target 6 meses | Target 12 meses |
|---|---|---|
| MRR | R$ 5.000 | R$ 50.000 |
| Jardineiros ativos | 200 | 1.000 |
| Trial → Paid conversion | > 8% | > 12% |
| Churn mensal | < 7% | < 5% |
| NPS | > 40 | > 50 |
| CAC | < R$ 50 | < R$ 30 |
| LTV/CAC | > 2x | > 3x |

---

## 6. MVP Scope

### 6.1 Core Features (Must Have)

| # | Modulo | Features | Justificativa |
|---|---|---|---|
| 1 | **Agenda** | Agendar servicos, ver dia/semana, servicos recorrentes (toda terca no Sr. Joao), notificacao "amanha: 3 clientes" | Core do produto — resolve esquecimento |
| 2 | **Clientes** | Cadastro simples (nome + telefone + endereco), historico de servicos, fotos do jardim (antes/depois), notas | CRM minimo — base para tudo |
| 3 | **Orcamentos** | Criar orcamento rapido (servico + preco), enviar por WhatsApp, converter em servico | Profissionaliza a venda |
| 4 | **Cobranca** | Gerar link PIX, marcar como pago, lembrete de cobranca | Killer feature — ninguem tem PIX em FSM |
| 5 | **Financeiro** | "Quanto ganhei esse mes", receitas vs despesas simples, relatorio mensal | Aha Moment — retencao |
| 6 | **Onboarding** | Login com Google/telefone, 2 min ate primeiro cliente, zero config | Conversao — se nao funcionar aqui, perde o usuario |
| 7 | **Notificacoes** | Push matinal "seus clientes de hoje", lembrete de cobranca, relatorio mensal | Habito — faz o jardineiro voltar todo dia |

### 6.2 Out of Scope (MVP)

| Feature | Quando | Motivo |
|---|---|---|
| Gestao de equipe / dispatch | Wave 1 (basico) | Solo-first, equipe e upgrade |
| Otimizacao de rotas / GPS | Wave 2 | Jardineiro solo ja sabe suas rotas |
| Portal do cliente | Wave 2 | WhatsApp supre no inicio |
| Web dashboard | Wave 2 | Mobile-first, web e para gestor |
| NFS-e / integracao MEI | Wave 2 | Importante mas nao bloqueante para MVP |
| Marketplace (conectar jardineiro a cliente) | Wave 3 | Modelo diferente, valida SaaS primeiro |
| IA (pricing, rotas, previsao) | Wave 3 | Prematuridade — precisa de dados primeiro |
| Marketing automation | Wave 3 | Referral organico primeiro |

### 6.3 MVP Success Criteria

O MVP e bem-sucedido quando:
- [ ] 100 jardineiros se cadastram organicamente (sem ads pagos)
- [ ] 50 completam onboarding em < 2 minutos
- [ ] 30 usam ativamente por 30+ dias
- [ ] 10 convertem para plano pago apos trial
- [ ] NPS > 40 nos primeiros usuarios
- [ ] Zero jardineiro precisa de suporte para completar onboarding

---

## 7. Post-MVP Vision

### 7.1 Wave 2 — Amplificar (mes 4-8)

| Feature | Modulo | Impacto |
|---|---|---|
| Gestao de equipe completa | Produto | Habilita plano Equipe (R$99-199) |
| Otimizacao de rotas | Produto | Economia de tempo e combustivel |
| Portal do cliente | Produto | Profissionaliza relacao |
| NFS-e / MEI | Financeiro | Compliance fiscal |
| Web dashboard | Produto | Visao gerencial para empresas |
| Programa de referral | Marketing | "Indique amigo, ganhe 1 mes" |
| Comunidade de jardineiros | Sucesso | Rede de conhecimento e indicacoes |

### 7.2 Wave 3 — Escalar (mes 9-18)

| Feature | Modulo | Impacto |
|---|---|---|
| WhatsApp Business API | Integracoes | Lembrete automatico para clientes |
| Google Calendar sync | Integracoes | Sincronizacao bidirecional |
| Weather API | Integracoes | Reagendamento por chuva automatico |
| BI / Analytics | Dados | Decisoes baseadas em dados |
| AI pricing suggestions | Produto | Precificacao inteligente |
| Open API | Plataforma | Ecossistema de integracoes |

### 7.3 Long-term Vision (18+ meses)

- **Plataforma para servicos de campo no Brasil** — expandir de jardinagem para piscineiro, faxineira, eletricista, encanador
- **Marketplace opcional** — conectar clientes finais a jardineiros (modelo iFood/GetNinjas para jardins)
- **Fintech embutida** — antecipacao de recebiveis, capital de giro para jardineiros
- **GardenGreen Business** — plano enterprise para landscaping companies com 20+ funcionarios

---

## 8. Technical Considerations

### 8.1 Platform Requirements

| Plataforma | Requisito |
|---|---|
| **Mobile (primario)** | Android 8+ (90% do publico), iOS 15+ |
| **Web (secundario)** | Chrome, Safari, Firefox modernos |
| **Offline** | Obrigatorio — jardineiro trabalha sem Wi-Fi |
| **Performance** | App < 30MB, carrega < 2s em 4G, funciona em 2GB RAM |
| **Minimo device** | Samsung Galaxy A10 / Motorola G8 (Android Go compatible) |

### 8.2 Technology Stack (definida pelo squad-produto-core)

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Mobile** | React Native / Expo | Cross-platform, ecossistema maduro, OTA updates |
| **Web** | Next.js 14+ (App Router) | SSR, performance, DX |
| **Backend** | Supabase | PostgreSQL + Auth + Storage + Edge Functions + Realtime |
| **Offline** | WatermelonDB | Local-first, sync protocol com Supabase |
| **State** | Zustand + React Query | Leve, performatico, cache inteligente |
| **UI Mobile** | NativeWind (Tailwind RN) | Consistencia com web |
| **UI Web** | Tailwind + shadcn/ui | Componentes acessiveis, customizaveis |
| **Monorepo** | Turborepo | Compartilhar logica mobile/web |
| **Analytics** | PostHog | Product analytics, feature flags, funnels |
| **Payments** | Stripe + PIX gateway BR | Subscription + pagamento de servicos |
| **Push** | Expo Push Notifications | Integrado com Expo |
| **CI/CD** | GitHub Actions + Vercel + EAS | Automated builds e deploys |

### 8.3 Architecture Considerations

| Aspecto | Decisao |
|---|---|
| **Repo** | Monorepo (Turborepo) — packages: mobile, web, shared |
| **Arquitetura** | Client-heavy com Supabase como BaaS. Edge Functions para logica server-side |
| **Auth** | Magic link + Google OAuth (jardineiro nao lembra senha) |
| **Storage** | Supabase Storage (fotos de jardins, max 5MB/foto) |
| **Realtime** | Supabase Realtime para sync entre devices |
| **Security** | RLS policies por tenant, encryption at rest, HTTPS only |
| **Compliance** | LGPD (dados pessoais de clientes do jardineiro) |

---

## 9. Constraints & Assumptions

### 9.1 Constraints

| Tipo | Detalhe |
|---|---|
| **Budget** | Nao definido — assumindo bootstrapped/lean |
| **Timeline** | MVP em 12-16 semanas (estimativa) |
| **Equipe** | Nao definida — desenvolvimento assistido por IA (squads AIOX) |
| **Tecnico** | Supabase free tier ate 500MB database, 1GB storage |
| **Regulatorio** | LGPD, regulamentacao PIX (BCB), NFS-e municipal |

### 9.2 Key Assumptions

- Jardineiro autonomo brasileiro adotara ferramenta digital SE for extremamente simples (< 2 min onboarding)
- R$ 29-49/mes e um preco acessivel para jardineiro que ganha R$ 3.000-6.000
- PIX integrado e diferencial suficiente para superar resistencia a adocao
- Boca-a-boca entre jardineiros e canal de aquisicao viavel (CAC < R$ 50)
- Relatorio mensal de ganhos ("Voce ganhou R$X") e o Aha Moment que retém
- Jardineiros que crescem naturalmente fazem upgrade para plano Equipe
- Supabase escala para os primeiros 10.000 usuarios sem migracao de infra
- React Native / Expo funciona bem em devices Android basicos (2GB RAM)

---

## 10. Risks & Open Questions

### 10.1 Key Risks

| Risco | Prob. | Impacto | Mitigacao |
|---|---|---|---|
| Jardineiro nao adota tecnologia | Media | Alto | UX ultra-simples, onboarding 2min, beta com 10 jardineiros reais antes de lancar |
| Churn alto (volta pro WhatsApp) | Alta | Alto | Habito via push util + relatorio de valor mensal |
| CAC maior que esperado | Media | Medio | Referral como canal #1, conteudo organico |
| Jobber entra no Brasil | Baixa | Alto | First-mover, PIX/NFS-e como moat, comunidade |
| Supabase free tier insuficiente | Baixa | Medio | Migrar para Pro ($25/mes) quando necessario |
| Offline sync bugado | Media | Alto | Investir em testes de sync, WatermelonDB e maduro |

### 10.2 Open Questions

1. **Validacao de persona:** Precisamos entrevistar 5-10 jardineiros reais antes do MVP?
2. **Pricing ideal:** R$ 29, R$ 39, ou R$ 49/mes? Precisa de teste A/B?
3. **Free tier permanente ou so trial?** CrewNest tem free tier, Jobber nao. Qual modelo?
4. **Android-only no MVP?** 90%+ do publico e Android. Vale investir em iOS no dia 1?
5. **PIX gateway:** Qual gateway brasileiro usar? Asaas? Stripe BR? Pagar.me?
6. **NFS-e no MVP?** Complexidade municipal e alta. Adiar para Wave 2?
7. **Comunidade no app ou WhatsApp?** Feature no app ou grupo de WhatsApp gerenciado?

### 10.3 Areas Needing Further Research

- Entrevistas com jardineiros reais (validar dores e disposicao para pagar)
- Benchmark de onboarding com publico low-tech (teste de usabilidade)
- Viabilidade tecnica de PIX integrado (gateway, custos, regulamentacao)
- Custo real de infraestrutura para 1.000-10.000 usuarios
- Mapeamento de associacoes/cooperativas de jardineiros por estado

---

## Appendices

### A. Research Summary

| Documento | Local | Conteudo |
|---|---|---|
| Market Research | `docs/research/market-research.md` | TAM/SAM/SOM, mercado BR, tendencias, personas |
| Competitor Analysis | `docs/research/competitor-analysis.md` | 8 concorrentes, feature matrix, SWOT, pricing |
| Ecosystem Architecture | `squads/ecosystem.yaml` | 5 squads, handoffs, KPIs, roadmap |
| Tech Stack | `squads/squad-produto-core/config/tech-stack.md` | Stack tecnica completa |
| Pricing Tiers | `squads/squad-vendas-conversao/config/pricing-tiers.md` | Modelo de pricing |

### B. Council Session Summary

Sessao de conselho estrategico executada em 2026-03-17 com 3 especialistas:
- **@oalanicolas** — 6 competencias core mapeadas, experts por nicho identificados
- **@pedro-valerio** — cadeia de valor ATRAIR→ESCALAR com 5 elos e handoffs
- **@thiago-finch** — classificacao de receita (GERA/PROTEGE/AMPLIFICA/SUSTENTA), MVP definido

Resultado: 5 squads criados, stress test PASS (zero RED, 5 YELLOW), roadmap em 3 waves aprovado.

### C. References

- [Mordor Intelligence — Landscaping Market](https://www.mordorintelligence.com/pt/industry-reports/landscaping-and-gardening-service-market)
- [Sebrae — Jardinagem como Negocio](https://sebrae.com.br/sites/PortalSebrae/artigos/jardinagem-um-negocio-promissor-para-microempreendedores,d99f3332dfce7810VgnVCM1000001b00320aRCRD)
- [Econodata — CNAE 8130](https://www.econodata.com.br/consulta-cnae/n8130300-atividades-paisagisticas)
- [Jobber](https://www.getjobber.com/)
- [Housecall Pro](https://www.housecallpro.com/)
- [CrewNest](https://www.crewnest.app/)
- [Grand View Research — FSM Market](https://www.grandviewresearch.com/industry-analysis/field-service-management-market)
- [Leadster — Mercado SaaS BR](https://leadster.com.br/blog/mercado-saas/)
- [Sebrae — Tendencias Pequenos Negocios 2025](https://sebrae.com.br/sites/PortalSebrae/ufs/ms/programas/5-tendencias-de-mercado-para-pequenos-negocios-em-2025)

---

## Next Steps

### Immediate Actions

1. **Handoff para @pm** — criar PRD formal baseado neste brief
2. **Validacao de persona** — entrevistar 5-10 jardineiros reais (opcional mas recomendado)
3. **Decisao de pricing** — definir R$ 29 vs 39 vs 49/mes
4. **Escolha de PIX gateway** — pesquisar Asaas, Stripe BR, Pagar.me
5. **Setup do repositorio** — monorepo com Turborepo, apps mobile + web + packages shared

### PM Handoff

Este Project Brief fornece o contexto completo para o **GardenGreen**. O @pm deve iniciar em 'PRD Generation Mode', revisando este brief e os documentos de pesquisa referenciados para criar o PRD secao por secao.

**Input documents:**
- `docs/brief.md` (este documento)
- `docs/research/market-research.md`
- `docs/research/competitor-analysis.md`
- `squads/ecosystem.yaml`

---

*Project Brief — Atlas (Analyst Agent) — GardenGreen v1.0*
*Consolidado a partir de: Council Session + Market Research + Competitor Analysis*
