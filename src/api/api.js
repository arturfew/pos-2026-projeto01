const API_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// ID do Liverpool no TheSportsDB
const LIVERPOOL_ID = 133602;

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}

// Busca os dados do Liverpool
export async function getLiverpool() {
  const data = await request(`/lookupteam.php?id=${LIVERPOOL_ID}`);
  return data.teams?.[0];
}

// Busca os jogadores do Liverpool
export async function getLiverpoolPlayers() {
  const data = await request(
    `/lookup_all_players.php?id=${LIVERPOOL_ID}`
  );

  return data.player || [];
}

// Busca detalhes de um jogador
export async function getPlayerDetails(playerId) {
  const data = await request(
    `/lookupplayer.php?id=${playerId}`
  );

  return data.players?.[0];
}