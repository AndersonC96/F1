const API_BASE = "https://api.jolpi.ca/ergast/f1";

function readCache(cacheKey, ttlMinutes) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const { data, timestamp } = parsed;
    if (!timestamp || Date.now() - timestamp >= ttlMinutes * 60 * 1000) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, data) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Em modo privado o armazenamento pode falhar; nesse caso segue sem cache.
  }
}

export async function fetchWithCache(url, cacheKey, ttlMinutes = 60) {
  const cachedData = readCache(cacheKey, ttlMinutes);
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Falha HTTP ${response.status}`);
  }

  const data = await response.json();
  writeCache(cacheKey, data);
  return data;
}

function getByPath(root, path, fallback) {
  let current = root;
  for (const key of path) {
    if (current == null || !(key in current)) {
      return fallback;
    }
    current = current[key];
  }
  return current;
}

async function safeFetchArray(url, cacheKey, path) {
  try {
    const data = await fetchWithCache(url, cacheKey, 60);
    return getByPath(data, path, []);
  } catch (error) {
    throw new Error("Nao foi possivel carregar dados da API no momento.");
  }
}

export async function fetchCurrentDriverStandings() {
  try {
    return await safeFetchArray(
      `${API_BASE}/current/driverStandings.json`,
      "f1_current_driver_standings",
      ["MRData", "StandingsTable", "StandingsLists", 0, "DriverStandings"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar a classificacao de pilotos.");
  }
}

export async function fetchCurrentConstructorStandings() {
  try {
    return await safeFetchArray(
      `${API_BASE}/current/constructorStandings.json`,
      "f1_current_constructor_standings",
      ["MRData", "StandingsTable", "StandingsLists", 0, "ConstructorStandings"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar a classificacao de construtores.");
  }
}

export async function fetchCurrentSchedule() {
  try {
    return await safeFetchArray(
      `${API_BASE}/current/races.json?limit=30`,
      "f1_current_schedule",
      ["MRData", "RaceTable", "Races"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar o calendario da temporada.");
  }
}

export async function fetchCurrentResults() {
  try {
    return await safeFetchArray(
      `${API_BASE}/current/results.json?limit=5`,
      "f1_current_results",
      ["MRData", "RaceTable", "Races"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar os resultados recentes.");
  }
}

export async function fetchDrivers(season) {
  const year = season || "current";
  try {
    return await safeFetchArray(
      `${API_BASE}/${year}/drivers.json`,
      `f1_drivers_${year}`,
      ["MRData", "DriverTable", "Drivers"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar os pilotos da temporada.");
  }
}

export async function fetchAllTimeChampions() {
  try {
    return await safeFetchArray(
      `${API_BASE}/driverStandings/1.json?limit=100`,
      "f1_all_time_champions",
      ["MRData", "StandingsTable", "StandingsLists"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar os campeoes historicos da API.");
  }
}

export async function fetchScheduleBySeason(season) {
  try {
    return await safeFetchArray(
      `${API_BASE}/${season}/races.json?limit=30`,
      `f1_schedule_${season}`,
      ["MRData", "RaceTable", "Races"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar o calendario da temporada solicitada.");
  }
}
export async function fetchRaceResults(season, round) {
  try {
    return await safeFetchArray(
      `${API_BASE}/${season}/${round}/results.json`,
      `f1_results_${season}_${round}`,
      ["MRData", "RaceTable", "Races", 0, "Results"]
    );
  } catch {
    throw new Error("Nao foi possivel carregar os resultados da corrida.");
  }
}
