import './style.css';

import {
  getLiverpool,
  getLiverpoolPlayers,
  getPlayerDetails
} from './api/api.js';

import {
  renderTeam,
  renderPlayers,
  renderPlayerDetails,
  showLoading,
  showError
} from './dom/dom.js';

document.querySelector('#app').innerHTML = `
  <header class="header">

    <div class="header-content">

      <div class="logo">
      </div>

      <div>
        <h1>LIVERPOOL</h1>
        <p>liverpool Explorer</p>
      </div>

    </div>

  </header>

  <main class="container">

    <section>

      <h2 class="section-title">
         Liverpool
      </h2>

      <div id="team">
        <p class="loading">
          Carregando informações do Liverpool...
        </p>
      </div>

    </section>

    <section>

      <h2 class="section-title">
         Jogadores
      </h2>

      <div id="players">
        <p class="loading">
          Carregando jogadores...
        </p>
      </div>

    </section>

    <section>

      <h2 class="section-title">
         Detalhes do jogador
      </h2>

      <div id="player-details">

        <p class="message">
          Clique em um jogador para visualizar os detalhes.
        </p>

      </div>

    </section>

  </main>

  
`;

const teamContainer =
  document.querySelector('#team');

const playersContainer =
  document.querySelector('#players');

const detailsContainer =
  document.querySelector('#player-details');

async function loadFlamengo() {
  try {
    showLoading(teamContainer);

    const team = await getFlamengo();

    if (!team) {
      throw new Error('Liverpool não encontrado.');
    }

    renderTeam(team, teamContainer);

  } catch (error) {
    console.error(error);

    showError(
      teamContainer,
      'Não foi possível carregar o Liverpool.'
    );
  }
}

async function loadPlayers() {
  try {
    showLoading(playersContainer);

    const players = await getLiverpoolPlayers();

    renderPlayers(
      players,
      playersContainer,
      selectPlayer
    );

  } catch (error) {
    console.error(error);

    showError(
      playersContainer,
      'Não foi possível carregar os jogadores.'
    );
  }
}

async function selectPlayer(player) {
  try {
    showLoading(detailsContainer);

    const details = await getPlayerDetails(
      player.idPlayer
    );

    renderPlayerDetails(
      details || player,
      detailsContainer
    );

    detailsContainer.scrollIntoView({
      behavior: 'smooth'
    });

  } catch (error) {
    console.error(error);

    showError(
      detailsContainer,
      'Não foi possível carregar os detalhes do jogador.'
    );
  }
}

loadLiverpool();
loadPlayers();