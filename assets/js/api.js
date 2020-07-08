const base_url = "https://api.football-data.org/v2";
const token = "37f0467b411a4834a7bc2bd0c148e467";
const competitionId = '2021';
const api_options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': token
    },
}
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const colors = [
    "red", "green", "orange", "grey", "blue"
];

const MSG_NOT_FOUND = 'Page not Found';
const MSG_FORBIDDEN = 'Page cant be Accessed';
const MSG_ERROR = 'Ooops, Something went wrong';
const MSG_NO_FAVORITE = 'Favorite teams is Empty';

const fetchApi = (url) => {
    return fetch(url, api_options);
}

function status(response) {
    var bodyContent = document.querySelector("#body-content > .container");
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        bodyContent.innerHTML = "<h5 class='center-content center'>" + MSG_ERROR + "</h5>";
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error() {
    document.querySelector('#body-content').innerHTML = "<h5 class='center-content center'>" + MSG_ERROR + "</h5>";
    hideLoading();
}

function getCompetitionStandings() {
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
                    .then(status)
                    .then(json)
                    .then(viewHtmlStandings)
                    .catch(error);
            }
        })
    }
}

function viewHtmlStandings(data) {
    const {standings} = data;
    standings.forEach(function (standing) {
        var html = `<div class="row">`;
        standing.table.forEach(function (table) {
            var crestUrl = (table.team.crestUrl)?forceHttps(table.team.crestUrl) : 'assets/images/default-team-badge.png';
    
            html += `<div class="col s12 l6">
            <div class="card hoverable horizontal">
                <div class="card-image waves-effect waves-block waves-light">
                    <img onerror="imgError(this)" class="badge" src="${crestUrl}">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <a href="detail-match.html?id=${window.btoa(table.team.id)}" class="card-title">${table.team.name}</a>
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

        });
        html += '</div>';
    
        var content = document.querySelector('#' + standing.type.toLowerCase());
        content.innerHTML = html;
    });

    standings[0].table.forEach(function(table) {
        dbStanding.get(table.team.id).then(function(data) {
            if(!data) {
                var crestUrl = (table.team.crestUrl)?forceHttps(table.team.crestUrl) : 'assets/images/default-team-badge.png';
                dbStanding.insert({
                    id: table.team.id,
                    name: table.team.name,
                    image: crestUrl
                })
            }
        })
    })

    var options = {
        swipeable: true
    }
    var tabs = document.getElementById('tabs-swipe-demo');
    M.Tabs.init(tabs, options);

    hideLoading();
}

async function getTeams() {
    const url_api = `${base_url}/teams`;
    const db = await getTeamFromDb();

    if (db.length > 0) {
        viewHtmlTeamsDb(db);
    } else {
        fetchApi(url_api)
            .then(status)
            .then(json)
            .then(viewHtmlTeamsApi)
            .catch(error);
    }
}

function viewHtmlTeamsApi(data) {

    var html = '<div class="container"><div class="row">';
    data.teams.forEach(function (team) {

        var crestUrl = (team.crestUrl) ? forceHttps(team.crestUrl) : 'assets/images/default-team-badge.png';

        html += `<div class="col s6 m4 l3">
                <div class="card team hoverable">
                    <div class="card-image center waves-effect waves-block waves-light">
                        <img onerror="imgError(this)" src="${crestUrl}">
                        
                    </div>
                    <div class="card-content">
                        <a href="team.html?id=${team.id}" class="card-title truncate" title="${team.name}">${team.name}</a>
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

    var html = '<div class="container"><div class="row">';

    data.forEach(function (team) {
        let favorited = '';
        if (team.flag_favorite == 0) {
            favorited = 'white-text';
        } else {
            favorited = 'navy-text';
        }
        var crestUrl = (team.image) ? forceHttps(team.image) : 'assets/images/default-team-badge.png';

        html += `<div class="col s6 m4 l3">
                <div class="card team hoverable">
                    <div class="card-image center waves-effect waves-block waves-light">
                        <img onerror="imgError(this)" src="${crestUrl}">
                        
                    </div>
                    <div class="card-content">
                        <a href="team.html?id=${team.id}" class="card-title truncate" title="${team.name}">${team.name}</a>
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

    var html = '<div class="container"><div class="row">';

    if (data.length == 0) {
        document.querySelector('#body-content').innerHTML = "<h5 class='center-content center'>" + MSG_NO_FAVORITE + "</h5>";
    } else {
        data.forEach(function (team) {
            let favorited = '';
            if (team.flag_favorite == 0) {
                favorited = 'white-text';
            } else {
                favorited = 'navy-text';
            }
            var crestUrl = (team.image) ? forceHttps(team.image) : 'assets/images/default-team-badge.png';

            html += `<div class="col s6 m4 l3">
                    <div class="card team hoverable">
                        <div class="card-image center waves-effect waves-block waves-light">
                            <img onerror="imgError(this)" src="${crestUrl}">
                            
                        </div>
                        <div class="card-content">
                            <a href="team.html?id=${team.id}" class="card-title truncate" title="${team.name}">${team.name}</a>
                            <a class="btn-floating halfway-fab waves-effect waves-light second_color" id="${team.id}" onclick="addFavoriteTeam(this)"><i class="material-icons ${favorited}">favorite</i></a>
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
    var url = new URLSearchParams(window.location.search);
    var id = window.atob(url.get("id"));
    if (!id) {
        return error();
    }

    var loading = document.querySelector(".loading-content");
    loading.classList.remove('hide')

    const url_api = `${base_url}/teams/${id}/matches`;
    if ('caches' in window) {
        caches.match(url_api).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log('ambil dari cache detail match')
                    viewHtmlDetailMatch(data)
                })
            } else {
                fetchApi(url_api)
                .then(status)
                .then(json)
                .then(viewHtmlDetailMatch)
                .catch(error);
            }
        })
    }

    
   
        dbStanding.get(parseInt(id)).then((team) => {
            var content = document.querySelector('.team-detail');
            content.innerHTML = `<div class="badge-team">
            <img onerror="imgError(this)" class="responsive-img" src="${team.image}">
          </div>
          <div class="detail">
            <span>${team.name}</span>
            <a href="#" class="star hide-on-med-and-down"><i class="material-icons"></i></div></a>`;
        });
}

function viewHtmlDetailMatch(data) {
    data.matches.forEach(match => {
        var scoreHome = (match.score.fullTime.homeTeam == null) ? '-' : match.score.fullTime.homeTeam;
        var scoreAway = (match.score.fullTime.awayTeam == null) ? '-' : match.score.fullTime.awayTeam;
        var date = new Date(match.utcDate);

        var html = `<div class="col s12 m12 l6 center">
        <div class="card hoverable horizontal match">
        <div class="card-image left waves-effect waves-block waves-light">
            <img onerror="imgError(this)" class="badge" data-team="${match.homeTeam.id}" src="assets/images/default-team-badge.png">
            <a href="team.html?id=${match.homeTeam.id}" class="title truncate navy-text">${match.homeTeam.name}</a>
        </div>
        <div class="card-stacked">
          <div class="card-content center">
            <span class="date white-text" date="${match.utcDate}">${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}</span>
            <time class="white-text">${date.getHours()}:${date.getMinutes()}</time>
            <h3 class="score white-text hide-on-med-and-down">${scoreHome} : ${scoreAway}</h3>
            <h5 class="score show-on-small white-text">${scoreHome} : ${scoreAway}</h5>
          </div>
        </div>
        <div class="card-image right waves-effect waves-block waves-light">
            <img onerror="imgError(this)" class="badge" data-team="${match.awayTeam.id}" src="assets/images/default-team-badge.png">
            <a href="team.html?id=${match.awayTeam.id}" class="title truncate navy-text">${match.awayTeam.name}</a>
        </div>
    </div></div>`;
       
        if (parseInt(match.competition.id) == parseInt(competitionId)) {
            
            var content = document.querySelector('#' + match.status.toLowerCase() + ' > .row');
            
            if (content) {
                content.innerHTML = (match.status.toLowerCase() === 'finished') ? html + content.innerHTML : content.innerHTML + html;
            }
        }
    });
   
    document.querySelectorAll('img.badge').forEach(elm => {
        if (elm.dataset.team) {
            dbStanding.get(parseInt(elm.dataset.team)).then((item) => {
                if (item) {
                    elm.setAttribute('src', item.image);
                }
            });
        }
    });

    var options = {
        swipeable: true
    }
    var tabs = document.getElementById('tabs-swipe-demo');
    M.Tabs.init(tabs, options);

    hideLoading();
}