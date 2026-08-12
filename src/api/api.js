const API_URL = 'https://www.thesportsdb.com/api/v1/json/3';


async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}

export async function getTeamDetails(teamId) {
  const data = await request(`/lookupteam.php?id=${teamId}`);
  return data.teams?.[0] || null;
}

export async function getTeamPlayers(teamId) {
  const data = await request(`/lookup_all_players.php?id=${teamId}`);
  return data.player || [];
}

export async function getPlayerDetails(playerId) {
  const data = await request(`/lookupplayer.php?id=${playerId}`);
  return data.players?.[0] || null;
}