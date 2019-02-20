const BASE_URL = 'https://api.football-data.org/v2';
const TOKEN = 'fcb590fb87f3458abb83503edef488f1';
const getEl = id => document.getElementById(id);

function status(response) {
  if (response.status !== 200) {
    console.log("Error: " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error: " + error);
}

function getStandings() {
  // if ('caches' in window) {
  //   caches.match(`${BASE_URL}/competitions/2021/standings`).then(function(response) {
  //     if (response) json(response).then(function(resp) { renderTeam(resp); })
  //   });
  // }

  fetch(`${BASE_URL}/competitions/2021/standings`, {
    headers: { 'X-Auth-Token': TOKEN }
  })
    .then(status)
    .then(json)
    .then(function(response) { renderTeam(response); })
    .catch(error);
}

function renderTeam(data) {
  const { competition, season, standings } = data;
  const { area, name } = competition;
  const seasons = `${season.startDate.substr(0, 4)} - ${season.endDate.substr(0, 4)}`;
  const lastYear = standings.length - 1;
  let item = '';

  getEl('title').innerText = `Klasemen ${area.name} ${name} ${seasons}`;

  standings[lastYear].table.forEach(function(val) {
    const { team, points, playedGames, position } = val;
    const logo = team.crestUrl.replace(/^http:\/\//i, 'https://');
    item += `<li class="collection-item avatar" onclick="location.assign('team.html?id=${team.id}&position=${position}')">
      <img src="${logo}" alt="${team.name}" class="circle">
      <b class="title">${team.name}</b>
      <p>
        ${points} poin<br>
        ${playedGames} pertandingan
      </p>
      <a href="#!" class="secondary-content">${position}</a>
    </li>`;
  });

  getEl('standings').innerHTML = item;
}

function getTeamDetail() {
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("id");

  // if ('caches' in window) {
  //   caches.match(`${BASE_URL}/teams/${id}`).then(function(response) {
  //     if (response) json(response).then(function(data) { renderDetail(data); })
  //   });
  // }

  fetch(`${BASE_URL}/teams/${id}`, {
    headers: { 'X-Auth-Token': TOKEN }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      renderDetail(data);
    })
    .catch(error);
}
