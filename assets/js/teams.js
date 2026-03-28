import {
  fetchCurrentConstructorStandings,
  fetchCurrentDriverStandings
} from "./api.js";
import { TEAM_STATIC, setupNavActiveState } from "./static-data.js";

const stateContainer = document.getElementById("teams-state");
const sortSelect = document.getElementById("sort-select");

let teamsData = [];
let expandedTeamId = null;

function getSortFromUrl() {
  const sort = new URL(window.location.href).searchParams.get("sort");
  const allowed = ["standing", "name", "wins", "championships"];
  return allowed.includes(sort) ? sort : "standing";
}

function updateSortInUrl(value) {
  const url = new URL(window.location.href);
  url.searchParams.set("sort", value);
  window.history.replaceState({}, "", url);
}

function renderSkeleton() {
  const grid = document.createElement("div");
  grid.className = "grid grid-teams";

  for (let i = 0; i < 6; i += 1) {
    const card = document.createElement("article");
    card.className = "skeleton-card";
    for (let line = 0; line < 5; line += 1) {
      const block = document.createElement("div");
      block.className = `skeleton skeleton-line ${line === 0 ? "short" : "medium"}`;
      card.appendChild(block);
    }
    grid.appendChild(card);
  }

  stateContainer.replaceChildren(grid);
}

function renderError(onRetry) {
  const card = document.createElement("article");
  card.className = "state-card error";

  const text = document.createElement("p");
  text.textContent = "Nao foi possivel carregar as equipes agora.";

  const button = document.createElement("button");
  button.className = "button";
  button.type = "button";
  button.textContent = "Tentar novamente";
  button.addEventListener("click", onRetry);

  card.append(text, button);
  stateContainer.replaceChildren(card);
}

function applySort(items, sortBy) {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, "pt-BR");
    }

    if (sortBy === "wins") {
      return b.historicWins - a.historicWins;
    }

    if (sortBy === "championships") {
      return b.championships - a.championships;
    }

    return a.position - b.position;
  });

  return sorted;
}

function createTeamCard(team) {
  const article = document.createElement("article");
  article.className = "team-card";

  const header = document.createElement("div");
  header.className = "team-header";

  const logo = document.createElement("img");
  logo.className = "logo";
  logo.src = team.logo;
  logo.alt = `Logo da equipe ${team.name}`;
  logo.loading = "lazy";

  const textWrap = document.createElement("div");
  const name = document.createElement("h3");
  name.className = "name";
  name.textContent = team.name;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `Pilotos: ${team.drivers.join(" / ") || "-"}`;

  const badges = document.createElement("div");
  badges.className = "kpis";

  const positionBadge = document.createElement("span");
  positionBadge.className = "badge badge-accent";
  positionBadge.textContent = `P${team.position}`;

  const pointsBadge = document.createElement("span");
  pointsBadge.className = "badge";
  pointsBadge.textContent = `${team.points} pts`;

  badges.append(positionBadge, pointsBadge);
  textWrap.append(name, meta, badges);

  const metrics = document.createElement("span");
  metrics.className = "driver-number";
  metrics.textContent = String(team.historicWins);
  metrics.style.fontSize = "1.55rem";

  header.append(logo, textWrap, metrics);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "expand-btn";
  button.textContent = expandedTeamId === team.id ? "Ocultar detalhes" : "Ver detalhes";
  button.setAttribute("aria-expanded", String(expandedTeamId === team.id));
  button.addEventListener("click", () => {
    expandedTeamId = expandedTeamId === team.id ? null : team.id;
    renderTeams();
  });

  article.append(header, button);

  if (expandedTeamId === team.id) {
    const details = document.createElement("div");
    details.className = "details";

    if (team.carImage) {
      const carImage = document.createElement("img");
      carImage.src = team.carImage;
      carImage.alt = `Carro da equipe ${team.name}`;
      carImage.loading = "lazy";
      carImage.className = "portrait";
      carImage.style.height = "120px";
      carImage.style.objectFit = "contain";
      details.appendChild(carImage);
    }

    const dl = document.createElement("dl");
    const pairs = [
      ["Chefe de equipe", team.principal],
      ["Chefe tecnico", team.technicalChief],
      ["Chassi", team.chassis],
      ["Motor", team.powerUnit],
      ["Base", team.base],
      ["Vitorias historicas", String(team.historicWins)],
      ["Campeonatos", String(team.championships)]
    ];

    pairs.forEach(([label, value]) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value || "-";
      dl.append(dt, dd);
    });

    details.appendChild(dl);
    article.appendChild(details);
  }

  return article;
}

function renderTeams() {
  const sorted = applySort(teamsData, sortSelect.value);

  if (sorted.length === 0) {
    const empty = document.createElement("article");
    empty.className = "state-card";
    empty.textContent = "Nenhuma equipe disponivel nesta temporada.";
    stateContainer.replaceChildren(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid grid-teams";

  sorted.forEach((team) => grid.appendChild(createTeamCard(team)));
  stateContainer.replaceChildren(grid);
}

async function loadTeams() {
  renderSkeleton();

  try {
    const [constructorStandings, driverStandings] = await Promise.all([
      fetchCurrentConstructorStandings(),
      fetchCurrentDriverStandings()
    ]);

    const driverGroups = new Map();
    driverStandings.forEach((entry) => {
      const constructor = entry.Constructors?.[0];
      if (!constructor) {
        return;
      }
      const list = driverGroups.get(constructor.constructorId) || [];
      list.push(`${entry.Driver.givenName} ${entry.Driver.familyName}`.trim());
      driverGroups.set(constructor.constructorId, list);
    });

    teamsData = constructorStandings.map((entry) => {
      const id = entry.Constructor.constructorId;
      const staticData = TEAM_STATIC[id] || {};
      return {
        id,
        name: entry.Constructor.name,
        position: Number(entry.position || 0),
        points: Number(entry.points || 0),
        wins: Number(entry.wins || 0),
        drivers: driverGroups.get(id) || [],
        logo: staticData.logo || "assets/images/placeholder-driver.svg",
        carImage: staticData.carImage || null,
        chassis: staticData.chassis || "-",
        powerUnit: staticData.powerUnit || "-",
        base: staticData.base || "-",
        technicalChief: staticData.technicalChief || "-",
        historicWins: Number(staticData.historicWins || 0),
        championships: Number(staticData.championships || 0),
        principal: staticData.principal || "-"
      };
    });

    renderTeams();
  } catch {
    renderError(loadTeams);
  }
}

function init() {
  setupNavActiveState();

  sortSelect.value = getSortFromUrl();
  sortSelect.addEventListener("change", () => {
    updateSortInUrl(sortSelect.value);
    renderTeams();
  });

  loadTeams();
}

init();
