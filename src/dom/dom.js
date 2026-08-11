export function renderTeam(team, container) {
  container.innerHTML = `
    <div class="team-card">

      <img
        src="${team.strBadge}"
        alt="Escudo do ${team.strTeam}"
        class="team-badge"
      >

      <div>
        <h2>${team.strTeam}</h2>

        <p>
          🏆 ${team.strLeague || 'Futebol'}
        </p>

        <p>
           ${team.strStadium || 'Estádio não informado'}
        </p>

        <p>
           ${team.strLocation || 'inglaterra'}
        </p>
      </div>

    </div>
  `;
}

export function renderPlayers(players, container, onSelect) {
  container.innerHTML = '';

  if (!players.length) {
    container.innerHTML = `
      <p class="message">
        Nenhum jogador encontrado.
      </p>
    `;

    return;
  }

  players.forEach((player) => {
    const card = document.createElement('button');

    card.className = 'player-card';

    card.innerHTML = `
      <div class="player-image">

        ${
          player.strThumb
            ? `
              <img
                src="${player.strThumb}"
                alt="${player.strPlayer}"
              >
            `
            : ''
        }

      </div>

      <div class="player-info">

        <h3>
          ${player.strPlayer}
        </h3>

        <p>
          ${player.strPosition || 'Posição não informada'}
        </p>

        <span>
          ${player.strNationality || 'Nacionalidade não informada'}
        </span>

      </div>
    `;

    card.addEventListener('click', () => {
      onSelect(player);
    });

    container.appendChild(card);
  });
}

export function renderPlayerDetails(player, container) {
  container.innerHTML = `
    <div class="details-card">

      ${
        player.strThumb
          ? `
            <img
              src="${player.strThumb}"
              alt="${player.strPlayer}"
            >
          `
          : `
            <div class="details-placeholder">
              
            </div>
          `
      }

      <div class="details-content">

        <h2>
          ${player.strPlayer}
        </h2>

        <p>
          <strong>Posição:</strong>
          ${player.strPosition || 'Não informada'}
        </p>

        <p>
          <strong>Nacionalidade:</strong>
          ${player.strNationality || 'Não informada'}
        </p>

        <p>
          <strong>Data de nascimento:</strong>
          ${player.dateBorn || 'Não informada'}
        </p>

        <p>
          <strong>Altura:</strong>
          ${player.strHeight || 'Não informada'}
        </p>

        <p>
          <strong>Peso:</strong>
          ${player.strWeight || 'Não informado'}
        </p>

      </div>

    </div>
  `;
}

export function showLoading(container) {
  container.innerHTML = `
    <p class="loading">
      Carregando...
    </p>
  `;
}

export function showError(container, message) {
  container.innerHTML = `
    <p class="error">
      ${message}
    </p>
  `;
}