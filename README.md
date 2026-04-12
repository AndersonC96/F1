# 🏁 F1 Portal

Portal de dados da Fórmula 1 com informações em tempo real sobre pilotos, equipes, calendário e campeões históricos. Desenvolvido com foco em performance, acessibilidade e experiência do usuário em dispositivos móveis e desktop.

## 📸 Screenshots

<div align="center">
  <img src="assets/images/screenshot-home.png" alt="Página Inicial" width="400">
  <img src="assets/images/screenshot-drivers.png" alt="Página de Pilotos" width="400">
</div>

## 🔗 Demo

Acesse o portal ao vivo: [https://andersonls.github.io/F1/](https://andersonls.github.io/F1/)

## 🚀 Sobre o projeto

Este projeto é uma aplicação frontend moderna e estática que consome dados da principal categoria do automobilismo mundial.

O foco principal foi a criação de uma interface resiliente e performática utilizando apenas **tecnologias nativas (Vanilla JS)**. Implementamos um sistema de cache inteligente com persistência local para garantir uma navegação fluida mesmo sob limites de taxa da API, além de um design focado na identidade visual da Fórmula 1.

### Diferenciais Técnicos:
- **Zero Dependências:** Sem frameworks (React/Vue/Angular) ou bibliotecas externas de UI.
- **Cache Inteligente:** Implementação manual de cache em `localStorage` com controle de TTL (Time-to-Live).
- **Acessibilidade:** Navegação por teclado, landmarks semânticos e suporte a leitores de tela.
- **Mobile First:** Navegação otimizada para toque com barra inferior estilo app nativo.

## ✨ Funcionalidades

- **Dashboard Inicial:** Countdown em tempo real para o próximo GP e resultados da última corrida.
- **Classificação:** Tabela rápida de pilotos e construtores atualizada dinamicamente.
- **Grid Completo:** Detalhes técnicos de todos os pilotos e equipes da temporada atual.
- **Histórico:** Galeria de todos os campeões mundiais desde 1950 com filtros por títulos.
- **Calendário:** Programação completa da temporada com status de cada Grande Prêmio.
- **Feedback de Cache:** Indicação visual de quando os dados foram atualizados pela última vez.

## 🛠️ Tecnologias

- **Linguagens:** HTML5, CSS3, JavaScript (ES2022+)
- **API:** [Jolpica F1 API](https://github.com/jolpica/jolpica-f1) (Sucessor do Ergast API)
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Imagens:** FlagsAPI e Assets Oficiais da F1

## 📂 Estrutura do Projeto

```text
/
├── index.html                     # Dashboard principal
├── drivers.html                   # Grid de pilotos com busca e filtros
├── teams.html                     # Detalhes das escuderias
├── champions.html                 # Histórico de campeões
├── calendar.html                  # Calendário da temporada
├── assets/
│   ├── css/                       # Design System e Animações
│   ├── js/
│   │   ├── api.js                 # Camada de serviço e cache
│   │   ├── ui-utils.js            # Helpers de interface e feedbacks
│   │   ├── static-data.js         # Complementos de dados e mapeamentos
│   │   └── [page].js              # Lógica específica de cada página
│   └── images/                    # Fallbacks e ícones
└── .github/workflows/             # Automação de deploy
```

## 💻 Como rodar localmente

Como o projeto é estático, não há necessidade de `npm install`. No entanto, devido ao uso de módulos ES6 e chamadas de API, é necessário um servidor local.

1. Clone o repositório:
```bash
git clone https://github.com/andersonls/F1.git
cd F1
```

2. Inicie um servidor (Exemplos):
```bash
# Se tiver VS Code
# Use a extensão "Live Server"

# Se tiver Python
python -m http.server 8080

# Se tiver Node.js
npx serve .
```

3. Acesse `http://localhost:8080` no navegador.

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---
Desenvolvido por [Anderson](https://github.com/andersonls)
