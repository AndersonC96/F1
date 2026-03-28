import { CHAMPIONS_HISTORY, setupNavActiveState, toFlag } from "./static-data.js";

const stateContainer = document.getElementById("champions-state");
const titlesFilter = document.getElementById("titles-filter");
const sortSelect = document.getElementById("sort-select");

function readQueryParams() {
  const params = new URL(window.location.href).searchParams;
  const allowedSort = ["titles", "name", "firstYear"];
  const allowedFilter = ["all", "1", "2", "3plus", "5plus"];

  return {
    sort: allowedSort.includes(params.get("sort")) ? params.get("sort") : "titles",
    filter: allowedFilter.includes(params.get("filter")) ? params.get("filter") : "all"
  };
}

function writeQueryParams(sort, filter) {
  const url = new URL(window.location.href);
  url.searchParams.set("sort", sort);
  url.searchParams.set("filter", filter);
  window.history.replaceState({}, "", url);
}

function filterItems(items, filter) {
  if (filter === "1") {
    return items.filter((item) => item.titleYears.length === 1);
  }

  if (filter === "2") {
    return items.filter((item) => item.titleYears.length === 2);
  }

  if (filter === "3plus") {
    return items.filter((item) => item.titleYears.length >= 3);
  }

  if (filter === "5plus") {
    return items.filter((item) => item.titleYears.length >= 5);
  }

  return items;
}

function sortItems(items, sortBy) {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, "pt-BR");
    }

    if (sortBy === "firstYear") {
      return a.titleYears[0] - b.titleYears[0];
    }

    const titleDiff = b.titleYears.length - a.titleYears.length;
    if (titleDiff !== 0) {
      return titleDiff;
    }

    return b.titleYears[b.titleYears.length - 1] - a.titleYears[a.titleYears.length - 1];
  });

  return sorted;
}

function createCard(champion) {
  const article = document.createElement("article");
  article.className = "champion-card";

  const header = document.createElement("div");
  header.className = "champion-header";

  const image = document.createElement("img");
  image.className = "portrait";
  image.src = champion.photo;
  image.alt = `Foto de ${champion.name}`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.src = "assets/images/placeholder-driver.svg";
  });

  const textWrap = document.createElement("div");
  const name = document.createElement("h3");
  name.className = "name";
  name.textContent = champion.name;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${toFlag(champion.nationality)} ${champion.nationality}`;

  const years = document.createElement("p");
  years.className = "muted";
  years.textContent = `Titulos: ${champion.titleYears.join(", ")}`;

  textWrap.append(name, meta, years);

  const count = document.createElement("span");
  count.className = "title-count";
  count.textContent = String(champion.titleYears.length);

  header.append(image, textWrap, count);

  const details = document.createElement("div");
  details.className = "details";

  const dl = document.createElement("dl");
  const pairs = [
    ["Primeiro titulo", String(champion.titleYears[0])],
    ["Ultimo titulo", String(champion.titleYears[champion.titleYears.length - 1])],
    ["Vitorias", String(champion.wins)],
    ["Equipes", champion.teams.join(" / ")]
  ];

  pairs.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dl.append(dt, dd);
  });

  details.appendChild(dl);

  article.append(header, details);
  return article;
}

function render() {
  const filtered = filterItems(CHAMPIONS_HISTORY, titlesFilter.value);
  const sorted = sortItems(filtered, sortSelect.value);

  if (sorted.length === 0) {
    const empty = document.createElement("article");
    empty.className = "state-card";
    empty.textContent = "Nenhum campeao encontrado para este filtro.";
    stateContainer.replaceChildren(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid grid-champions";
  sorted.forEach((champion) => grid.appendChild(createCard(champion)));
  stateContainer.replaceChildren(grid);
}

function init() {
  setupNavActiveState();

  const query = readQueryParams();
  sortSelect.value = query.sort;
  titlesFilter.value = query.filter;

  const onControlsChange = () => {
    writeQueryParams(sortSelect.value, titlesFilter.value);
    render();
  };

  sortSelect.addEventListener("change", onControlsChange);
  titlesFilter.addEventListener("change", onControlsChange);

  render();
}

init();
