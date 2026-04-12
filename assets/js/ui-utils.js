/**
 * UI Utilities - Funções compartilhadas para manipulação de DOM e feedback visual
 */

export function renderSkeleton(container, count = 6, type = "grid") {
  const wrapper = document.createElement("div");
  wrapper.className = type === "grid" ? "grid" : "list";
  
  // Adiciona classes específicas se for grid
  if (type === "grid") {
    if (container.id === "drivers-state") wrapper.classList.add("grid-drivers");
    if (container.id === "teams-state") wrapper.classList.add("grid-teams");
    if (container.id === "champions-state") wrapper.classList.add("grid-champions");
  }

  for (let i = 0; i < count; i += 1) {
    const skeletonCard = document.createElement("article");
    skeletonCard.className = "skeleton-card";

    for (let line = 0; line < 4; line += 1) {
      const skeletonLine = document.createElement("div");
      skeletonLine.className = `skeleton skeleton-line ${line === 0 ? "short" : "medium"}`;
      skeletonCard.appendChild(skeletonLine);
    }

    wrapper.appendChild(skeletonCard);
  }

  container.replaceChildren(wrapper);
}

export function renderError(container, message, onRetry) {
  const card = document.createElement("article");
  card.className = "state-card error reveal-up";

  const text = document.createElement("p");
  text.textContent = message || "Não foi possível carregar os dados no momento.";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
    Tentar novamente
  `;
  button.addEventListener("click", onRetry);

  card.append(text, button);
  container.replaceChildren(card);
}

export function renderEmptyState(container, message) {
  const card = document.createElement("article");
  card.className = "state-card reveal-up";
  card.style.textAlign = "center";
  card.style.padding = "3rem 1rem";
  
  card.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">🔍</div>
    <p style="color: var(--text-muted);">${message || "Nenhum resultado encontrado."}</p>
  `;
  
  container.replaceChildren(card);
}

/**
 * Cria uma notificação visual discreta sobre o estado do cache
 */
export function showCacheFeedback(timestamp) {
  const existing = document.getElementById("cache-info");
  if (existing) existing.remove();

  if (!timestamp) return;

  const date = new Date(timestamp);
  const timeStr = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  
  const info = document.createElement("div");
  info.id = "cache-info";
  info.className = "cache-feedback reveal-up";
  info.innerHTML = `
    <span>Dados de cache (${timeStr})</span>
    <button id="clear-cache-btn" title="Forçar atualização">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    </button>
  `;

  document.body.appendChild(info);

  document.getElementById("clear-cache-btn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
}

/**
 * Anúncio para leitores de tela
 */
export function announceToScreenReader(message) {
  let announcer = document.getElementById("sr-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.margin = "-1px";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // Silencioso em caso de erro no registro
      });
    });
  }
}

registerServiceWorker();
