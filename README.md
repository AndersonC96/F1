# F1 Portal

Portal de dados da Fórmula 1 com informações em tempo real sobre pilotos, equipes, calendário e campeões históricos.

## 📸 Screenshots

[Inserir aqui screenshots reais das páginas — geradas após o deploy]
<!-- Placeholder: adicionar após primeiro deploy -->
![Home](docs/screenshots/home.png)
![Pilotos](docs/screenshots/drivers.png)
![Calendário](docs/screenshots/calendar.png)

## 🔗 Demo

[Link do GitHub Pages será gerado automaticamente após o primeiro deploy]

## Sobre o projeto

Este projeto é uma revitalização de um portal antigo feito em PHP.

O foco foi migrar tudo para frontend estático com HTML, CSS e JavaScript vanilla, para rodar sem backend e com deploy direto no GitHub Pages. Durante a migração, a fonte de dados foi atualizada para a Jolpica F1 API, com cache local para reduzir chamadas e respeitar rate limit.

Foi desenvolvido como projeto pessoal para praticar consumo de APIs REST, manipulação de DOM sem frameworks, design responsivo e CI/CD com GitHub Actions.

## Funcionalidades

- Classificação de pilotos e construtores em tempo real (atualizada a cada corrida)
- Countdown para o próximo Grande Prêmio
- Resultado das últimas corridas
- Calendário completo da temporada com status de cada GP
- Perfis detalhados de todos os pilotos do grid atual
- Histórico de todos os campeões mundiais desde 1950
- Cache local para performance e respeito ao rate limit da API
- Interface responsiva (mobile, tablet e desktop)
- Deploy automático via GitHub Actions

## Tecnologias

- HTML5, CSS3, JavaScript (ES2022, vanilla — sem frameworks)
- [Jolpica F1 API](https://github.com/jolpica/jolpica-f1) — dados em tempo real
- GitHub Actions — CI/CD
- GitHub Pages — hospedagem estática gratuita
- Titillium Web (Google Fonts) — tipografia

## Estrutura do projeto

```text
/
├── index.html                     # Home: hero, próxima corrida, última corrida, classificação rápida
├── drivers.html                   # Lista de pilotos, busca, ordenação e detalhes expandidos
├── teams.html                     # Lista de equipes com dados técnicos e expansão de card
├── champions.html                 # Campeões históricos com filtros por títulos
├── calendar.html                  # Calendário completo da temporada em formato de lista
├── 404.html                       # Página de erro temática
├── .nojekyll                      # Desabilita processamento Jekyll no GitHub Pages
├── assets/
│   ├── css/
│   │   ├── style.css              # Estilos globais, layout responsivo e componentes
│   │   └── animations.css         # Animações de entrada e shimmer dos skeletons
│   ├── js/
│   │   ├── api.js                 # Cliente da Jolpica API com cache local e TTL
│   │   ├── static-data.js         # Dados estáticos: fotos, equipes e campeões históricos
│   │   ├── main.js                # Lógica da home
│   │   ├── drivers.js             # Lógica da página de pilotos
│   │   ├── teams.js               # Lógica da página de equipes
│   │   ├── champions.js           # Lógica da página de campeões
│   │   └── calendar.js            # Lógica da página de calendário
│   └── images/
│       └── placeholder-driver.svg # Fallback para imagens quebradas
├── .github/
│   └── workflows/
│       └── deploy.yml             # Pipeline de deploy automático no GitHub Pages
├── docs/
│   └── screenshots/               # Capturas de tela para documentação
└── README.md
```

## Como rodar localmente

Não requer build ou instalação de dependências.

1. Clone o repositório

```bash
git clone https://github.com/[seu-usuario]/f1-portal.git
cd f1-portal
```

1. Abra um servidor local (qualquer um serve):

```bash
# Python
python3 -m http.server 8080

# Node (se tiver npx)
npx serve .

# VS Code: instalar extensão Live Server e clicar em "Go Live"
```

1. Acesse `http://localhost:8080`

> ⚠️ Não abrir os arquivos .html diretamente no browser (file://) — o localStorage e os fetch() precisam de um servidor HTTP, mesmo que local.

## API utilizada

Todos os dados são fornecidos pela [Jolpica F1 API](http://api.jolpi.ca/ergast/f1/), substituta open source do Ergast API (desativado em 2024). Sem autenticação necessária. Rate limit: 200 requisições/hora.

Endpoints utilizados:

- `/current/driverStandings.json`
- `/current/constructorStandings.json`
- `/current/races.json`
- `/current/results.json`

## Deploy

O projeto é deployado automaticamente no GitHub Pages via GitHub Actions a cada push na branch `main`. O workflow está em `.github/workflows/deploy.yml`.

Para configurar em seu fork:

1. Vá em Settings → Pages
1. Em "Source", selecione "GitHub Actions"
1. Faça qualquer push na main — o deploy acontece automaticamente

## Licença

MIT
