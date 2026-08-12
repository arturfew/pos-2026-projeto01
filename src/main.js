const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";

let currentPlayers = [];

const app = document.querySelector("#app");

function initApp() {
  app.innerHTML = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; min-height: 100vh; margin: 0;">
      <header id="header-bg" style="background-color: #111; color: white; padding: 20px 30px;">
        <h1 id="header-title" style="margin: 0; text-transform: uppercase; font-size: 2rem;">Futebol Explorer</h1>
        <p style="margin: 5px 0 15px 0; opacity: 0.9;">Escolha qualquer time da liga para visualizar os detalhes</p>
        
        <label for="team-select" style="font-weight: bold; margin-right: 10px;">Time:</label>
        <select id="team-select" style="padding: 8px 12px; font-size: 1rem; border-radius: 4px; border: none; cursor: pointer;">
          <option value="">Carregando lista de times...</option>
        </select>
      </header>

      <main style="padding: 30px; max-width: 900px; margin: 0 auto;">
        <section id="team-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h2 id="team-name" style="margin-top: 0;">Selecione um time</h2>
          <div id="team-details">Aguardando seleção...</div>
        </section>

        <section style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h2 style="margin-top: 0;">Jogadores</h2>
          <div id="players-list">Selecione um time primeiro.</div>
        </section>

        <section style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="margin-top: 0;">Detalhes do jogador</h2>
          <div id="player-details" style="color: #555;">Clique em um jogador para visualizar os detalhes.</div>
        </section>
      </main>
    </div>
  `;

  loadAllLeagueTeams();
}

async function loadAllLeagueTeams() {
  const selectEl = document.querySelector("#team-select");

  try {
    const res = await fetch(`${API_BASE}/search_all_teams.php?l=English_Premier_League`);
    const data = await res.json();
    const teams = data.teams || [];

    if (teams.length === 0) {
      selectEl.innerHTML = `<option value="">Nenhum time encontrado</option>`;
      return;
    }

    teams.sort((a, b) => a.strTeam.localeCompare(b.strTeam));

    selectEl.innerHTML = teams
      .map((team) => `<option value="${team.idTeam}">${team.strTeam}</option>`)
      .join("");

    selectEl.addEventListener("change", (e) => {
      loadTeamData(e.target.value);
    });

    loadTeamData(teams[0].idTeam);

  } catch (error) {
    console.error("Erro ao buscar a lista de times:", error);
    selectEl.innerHTML = `<option value="">Erro ao carregar times</option>`;
  }
}

async function loadTeamData(teamId) {
  const teamNameEl = document.querySelector("#team-name");
  const teamDetailsDiv = document.querySelector("#team-details");
  const playersListDiv = document.querySelector("#players-list");
  const playerDetailsDiv = document.querySelector("#player-details");
  const headerTitle = document.querySelector("#header-title");

  teamNameEl.textContent = "Carregando...";
  teamDetailsDiv.innerHTML = "<p>Carregando informações do time...</p>";
  playersListDiv.innerHTML = "<p>Carregando jogadores...</p>";
  playerDetailsDiv.innerHTML = "Clique em um jogador para visualizar os detalhes.";

  try {
    const teamRes = await fetch(`${API_BASE}/lookupteam.php?id=${teamId}`);
    const teamData = await teamRes.json();
    const team = teamData.teams ? teamData.teams[0] : null;

    if (team) {
      headerTitle.textContent = team.strTeam;
      teamNameEl.textContent = team.strTeam;

      teamDetailsDiv.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          ${team.strBadge ? `<img src="${team.strBadge}" alt="${team.strTeam}" style="width: 100px; height: auto;">` : ""}
          <div>
            <p><strong>País:</strong> ${team.strCountry || "N/A"}</p>
            <p><strong>Estádio:</strong> ${team.strStadium || "N/A"}</p>
            <p><strong>Fundação:</strong> ${team.intFormedYear || "N/A"}</p>
          </div>
        </div>
        <p style="margin-top: 15px; line-height: 1.5; color: #333;">
          ${team.strDescriptionPT || team.strDescriptionEN || "Sem descrição disponível."}
        </p>
      `;
    }

    const playersRes = await fetch(`${API_BASE}/lookup_all_players.php?id=${teamId}`);
    const playersData = await playersRes.json();
    currentPlayers = playersData.player || [];

    if (currentPlayers.length === 0) {
      playersListDiv.innerHTML = "<p>Nenhum jogador cadastrado para este time nesta API.</p>";
      return;
    }

    playersListDiv.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${currentPlayers
          .map(
            (p) => `
          <button 
            class="player-btn" 
            data-id="${p.idPlayer}"
            style="padding: 8px 14px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer; font-size: 0.95rem; transition: background 0.2s;"
            onmouseover="this.style.background='#ccc'"
            onmouseout="this.style.background='#e0e0e0'"
          >
            ${p.strPlayer} (${p.strPosition || "N/A"})
          </button>
        `
          )
          .join("")}
      </div>
    `;

    document.querySelectorAll(".player-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        showPlayerData(btn.dataset.id);
      });
    });

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    teamDetailsDiv.innerHTML = "<p style='color: red;'>Erro ao carregar informações do time.</p>";
    playersListDiv.innerHTML = "<p style='color: red;'>Erro ao carregar jogadores.</p>";
  }
}

function showPlayerData(playerId) {
  const player = currentPlayers.find((p) => p.idPlayer === playerId);
  const playerDetailsDiv = document.querySelector("#player-details");

  if (!player) return;

  playerDetailsDiv.innerHTML = `
    <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start;">
      ${player.strCutout || player.strThumb ? `<img src="${player.strCutout || player.strThumb}" alt="${player.strPlayer}" style="width: 150px; border-radius: 8px;">` : ""}
      <div>
        <h3 style="margin: 0 0 10px 0;">${player.strPlayer}</h3>
        <p><strong>Posição:</strong> ${player.strPosition || "N/A"}</p>
        <p><strong>Nacionalidade:</strong> ${player.strNationality || "N/A"}</p>
        <p><strong>Data de Nascimento:</strong> ${player.strDateBorn || "N/A"}</p>
        <p><strong>Número da Camisa:</strong> ${player.strNumber || "N/A"}</p>
      </div>
    </div>
    ${player.strDescriptionPT || player.strDescriptionEN ? `
      <p style="margin-top: 15px; line-height: 1.5; color: #444;">
        ${player.strDescriptionPT || player.strDescriptionEN}
      </p>
    ` : ""}
  `;
}

initApp();