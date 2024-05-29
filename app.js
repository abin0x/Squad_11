const searchInput = document.getElementById('search-input');
const playerCards = document.getElementById('player-cards');
const playerCount = document.getElementById('player-count');
const groupedPlayers = document.getElementById('grouped-players');

let groupedPlayerList = [];

const fetchDefaultPlayers = () => {
  fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=A')
    .then(response => response.json())
    .then(data => {
      const players = data.player;
      displayPlayers(players);
    })
    .catch(error => console.error('Error fetching default players:', error));
};

const fetchSearchedPlayers = (query) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`)
    .then(response => response.json())
    .then(data => {
      const players = data.player;
      displayPlayers(players);
    })
    .catch(error => console.error('Error fetching searched players:', error));
};

const displayPlayers = (players) => {
  playerCards.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'row';

  players.forEach(player => {
    const card = document.createElement('div');
    card.className = 'card col-md-4 mb-3';
    
    card.innerHTML = `
      <img src="${player.strThumb || 'default-image.jpg'}" class="card-img-top" alt="${player.strPlayer}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="card-title">${player.strPlayer}</h5>
          <div class="social-links">
            <a href="${player.strFacebook || '#'}" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="${player.strInstagram || '#'}" target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        <p class="card-text">Country: ${player.strNationality}</p>
        <p class="card-text">Team: ${player.strTeam}</p>
        <p class="card-text">Sport: ${player.strSport}</p>
        <p class="card-text">Salary: ${player.strSigning || 'N/A'}</p>
        <p>Description: ${player.strDescriptionEN ? player.strDescriptionEN.slice(0,50) : 'No description available.'}</p>
        <div class="button-group">
          <div class="row">
            <div class="col">
              <button class="btn btn-primary" onclick="showDetails(${player.idPlayer})">Details</button>
            </div>
            <div class="col">
              <button class="btn btn-success" onclick="addToGroup('${player.strPlayer}')">Add to Group</button>
            </div>
          </div>
        </div>
      </div>
    `;
    row.appendChild(card);
  });
  playerCards.appendChild(row);
};




const showDetails = (playerId) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
    .then(response => response.json())
    .then(data => {
      const player = data.players[0];
      const playerDetails = `
        <p>Name: ${player.strPlayer}</p>
        <p>Country: ${player.strNationality}</p>
        <p>Team: ${player.strTeam}</p>
        <p>Sport: ${player.strSport}</p>
        <p>Salary: ${player.strSigning ? player.strSigning : 'N/A'}</p>
        <p>Description: ${player.strDescriptionEN ? player.strDescriptionEN : 'No description available.'}</p>
        <div class="social-links">
            <a href="${player.strFacebook || '#'}" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="${player.strInstagram || '#'}" target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
      `;
      document.getElementById('player-details').innerHTML = playerDetails;
      const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
      playerModal.show();
    })
    .catch(error => console.error('Error fetching player details:', error));
};

const addToGroup = (playerName) => {
  if (groupedPlayerList.length >= 11) {
    alert('Hey,Sorry you can add up to 11 players only!!!');
    return;
  }
  if (!groupedPlayerList.includes(playerName)) {
    groupedPlayerList.push(playerName);
    updateGroupedPlayers();
  }
  else {
    alert('Player is already added to the group!!');
  }
};

const updateGroupedPlayers = () => {
  playerCount.textContent = groupedPlayerList.length;
  groupedPlayers.innerHTML = '';
  groupedPlayerList.forEach(player => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = player;
    groupedPlayers.appendChild(li);
  });
};

const searchPlayers = () => {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    fetchSearchedPlayers(query);
  } else {
    fetchDefaultPlayers();
  }
};

fetchDefaultPlayers();
