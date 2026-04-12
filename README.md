# F1 Portal

Um portal estático desenvolvido com Vanilla JavaScript para consulta de dados em tempo real da Fórmula 1. O projeto foca em performance, acessibilidade e resiliência, utilizando técnicas modernas de desenvolvimento web sem a dependência de frameworks pesados.

Acesse a demonstração: [https://andersoncav.github.io/F1/](https://andersoncav.github.io/F1/)

## 🏎️ O Projeto

O objetivo deste portal é fornecer uma interface rápida e intuitiva para entusiastas da categoria. Ele consome dados da Jolpica F1 API (sucessora da Ergast) e implementa uma camada robusta de cache local para contornar limites de taxa e garantir funcionamento offline parcial via PWA.

### Diferenciais Técnicos

- **Arquitetura Vanilla:** Zero frameworks. Todo o gerenciamento de estado e DOM é feito via JavaScript puro, demonstrando domínio dos fundamentos da web.
- **Persistência Seletiva:** Sistema de cache customizado em `localStorage` com controle de expiração (TTL) e limpeza granular por projeto.
- **Performance e PWA:** Implementação de Service Worker para cache de assets estáticos e manifesto para instalação como aplicativo.
- **Acessibilidade Real:** Marcação semântica, suporte a leitores de tela via `aria-live` e gestão de foco para navegação por teclado.

## ✨ Funcionalidades

- **Dashboard:** Próximo Grande Prêmio com countdown em tempo real e resultados da última corrida.
- **Classificação Dinâmica:** Tabelas de pilotos e construtores com filtros e ordenação personalizada.
- **Grid Completo:** Detalhes técnicos de equipes e pilotos, incluindo fotos e estatísticas históricas.
- **Histórico de Campeões:** Galeria completa de todos os campeões mundiais desde 1950.
- **Calendário:** Cronograma da temporada com status atualizado de cada etapa.

## 🛠️ Stack Técnica

- **Linguagens:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **API:** [Jolpica F1 API](https://github.com/jolpica/jolpica-f1)
- **Infra:** GitHub Actions (Deploy automatizado), Node.js (apenas para o Test Runner nativo)
- **Testes:** Node Test Runner (sem dependências externas)

## 📂 Estrutura

```text
/assets
  ├── css/          # Design System e animações
  ├── js/
  │   ├── api.js    # Camada de rede e cache
  │   ├── ui-utils.js # Utilitários de interface e PWA
  │   └── *.js      # Scripts específicos por página
/tests              # Testes unitários de lógica pura
sw.js               # Service Worker para suporte offline
manifest.json       # Configurações do PWA
```

## 💻 Desenvolvimento Local

O projeto utiliza módulos ES6, o que requer um servidor web para rodar localmente devido às restrições de CORS e segurança do navegador.

1. Clone o repositório:
   ```bash
   git clone https://github.com/AndersonCav/F1.git
   cd F1
   ```

2. Inicie um servidor local (exemplos):
   - **Node.js:** `npx serve .`
   - **Python:** `python -m http.server 8080`
   - **VS Code:** Extensão "Live Server"

3. Para rodar os testes unitários (requer Node.js 20+):
   ```bash
   npm run test
   ```

## 📝 Observações e Limitações

- As fotos dos pilotos e logos das equipes são fornecidos por assets externos integrados no `static-data.js`.
- O cache da API é renovado automaticamente a cada 60 minutos para garantir dados frescos sem sobrecarregar o serviço gratuito.

---
Desenvolvido por [Anderson Cavalcante](https://github.com/AndersonCav)
