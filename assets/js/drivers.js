import { fetchCurrentDriverStandings, fetchDrivers } from "./api.js";
import { DRIVER_STATIC, PLACEHOLDER_DRIVER_IMAGE, getOfficialTeamName, setupNavActiveState, toFlag } from "./static-data.js";

const stateContainer = document.getElementById("drivers-state");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

const TEAM_COLOR_MAP = {
  ferrari: "#e10600",
  mercedes: "#00d2be",
  mclaren: "#ff8000",
  "red bull": "#1e5bc6",
  "red bull racing": "#1e5bc6",
  "racing bulls": "#2b5cff",
  rb: "#2b5cff",
  "rb f1 team": "#2b5cff",
  alpine: "#0090ff",
  williams: "#005aff",
  "aston martin": "#006f62",
  "haas": "#b6babd",
  "haas f1 team": "#b6babd",
  audi: "#c70000",
  sauber: "#00c087",
  "stake f1 team kick sauber": "#00c087",
  cadillac: "#9ca3af"
};

let driversData = [];
let expandedCardId = null;

function updateSortInUrl(value) {
  const url = new URL(window.location.href);
  url.searchParams.set("sort", value);
  window.history.replaceState({}, "", url);
}

function getSortFromUrl() {
  const value = new URL(window.location.href).searchParams.get("sort");
  const allowed = ["standing", "name", "team", "points", "wins", "poles"];
  return allowed.includes(value) ? value : "standing";
}

function renderSkeleton() {
  const grid = document.createElement("div");
  grid.className = "grid grid-drivers";

  for (let i = 0; i < 6; i += 1) {
    const skeletonCard = document.createElement("article");
    skeletonCard.className = "skeleton-card";

    for (let line = 0; line < 5; line += 1) {
      const skeletonLine = document.createElement("div");
      skeletonLine.className = `skeleton skeleton-line ${line === 0 ? "short" : "medium"}`;
      skeletonCard.appendChild(skeletonLine);
    }

    grid.appendChild(skeletonCard);
  }

  stateContainer.replaceChildren(grid);
}

function renderError(onRetry) {
  const card = document.createElement("article");
  card.className = "state-card error";

  const text = document.createElement("p");
  text.textContent = "Nao foi possivel carregar os pilotos agora.";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = "Tentar novamente";
  button.addEventListener("click", onRetry);

  card.append(text, button);
  stateContainer.replaceChildren(card);
}

function applySort(items, sortBy) {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (sortBy === "name") {
      return a.fullName.localeCompare(b.fullName, "pt-BR");
    }

    if (sortBy === "team") {
      return (a.team || "").localeCompare(b.team || "", "pt-BR");
    }

    if (sortBy === "points") {
      return b.points - a.points;
    }

    if (sortBy === "wins") {
      return b.wins - a.wins;
    }

    if (sortBy === "poles") {
      return b.poles - a.poles;
    }

    return a.position - b.position;
  });

  return sorted;
}

function filterDrivers(items, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return items.filter((driver) => driver.fullName.toLowerCase().includes(normalized));
}

function createBadge(label, value) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = `${label}: ${value}`;
  return badge;
}

function normalizeTeamName(teamName) {
  return String(teamName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function resolveTeamColor(teamName, staticColor) {
  const normalized = normalizeTeamName(teamName);
  return TEAM_COLOR_MAP[normalized] || staticColor || "#e10600";
}

function normalizeDriverKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveDriverStaticData(driver, profile) {
  const byId = normalizeDriverKey(driver?.driverId);
  if (byId && DRIVER_STATIC[byId]) {
    return DRIVER_STATIC[byId];
  }

  const fullNameKey = normalizeDriverKey(`${profile?.givenName || driver?.givenName || ""}_${profile?.familyName || driver?.familyName || ""}`);
  if (fullNameKey && DRIVER_STATIC[fullNameKey]) {
    return DRIVER_STATIC[fullNameKey];
  }

  return {};
}

function appendDetailRow(dl, label, value, linkHref = "") {
  const dt = document.createElement("dt");
  dt.textContent = label;

  const dd = document.createElement("dd");
  if (linkHref) {
    const link = document.createElement("a");
    link.href = linkHref;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Acessar ${label.toLowerCase()}`;
    dd.appendChild(link);
  } else {
    dd.textContent = value;
  }

  dl.append(dt, dd);
}

function renderEmptyState() {
  const card = document.createElement("article");
  card.className = "state-card";
  card.textContent = "Nenhum piloto encontrado com os filtros atuais.";
  stateContainer.replaceChildren(card);
}

function buildDriverCard(driver) {
  const article = document.createElement("article");
  article.className = "driver-card";

  const header = document.createElement("div");
  header.className = "driver-header";

  const image = document.createElement("img");
  image.className = "portrait";
  image.src = driver.photo;
  image.alt = `Foto do piloto ${driver.fullName}`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.src = PLACEHOLDER_DRIVER_IMAGE;
  });

  const textWrap = document.createElement("div");
  const name = document.createElement("h3");
  name.className = "name";
  name.textContent = driver.fullName;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${toFlag(driver.nationality)} ${driver.shortTeam}`;

  const badges = document.createElement("div");
  badges.className = "kpis";
  badges.append(
    createBadge("Pts", driver.points),
    createBadge("Vitorias", driver.wins),
    createBadge("Poles", driver.poles)
  );

  textWrap.append(name, meta, badges);

  const number = document.createElement("span");
  number.className = "driver-number";
  number.style.color = driver.teamColor;
  number.textContent = String(driver.number || "-");

  header.append(image, textWrap, number);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "expand-btn";
  button.setAttribute("aria-expanded", String(expandedCardId === driver.id));
  button.textContent = expandedCardId === driver.id ? "Ocultar detalhes" : "Ver detalhes";
  button.addEventListener("click", () => {
    expandedCardId = expandedCardId === driver.id ? null : driver.id;
    renderDrivers();
  });

  article.append(header, button);

  if (expandedCardId === driver.id) {
    const details = document.createElement("div");
    details.className = "details";

    const dl = document.createElement("dl");
    appendDetailRow(dl, "Posicao", String(driver.position));
    appendDetailRow(dl, "Equipe", driver.fullTeam);
    appendDetailRow(dl, "Pontos", String(driver.points));
    appendDetailRow(dl, "Vitorias", String(driver.wins));
    appendDetailRow(dl, "Poles", String(driver.poles));
    appendDetailRow(dl, "Nascimento", driver.dateOfBirth || "-");
    appendDetailRow(dl, "Local de nascimento", driver.placeOfBirth || "-");
    appendDetailRow(dl, "Nacionalidade", driver.nationality || "-");

    if (driver.website) {
      appendDetailRow(dl, "Site oficial do piloto", "", driver.website);
    } else {
      appendDetailRow(dl, "Site oficial do piloto", "Nao informado");
    }

    details.appendChild(dl);
    article.appendChild(details);
  }

  return article;
}

function renderDrivers() {
  const query = searchInput.value;
  const sortBy = sortSelect.value;

  const filtered = filterDrivers(driversData, query);
  const sorted = applySort(filtered, sortBy);

  if (sorted.length === 0) {
    renderEmptyState();
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid grid-drivers";

  sorted.forEach((driver) => {
    grid.appendChild(buildDriverCard(driver));
  });

  stateContainer.replaceChildren(grid);
}

async function loadDrivers() {
  renderSkeleton();

  try {
    const currentYear = new Date().getFullYear();
    const [driverStandings, allDrivers] = await Promise.all([
      fetchCurrentDriverStandings(),
      fetchDrivers(currentYear)
    ]);

    const driversById = new Map(allDrivers.map((entry) => [entry.driverId, entry]));

    driversData = driverStandings.map((standing) => {
      const driver = standing.Driver || {};
      const id = driver.driverId;
      const profile = driversById.get(id) || driver;
      const staticData = resolveDriverStaticData(driver, profile);
      const rawTeamName = standing.Constructors?.[0]?.name || "Equipe nao informada";

      return {
        id,
        position: Number(standing.position || 0),
        fullName: `${driver.givenName || ""} ${driver.familyName || ""}`.trim(),
        shortTeam: rawTeamName,
        fullTeam: getOfficialTeamName(rawTeamName),
        points: Number(standing.points || 0),
        wins: Number(standing.wins || 0),
        poles: Number(staticData.poles || 0),
        number: staticData.number || profile.permanentNumber || "-",
        nationality: profile.nationality || driver.nationality || "",
        dateOfBirth: staticData.dateOfBirth || profile.dateOfBirth || "",
        placeOfBirth: staticData.placeOfBirth || "",
        photo: staticData.photo || PLACEHOLDER_DRIVER_IMAGE,
        website: staticData.website || "",
        teamColor: resolveTeamColor(rawTeamName, staticData.teamColor)
      };
    });

    renderDrivers();
  } catch {
    renderError(loadDrivers);
  }
}

function init() {
  setupNavActiveState();

  const sortFromUrl = getSortFromUrl();
  sortSelect.value = sortFromUrl;

  sortSelect.addEventListener("change", () => {
    updateSortInUrl(sortSelect.value);
    renderDrivers();
  });

  searchInput.addEventListener("input", renderDrivers);

  loadDrivers();
}

init();
