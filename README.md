# F1 Portal

Portal de dados da Fórmula 1 com informações em tempo real sobre pilotos, equipes, calendário e campeões históricos.

## 📸 Screenshots

[Inserir aqui screenshots reais das páginas - geradas após o deploy]

<!-- Placeholder: adicionar após primeiro deploy -->
![Home](docs/screenshots/home.png)
![Pilotos](docs/screenshots/drivers.png)
![Calendario](docs/screenshots/calendar.png)

## 🔗 Demo

[Link do GitHub Pages será gerado automaticamente após o primeiro deploy]

## Sobre o projeto

Este projeto é uma revitalização completa de uma versão antiga feita em PHP.
O objetivo foi migrar para uma arquitetura 100% estática (HTML, CSS e JavaScript vanilla), para deploy direto no GitHub Pages, consumindo dados em tempo real da Jolpica F1 API.

Foi um projeto pessoal para praticar:

- consumo de APIs REST
- manipulação de DOM sem frameworks
- interface responsiva mobile-first
- organização de frontend modular
- CI/CD com GitHub Actions

## Funcionalidades

- Classificação de pilotos e construtores em tempo real (atualizada a cada corrida)
- Countdown para o próximo Grande Prêmio
- Resultado da última corrida
- Calendário completo da temporada com status de cada GP
- Perfis detalhados de pilotos do grid atual
- Histórico de campeões mundiais desde 1950
- Cache local com TTL para reduzir chamadas e respeitar rate limit da API
- Interface responsiva (mobile, tablet e desktop)
- Deploy automático via GitHub Actions

## Tecnologias

- HTML5, CSS3, JavaScript (ES2022, vanilla - sem frameworks)
- [Jolpica F1 API](https://github.com/jolpica/jolpica-f1) - dados em tempo real
- GitHub Actions - CI/CD
- GitHub Pages - hospedagem estática gratuita
- Titillium Web (Google Fonts) - tipografia

## Estrutura do projeto

```text
/
├── index.html
├── drivers.html
├── teams.html
├── champions.html
├── calendar.html
├── 404.html
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── animations.css
│   ├── js/
│   │   ├── api.js
│   │   ├── static-data.js
│   │   ├── main.js
│   │   ├── drivers.js
│   │   ├── teams.js
│   │   ├── champions.js
│   │   └── calendar.js
│   └── images/
│       └── placeholder-driver.svg
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   └── screenshots/
└── README.md
```

## Como rodar localmente

Nao requer build ou instalação de dependências.

1. Clone o repositório

```bash
git clone https://github.com/[seu-usuario]/f1-portal.git
cd f1-portal
```

1. Abra um servidor local (qualquer um serve)

```bash
# Python
python3 -m http.server 8080

# Node (se tiver npx)
npx serve .

# VS Code: instalar extensão Live Server e clicar em "Go Live"
```

1. Acesse `http://localhost:8080`

> ⚠️ Nao abra os arquivos `.html` via `file://`. O `fetch()` e o `localStorage` devem rodar em um servidor HTTP, mesmo local.

## API utilizada

Todos os dados dinâmicos são fornecidos pela [Jolpica F1 API](https://api.jolpi.ca/ergast/f1/), substituta open source da Ergast API.

Sem autenticação necessária. Rate limit público: 200 requisições/hora.

Endpoints utilizados:

- `/current/driverStandings.json`
- `/current/constructorStandings.json`
- `/current/races.json?limit=30`
- `/current/results.json?limit=5`
- `/driverStandings/1.json?limit=100`

## Deploy

O deploy é automático no GitHub Pages via GitHub Actions a cada push na branch `main`.

Workflow: `.github/workflows/deploy.yml`

Para configurar no seu fork:

1. Vá em **Settings -> Pages**
2. Em **Source**, selecione **GitHub Actions**
3. Faça push na `main` para disparar o deploy

## Licença

MIT
