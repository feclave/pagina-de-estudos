# Plataforma de Estudos

Single Page Application construída com **React 18** e **Vite**, servindo como plataforma interativa para acompanhamento de um curso presencial com conteúdo progressivo, controle de presença e interação entre alunos.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 com Vite |
| Animações | Framer Motion + Canvas API |
| Estilização | CSS Modules com design tokens customizados |
| Backend | Google Apps Script (serverless) |
| Banco de dados | Google Sheets |
| Deploy | GitHub Pages com HashRouter |
| Ícones | react-icons (Game Icons, Feather, Weather Icons) |
| Tipografia | Google Fonts (Cinzel Decorative, Cinzel, Cormorant Garamond) |

## Arquitetura

### Frontend sem backend tradicional

O projeto não possui servidor próprio. Toda a persistência de dados é feita através da **API do Google Apps Script**, que atua como camada intermediária entre o frontend e o **Google Sheets**, usado como banco de dados.

O fluxo funciona assim:

```
React App  →  POST (no-cors)  →  Google Apps Script  →  Google Sheets
React App  ←  GET (JSON)      ←  Google Apps Script  ←  Google Sheets
```

Isso permite que o site, hospedado como conteúdo estático no GitHub Pages, tenha funcionalidades que normalmente exigiriam um backend:

- **Lista de Chamada** — Registro de presença com controle por horário (domingos, 21h-00h, fuso UTC-3). O frontend valida o horário antes de enviar, e o Apps Script grava nome + matrícula + timestamp na planilha.

- **Mural de Mensagens** — Sistema de mensagens anônimas com moderação. O aluno envia uma mensagem que chega à planilha com status `pendente`. O professor aprova manualmente mudando para `aprovado`, e o frontend filtra via GET apenas as aprovadas. Sem painel admin — a própria planilha é a interface de moderação.

### Canvas API — Efeitos visuais procedurais

Os backgrounds das páginas são renderizados em tempo real via Canvas API:

- **Starfield** — Campo de ~200 estrelas com brilho individual (twinkle) calculado por função senoidal, nebulosas com gradientes radiais, e estrelas cadentes esporádicas com trail em gradiente linear.
- **Fases da lua** — Ícones SVG posicionados sobre o canvas com glow em múltiplas camadas (`drop-shadow`) e animação de respiração via CSS. Cada página exibe uma fase diferente.
- **Sistema de partículas** — Canvas com partículas animadas usando gradientes quentes, sobreposição de camadas CSS para efeitos de vidro e brilho.

### Conteúdo data-driven

Todo o conteúdo é armazenado em arquivos JSON. Um parser customizado interpreta markup `[TABELA]...[/TABELA]` dentro do texto para renderizar tabelas inline com headers e linhas separadas por `|`.

### Sistema de liberação temporal

O conteúdo é liberado progressivamente com base em datas configuradas. Aulas futuras aparecem como bloqueadas na listagem, e conteúdos extras seguem lógica similar, sendo revelados apenas após a aula acontecer.

## Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| Home | `/` | Hero banner com cards de navegação |
| Aulas | `/aulas` | Visualização interativa com orbs clicáveis + listagem de cards |
| Aula Detalhe | `/aulas/:id` | Conto introdutório + conteúdo com tabelas + dinâmica + leitura complementar |
| Chamada | `/chamada` | Formulário de presença com controle de horário |
| Mural | `/mural` | Mensagens anônimas com moderação via Google Sheets |
| Consulta | `/oraculo` | Interface interativa com busca fuzzy por keywords |

## Rodando localmente

```bash
npm install
npm run dev
```

Para as funcionalidades de Chamada e Mural, crie um arquivo `.env` na raiz:

```env
VITE_CHAMADA_SCRIPT_URL=sua_url_do_apps_script
VITE_MURAL_SCRIPT_URL=sua_url_do_apps_script
```

## Build e deploy

```bash
npm run build
```

O build gera arquivos estáticos em `dist/` configurados com `base` para GitHub Pages.
