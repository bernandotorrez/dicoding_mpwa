const base_url = "https://api.football-data.org/v2";
const token = "37f0467b411a4834a7bc2bd0c148e467";
const competitionId = '2021';
const api_options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': token
    },
}

const fetchApi = (url) => {  
    return fetch(url, api_options); 
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getCompetitionStandings(callback) {
    const url_api = `${base_url}/competitions/${competitionId}/standings`;

    if ('caches' in window) {
        caches.match(url_api).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log('ambil dari cache')
                    viewHtmlStandings(data)
                })
            } else {
                fetchApi(url_api)
                    .then((response) => {
                        callback.success(response);
                        return status(response);
                    })
                    .then(json)
                    .then(viewHtmlStandings)
                    .catch(error);
            }
        })
    }
}

function viewHtmlStandings(data) {
    const standings = data.standings;
    let html = '';

    standings.forEach(function (standing) {
        html += `<div id="${standing.type.toLowerCase()}" class="col s12">`;
        html += `<div class="row">`;
        standing.table.forEach(function (table) {
            var crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'assets/images/default-team-badge.png';

            html += `<div class="col s12 l6">
            <div class="card hoverable horizontal">
                <div class="card-image waves-effect waves-block waves-light">
                    <img onerror="imgError(this)" class="badge" src="${crestUrl}">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <a href="match.html?id=${table.team.id}" class="card-title">${table.team.name}</a>
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
            </div>`;
        })

        html += `</div></div>`;

        var content = document.querySelector('#' + standing.type.toLowerCase());
        content.innerHTML = html;
    })
    
    
}

function getTeams(callback) {
    const url_api = `${base_url}/teams`;

    if ('caches' in window) {
        caches.match(url_api).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log('ambil dari cache')
                    viewHtmlTeams(data)
                })
            } else {
                fetchApi(url_api)
                .then((response) => {
                    callback.success(response);
                    return status(response);
                })
                .then(json)
                .then(viewHtmlTeams)
                .catch(error);
                    }
        })
    }
}

function getById(id) {
    return new Promise(function(resolve, reject) {
      dbPromise
        .then(function(db) {
          var tx = db.transaction("team_favorite", "readonly");
          var store = tx.objectStore("team_favorite");
          return store.get(id);
        })
        .then(function(team) {
          resolve(team);
        });
    });
  }

function viewHtmlTeams(data) {
    
    var html = '<div class="container"><div class="row">';
    data.teams.forEach(async function(team) {

        var crestUrl = (team.crestUrl) ? forceHttps(team.crestUrl) : 'assets/images/default-team-badge.png';
        
        html += `<div class="col s6 m4 l3">
                <div class="card team hoverable">
                    <div class="card-image center waves-effect waves-block waves-light">
                        <img onerror="imgError(this)" src="${crestUrl}">
                        
                    </div>
                    <div class="card-content">
                        <a href="team.html?id=${team.id}" class="card-title truncate" title="${team.name}">${team.name}</a>
                    </div>
                </div>
            </div>`;
        
    });
    html += '</div></div>';
    document.querySelector('#body-content').innerHTML = html;
}

