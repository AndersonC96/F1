import {
  fetchCurrentConstructorStandings,
  fetchCurrentDriverStandings,
  fetchCurrentResults,
  fetchCurrentSchedule,
  fetchScheduleBySeason
} from "./api.js";
import { formatRaceDate, setupNavActiveState, toFlag } from "./static-data.js";

const nextRaceState = document.getElementById("next-race-state");
const lastRaceState = document.getElementById("last-race-state");
const quickStandingsState = document.getElementById("quick-standings-state");
const currentYearElement = document.getElementById("current-year");

let countdownInterval = null;

function createSkeletonBlock(lines = 4) {
  const card = document.createElement("div");
  card.className = "skeleton-card";

  for (let i = 0; i < lines; i += 1) {
    const line = document.createElement("div");
    line.className = `skeleton skeleton-line ${i === 0 ? "short" : "medium"}`;
    card.appendChild(line);
  }

  return card;
}

function renderErrorState(target, message, onRetry) {
  target.replaceChildren();

  const card = document.createElement("article");
  card.className = "state-card error";

  const text = document.createElement("p");
  text.textContent = message;

  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "button";
  retryButton.textContent = "Tentar novamente";
  retryButton.addEventListener("click", onRetry);

  card.append(text, retryButton);
  target.appendChild(card);
}

function raceDateToTimestamp(race) {
  const isoDate = race.time ? `${race.date}T${race.time}` : `${race.date}T12:00:00Z`;
  return new Date(isoDate).getTime();
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function buildNextRaceCard(nextRace, isSeasonClosed = false) {
  const card = document.createElement("article");
  card.className = "card highlight";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = isSeasonClosed ? "Temporada encerrada" : `${toFlag(nextRace.Circuit.Location.country)} ${nextRace.raceName}`;

  const subtitle = document.createElement("p");
  subtitle.className = "card-subtitle";
  subtitle.textContent = `${nextRace.Circuit.circuitName} - ${formatRaceDate(nextRace.date, nextRace.time)}`;

  const countdown = document.createElement("p");
  countdown.className = "countdown-timer";

  const eventTime = raceDateToTimestamp(nextRace);
  const updateCountdown = () => {
    const diff = eventTime - Date.now();
    countdown.textContent = diff > 0 ? formatCountdown(diff) : "Largada concluida";
  };

  updateCountdown();

  if (countdownInterval) {
    window.clearInterval(countdownInterval);
  }

  if (!isSeasonClosed) {
    countdownInterval = window.setInterval(updateCountdown, 1000);
  } else {
    countdown.textContent = `Primeira corrida em ${formatRaceDate(nextRace.date, nextRace.time)}`;
  }

  const footer = document.createElement("div");
  footer.className = "kpis";
  footer.style.marginTop = "1.5rem";

  const cta = document.createElement("a");
  cta.href = "calendar.html";
  cta.className = "button";
  cta.textContent = "Ver calendário completo";

  footer.appendChild(cta);

  card.append(title, subtitle, countdown, footer);
  return card;
}

function buildLastRaceCard(lastRace) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = `${toFlag(lastRace.Circuit.Location.country)} ${lastRace.raceName}`;

  const subtitle = document.createElement("p");
  subtitle.className = "card-subtitle";
  subtitle.textContent = `Round ${lastRace.round} - ${formatRaceDate(lastRace.date, lastRace.time)}`;

  const podiumWrapper = document.createElement("div");
  podiumWrapper.className = "kpis";

  const podium = (lastRace.Results || []).slice(0, 3);
  podium.forEach((result) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    const firstName = result.Driver.givenName || "";
    const lastName = result.Driver.familyName || "";
    const teamName = result.Constructor.name || "Equipe";
    badge.textContent = `P${result.position}: ${firstName} ${lastName} (${teamName})`;
    podiumWrapper.appendChild(badge);
  });

  if (podium.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Resultado ainda nao disponivel para esta etapa.";
    card.append(title, subtitle, empty);
    return card;
  }

  const footer = document.createElement("div");
  footer.className = "kpis";
  footer.style.marginTop = "1rem";

  const cta = document.createElement("a");
  cta.href = "calendar.html"; // Should ideally go to result detail if it existed
  cta.className = "button";
  cta.style.background = "transparent";
  cta.textContent = "Ver detalhes da corrida";

  footer.appendChild(cta);

  card.append(title, subtitle, podiumWrapper, footer);
  return card;
}

function createTable(titleText, rows, isConstructorTable = false) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = titleText;

  const table = document.createElement("table");
  table.className = "standings-table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Pos", isConstructorTable ? "Equipe" : "Piloto", isConstructorTable ? "-" : "Equipe", "Pts"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headRow.appendChild(th);
  });
  head.appendChild(headRow);

  const body = document.createElement("tbody");
  rows.forEach((entry) => {
    const row = document.createElement("tr");
    const pos = document.createElement("td");
    const main = document.createElement("td");
    const secondary = document.createElement("td");
    const points = document.createElement("td");

    pos.textContent = entry.position;
    points.textContent = entry.points;

    if (isConstructorTable) {
      main.textContent = entry.Constructor.name;
      secondary.textContent = "-";
    } else {
      main.textContent = `${entry.Driver.givenName} ${entry.Driver.familyName}`;
      secondary.textContent = entry.Constructors?.[0]?.name || "-";
    }

    row.append(pos, main, secondary, points);
    body.appendChild(row);
  });

  table.append(head, body);
  card.append(title, table);
  return card;
}

async function resolveNextRace(schedule) {
  const now = Date.now();
  const ordered = [...schedule].sort((a, b) => raceDateToTimestamp(a) - raceDateToTimestamp(b));
  const futureRace = ordered.find((race) => raceDateToTimestamp(race) > now);

  if (futureRace) {
    return { race: futureRace, isSeasonClosed: false };
  }

  const nextSeason = new Date().getFullYear() + 1;
  const nextSeasonSchedule = await fetchScheduleBySeason(nextSeason);
  const firstRound = [...nextSeasonSchedule].sort((a, b) => raceDateToTimestamp(a) - raceDateToTimestamp(b))[0];

  if (!firstRound) {
    throw new Error("Nao foi possivel identificar a proxima corrida.");
  }

  return { race: firstRound, isSeasonClosed: true };
}

async function loadHomeData() {
  nextRaceState.replaceChildren(createSkeletonBlock(4));
  lastRaceState.replaceChildren(createSkeletonBlock(4));
  quickStandingsState.replaceChildren(createSkeletonBlock(6));

  try {
    const [schedule, results, driverStandings, constructorStandings] = await Promise.all([
      fetchCurrentSchedule(),
      fetchCurrentResults(),
      fetchCurrentDriverStandings(),
      fetchCurrentConstructorStandings()
    ]);

    const nextRaceInfo = await resolveNextRace(schedule);
    nextRaceState.replaceChildren(buildNextRaceCard(nextRaceInfo.race, nextRaceInfo.isSeasonClosed));

    const lastRace = [...results].sort((a, b) => Number(b.round) - Number(a.round))[0];
    if (lastRace) {
      lastRaceState.replaceChildren(buildLastRaceCard(lastRace));
    } else {
      const emptyCard = document.createElement("article");
      emptyCard.className = "state-card";
      emptyCard.textContent = "Ainda nao ha resultado oficial registrado para esta temporada.";
      lastRaceState.replaceChildren(emptyCard);
    }

    const tablesWrap = document.createElement("div");
    tablesWrap.className = "table-wrap";
    tablesWrap.append(
      createTable("Top 5 pilotos", driverStandings.slice(0, 5), false),
      createTable("Top 5 construtores", constructorStandings.slice(0, 5), true)
    );
    quickStandingsState.replaceChildren(tablesWrap);
  } catch (error) {
    renderErrorState(nextRaceState, "Falha ao carregar a proxima corrida.", loadHomeData);
    renderErrorState(lastRaceState, "Falha ao carregar o resultado da ultima corrida.", loadHomeData);
    renderErrorState(quickStandingsState, "Falha ao carregar a classificacao rapida.", loadHomeData);
  }
}

function init() {
  setupNavActiveState();
  currentYearElement.textContent = String(new Date().getFullYear());
  loadHomeData();
}

init();
