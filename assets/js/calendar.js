import { fetchCurrentSchedule } from "./api.js";
import { formatRaceDate, setupNavActiveState, toFlag } from "./static-data.js";

const stateContainer = document.getElementById("calendar-state");

function raceToTime(race) {
  const iso = race.time ? `${race.date}T${race.time}` : `${race.date}T12:00:00Z`;
  return new Date(iso).getTime();
}

function renderSkeleton() {
  const wrap = document.createElement("div");
  wrap.className = "list";

  for (let i = 0; i < 8; i += 1) {
    const card = document.createElement("article");
    card.className = "skeleton-card";

    const lineA = document.createElement("div");
    lineA.className = "skeleton skeleton-line short";
    const lineB = document.createElement("div");
    lineB.className = "skeleton skeleton-line medium";

    card.append(lineA, lineB);
    wrap.appendChild(card);
  }

  stateContainer.replaceChildren(wrap);
}

function renderError(onRetry) {
  const card = document.createElement("article");
  card.className = "state-card error";

  const text = document.createElement("p");
  text.textContent = "Nao foi possivel carregar o calendario nesta tentativa.";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = "Tentar novamente";
  button.addEventListener("click", onRetry);

  card.append(text, button);
  stateContainer.replaceChildren(card);
}

function createRaceItem(race, status) {
  const card = document.createElement("article");
  card.className = `card calendar-item ${status}`.trim();

  const round = document.createElement("div");
  round.className = "round";
  round.textContent = `R${race.round}`;

  const info = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = `${toFlag(race.Circuit.Location.country)} ${race.raceName}`;

  const subtitle = document.createElement("p");
  subtitle.className = "card-subtitle";
  subtitle.textContent = `${race.Circuit.circuitName} - ${formatRaceDate(race.date, race.time)}`;

  info.append(title, subtitle);

  const side = document.createElement("div");
  if (status === "next") {
    const badge = document.createElement("span");
    badge.className = "badge badge-accent";
    badge.textContent = "PROXIMA";
    side.appendChild(badge);
  } else if (status === "past") {
    const resultText = document.createElement("span");
    resultText.className = "badge";
    resultText.textContent = "Resultado";
    side.appendChild(resultText);
  } else {
    const dateText = document.createElement("span");
    dateText.className = "badge";
    dateText.textContent = race.date;
    side.appendChild(dateText);
  }

  card.append(round, info, side);
  return card;
}

function renderCalendar(races) {
  if (!races.length) {
    const empty = document.createElement("article");
    empty.className = "state-card";
    empty.textContent = "Calendario indisponivel para esta temporada.";
    stateContainer.replaceChildren(empty);
    return;
  }

  const now = Date.now();
  const sorted = [...races].sort((a, b) => Number(a.round) - Number(b.round));
  const nextRace = sorted.find((race) => raceToTime(race) > now);

  const list = document.createElement("div");
  list.className = "list";

  sorted.forEach((race) => {
    const raceTime = raceToTime(race);
    let status = "future";

    if (raceTime <= now) {
      status = "past";
    }

    if (nextRace && race.round === nextRace.round) {
      status = "next";
    }

    list.appendChild(createRaceItem(race, status));
  });

  stateContainer.replaceChildren(list);
}

async function loadCalendar() {
  renderSkeleton();

  try {
    const races = await fetchCurrentSchedule();
    renderCalendar(races);
  } catch {
    renderError(loadCalendar);
  }
}

function init() {
  setupNavActiveState();
  loadCalendar();
}

init();
