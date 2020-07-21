/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const baseUrl = 'https://api.football-data.org/v2';
const token = '37f0467b411a4834a7bc2bd0c148e467';
const competitionId = '2021';
const apiOptions = {
  method: 'GET',
  headers: {
    'X-Auth-Token': token
  }
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MSG_ERROR = 'Ooops, Something went wrong';
const MSG_NO_FAVORITE = 'Favorite teams is Empty';

const fetchApi = (url) => {
  return fetch(url, apiOptions);
};

function status(response) {
  const bodyContent = document.querySelector('#body-content > .container');
  if (response.status !== 200) {
    console.log('Error : ' + response.status);
    bodyContent.innerHTML = "<h5 class='center-content center'>" + MSG_ERROR + '</h5>';
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error() {
  document.querySelector('#body-content').innerHTML = `<h5 class='center-content center'>${MSG_ERROR}</h5>`;
  hideLoading();
}

function getCompetitionStandings() {
  const urlApi = `${baseUrl}/competitions/${competitionId}/standings`;

  if ('caches' in window) {
    caches.match(urlApi).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          console.log('ambil dari cache');
          viewHtmlStandings(data);
        });
      } else {
        fetchApi(urlApi)
          .then(status)
          .then(json)
          .then(viewHtmlStandings)
          .catch(error);
      }
    });
  }
}

function viewHtmlStandings(data) {
  const { standings } = data;
  standings.forEach(function(standing) {
    let html = '<div class="row">';
    standing.table.forEach(function(table) {
      const crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'assets/images/default-team-badge.png';

      let team_name = table.team.name;

      if (team_name.length >= 20) {
        team_name = team_name.substring(0, 15) + '...';
      }

      html += `<div class="col s12 l6">
            <a href="detail-match.html?id=${window.btoa(table.team.id)}" class="card-title">
            <div class="card hoverable horizontal">
                <div class="card-image waves-effect waves-block waves-light">
                    <img onerror="imgError(this)" class="badge" src="${crestUrl}">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <div class="card-title hide-on-med-and-down">${team_name}</div>

                        <div class="card-title hide-on-large-only">${table.team.name}</div>
                        <ul>
                            <li><div title="Matches Played" class="white-text">MP</div><div class="val white-text text-center">${table.playedGames}</div></li>
                            <li><div title="Won" class="white-text">W</div><div class="val white-text">${table.won}</div></li>
                            <li><div title="Draw" class="white-text">D</div><div class="val white-text">${table.draw}</div></li>
                            <li><div title="Lost" class="white-text">L</div><div class="val white-text">${table.lost}</div></li>
                            <li><div title="Goal For" class="white-text">GF</div><div class="val white-text">${table.goalsFor}</div></li>
                            <li><div title="Goal Against" class="white-text">GA</div><div class="val white-text">${table.goalsAgainst}</div></li>
                            <li><div title="Points" class="white-text">Pts</div><div class="val white-text">${table.points}</div></li>
                        </ul>
                    </div>
                </div>
            </div>
            </a>
            </div>`;
    });
    html += '</div>';

    const content = document.querySelector('#' + standing.type.toLowerCase());
    content.innerHTML = html;
  });

  standings[0].table.forEach(function(table) {
    dbStanding.get(table.team.id).then(function(data) {
      if (!data) {
        const crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'assets/images/default-team-badge.png';
        dbStanding.insert({
          id: table.team.id,
          name: table.team.name,
          image: crestUrl
        });
      }
    });
  });

  const options = {
    swipeable: true
  };
  const tabs = document.getElementById('tabs-swipe-demo');
  M.Tabs.init(tabs, options);

  hideLoading();
}

async function getTeams() {
  const urlApi = `${baseUrl}/teams`;
  const db = await getTeamFromDb();

  if (db.length > 0) {
    console.log('ambil data dari db');
    viewHtmlTeamsDb(db);
  } else {
    fetchApi(urlApi)
      .then(status)
      .then(json)
      .then(viewHtmlTeamsApi)
      .catch(error);
  }
}

function viewHtmlTeamsApi(data) {
  let html = '<div class="container"><div class="row">';
  data.teams.forEach(function(team) {
    const crestUrl = (team.crestUrl) ? forceHttps(team.crestUrl) : 'assets/images/default-team-badge.png';

    html += `<div class="col s6 m4 l3">
                <div class="card team hoverable">
                    
                    <div class="card-image center waves-effect waves-block waves-light">
                      <a href="detail-team.html?id=${window.btoa(team.id)}">
                        <img onerror="imgError(this)" src="${crestUrl}">
                      </a>   
                    </div>
                 
                    <div class="card-content">
                        <a href="detail-team.html?id=${window.btoa(team.id)}" class="card-title truncate" title="${team.name}">${team.name}</a>
                        <a class="btn-floating halfway-fab waves-effect waves-light second_color" id="${team.id}" onclick="addFavoriteTeam(this)"><i class="material-icons white-text team">favorite</i></a>
                    </div>
                </div>
            </div>`;

    dbTeam.get(team.id).then((t) => {
      if (!t) {
        dbTeam.insert({
          id: team.id,
          name: team.name,
          image: (team.crestUrl) ? crestUrl : null,
          flag_favorite: 0,
          created: new Date().getTime()
        });
      } else if (!t.image) {
        dbTeam.update({
          id: team.id,
          name: team.name,
          image: (team.crestUrl) ? crestUrl : null,
          flag_favorite: t.flag_favorite,
          created: new Date().getTime()
        });
      }
    });
  });
  html += '</div></div>';
  document.querySelector('#body-content').innerHTML = html;

  hideLoading();
}

function viewHtmlTeamsDb(data) {
  let html = '<div class="container"><div class="row">';

  data.forEach(function(team) {
    let favorited = '';
    if (team.flag_favorite === 0) {
      favorited = 'white-text';
    } else {
      favorited = 'navy-text';
    }

    const crestUrl = (team.image) ? forceHttps(team.image) : 'assets/images/default-team-badge.png';

    html += `<div class="col s6 m4 l3">
                <div class="card team hoverable">
                  
                  <div class="card-image center waves-effect waves-block waves-light">
                      <a href="detail-team.html?id=${window.btoa(team.id)}">
                        <img onerror="imgError(this)" src="${crestUrl}">
                      </a> 
                  </div>
                  
                    <div class="card-content">
                        <a href="detail-team.html?id=${window.btoa(team.id)}" class="card-title truncate" title="${team.name}">${team.name}</a>
                        <a class="btn-floating halfway-fab waves-effect waves-light second_color" id="${team.id}" onclick="addFavoriteTeam(this)"><i class="material-icons ${favorited}">favorite</i></a>
                    </div>
                </div>
            </div>`;
  });
  html += '</div></div>';
  document.querySelector('#body-content').innerHTML = html;

  hideLoading();
}

async function getFavoritedTeam() {
  const db = await getFavoritedTeamFromDb(1);

  viewHtmlFavoritedTeam(db);
}

function viewHtmlFavoritedTeam(data) {
  let html = '<div class="container"><div class="row">';
  
  if (data.length === 0) {
    document.querySelector('#body-content').innerHTML = "<h5 class='center-content center'>" + MSG_NO_FAVORITE + '</h5>';
  } else {
    data.forEach(function(team) {
      let favorited = '';
      if (team.flag_favorite === 0) {
        favorited = 'white-text';
      } else {
        favorited = 'navy-text';
      }

      const crestUrl = (team.image) ? forceHttps(team.image) : 'assets/images/default-team-badge.png';
      const id = window.btoa(team.id);
      html += `<div class="col s6 m4 l3">
                    <div class="card team hoverable">
                        <div class="card-image center waves-effect waves-block waves-light">
                            <a href="detail-team.html?id=${id}">
                              <img onerror="imgError(this)" src="${crestUrl}">
                            </a>
                        </div>
                        <div class="card-content">
                            <a href="detail-team.html?id=${id}" class="card-title truncate" title="${team.name}">${team.name}</a>
                            <a class="btn-floating halfway-fab waves-effect waves-light second_color" id="${team.id}" onclick="removeFavoritedTeam(this)"><i class="material-icons ${favorited}">favorite</i></a>
                        </div>
                    </div>
                </div>`;
    });
    html += '</div></div>';
    document.querySelector('#body-content').innerHTML = html;
  }

  hideLoading();
}

function getDetailMatch() {
  const url = new URLSearchParams(window.location.search);
  const id = window.atob(url.get('id'));
  if (!id) {
    return error();
  }

  const loading = document.querySelector('.loading-content');
  loading.classList.remove('hide');

  const urlApi = `${baseUrl}/teams/${id}/matches`;
  if ('caches' in window) {
    caches.match(urlApi).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          console.log('ambil dari cache detail match');
          viewHtmlDetailMatch(data);
        });
      } else {
        fetchApi(urlApi)
          .then(status)
          .then(json)
          .then(viewHtmlDetailMatch)
          .catch(error);
      }
    });
  }
}

function viewHtmlDetailMatch(data) {
  const url = new URLSearchParams(window.location.search);
  const id = window.atob(url.get('id'));

  data.matches.forEach(match => {
    const scoreHome = (match.score.fullTime.homeTeam == null) ? '-' : match.score.fullTime.homeTeam;
    const scoreAway = (match.score.fullTime.awayTeam == null) ? '-' : match.score.fullTime.awayTeam;
    const date = new Date(match.utcDate);

    const html = `<div class="col s12 m12 l6 center">
        <div class="card hoverable horizontal match">
        <div class="card-image left waves-effect waves-block waves-light">
            <img onerror="imgError(this)" class="badge" data-team="${match.homeTeam.id}" src="assets/images/default-team-badge.png">
            <a href="team.html?id=${match.homeTeam.id}" class="title truncate navy-text">${match.homeTeam.name}</a>
        </div>
        <div class="card-stacked">
          <div class="card-content center">
            <span class="date white-text" date="${match.utcDate}">${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}</span>
            <time class="white-text">${date.getHours()}:${date.getMinutes()}</time>
            <h3 class="score white-text hide-on-small-only">${scoreHome} : ${scoreAway}</h3>
            <h5 class="score hide-on-med-and-up white-text">${scoreHome} : ${scoreAway}</h5>
          </div>
        </div>
        <div class="card-image right waves-effect waves-block waves-light">
            <img onerror="imgError(this)" class="badge" data-team="${match.awayTeam.id}" src="assets/images/default-team-badge.png">
            <a href="team.html?id=${match.awayTeam.id}" class="title truncate navy-text">${match.awayTeam.name}</a>
        </div>
    </div></div>`;

    if (parseInt(match.competition.id) === parseInt(competitionId)) {
      const content = document.querySelector('#' + match.status.toLowerCase() + ' > .row');

      if (content) {
        content.innerHTML = (match.status.toLowerCase() === 'finished') ? html + content.innerHTML : content.innerHTML + html;
      }
    }
  });

  dbStanding.get(parseInt(id)).then((team) => {
    const image = (team.image) ? forceHttps(team.image) : 'assets/images/default-team-badge.png';
    const content = document.querySelector('.team-detail');
    content.innerHTML = `<div class="badge-team">
            <img onerror="imgError(this)" class="responsive-img" src="${image}">
          </div>
          <div class="detail">
            <span>${team.name}</span>
            <a href="#" class="star hide-on-med-and-down"><i class="material-icons"></i></div></a>`;
  });

  document.querySelectorAll('img.badge').forEach(elm => {
    if (elm.dataset.team) {
      dbStanding.get(parseInt(elm.dataset.team)).then((item) => {
        if (item) {
          elm.setAttribute('src', item.image);
        } else {
          elm.setAttribute('src', 'assets/images/default-team-badge.png');
        }
      });
    }
  });

  const options = {
    swipeable: true
  };

  const tabs = document.getElementById('tabs-swipe-demo');
  M.Tabs.init(tabs, options);

  hideLoading();
}

function getDetailTeam() {
  const url = new URLSearchParams(window.location.search);
  const id = window.atob(url.get('id'));
  if (!id) {
    return error();
  }

  const loading = document.querySelector('.loading-content');

  loading.classList.remove('hide');

  const urlApi = `${baseUrl}/teams/${id}`;
  if ('caches' in window) {
    caches.match(urlApi).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          console.log('ambil dari cache detail team');
          viewHtmlDetailTeam(data);
        });
      } else {
        fetchApi(urlApi)
          .then(status)
          .then(json)
          .then(viewHtmlDetailTeam)
          .catch(error);
      }
    });
  }
}

function viewHtmlDetailTeam(data) {
  const content = document.querySelector('#body-content');
  let html = '';
  const image = (data.crestUrl) ? forceHttps(data.crestUrl) : 'assets/images/default-team-badge.png';
  const phone = (data.phone) ? (data.phone) : '';
  const email = (data.email) ? (data.email) : '';
  html += `
        <div class="nav-content container">
            <div class="row">
            <div class="col s12 m12 l12 center">
                <div class="team-detail"><div class="badge-team">
                    <img onerror="imgError(this)" class="responsive-img" src="${image}">
                    </div>
                    <div class="detail">
                    <span>${data.name}</span>
                    <a href="#" class="star hide-on-med-and-down"><i class="material-icons"></i></a></div></div>
            </div>
            </div>
         
            <div class="col s12 m12">
                <ul id="contact" class="collection with-header" style="border: 2px solid navy; border-radius: 8px">
                    <li class="collection-header white-text text-center center" style="background-color: var(--primaryColor) !important; border-radius: 8px;"><h5>Contact</h5></li>
                    <li class="collection-item"><div><strong>Address</strong><span class="secondary-content navy-text"><u>${data.address}</u></span></div></li> 
                    <li class="collection-item"><div><strong>Phone</strong><a href="tel:${phone}" class="secondary-content navy-text"><u>${phone}</u></a></div></li> 
                    <li class="collection-item"><div><strong>Email</strong><a href="mailto:${email}" class="secondary-content navy-text"><u>${email}</u></a></div></li> 
                    <li class="collection-item"><div><strong>Website</strong><a href="${data.website}" class="secondary-content navy-text" target="_blank"><u>${data.website}</u></a></div></li>
                    </ul>
            </div>

            <div class="col s12 m12">
                <ul id="player" class="collection with-header" style="border: 2px solid navy; border-radius: 8px">
                    <li class="collection-header white-text text-center center" style="background-color: var(--primaryColor) !important; border-radius: 8px;"><h5>Player</h5></li>

                    `;
                    
            data.squad.forEach(function(player) {
                if (player.role === 'PLAYER') {
                const shirtNumber = (player.shirtNumber) ? (player.shirtNumber) : '';
                html += `<li class="collection-item avatar">
                            <i class="material-icons circle secondary-color-text" style="background-color: var(--primaryColor)">people</i>
                            <span class="title navy-text"><strong>${player.name} (${shirtNumber})</strong></span>
                            <p>${player.position}</p>
                        </li>`;
                }
            });

            data.squad.forEach(function(player) {
              if (player.role === 'COACH') {
              html += `<li class="collection-item avatar">
                          <i class="material-icons circle navy-text" style="background-color: var(--secondaryColor)">people</i>
                          <span class="title navy-text"><strong>${player.name}</strong></span>
                          <p>${player.role}</p>
                      </li>`;
              }
          });

                `</ul>
            </div>
            
        </div>
        `;
                content.innerHTML = html;

                hideLoading();
}
