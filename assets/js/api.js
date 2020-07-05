const base_url = "https://api.football-data.org/v2";
const token = "37f0467b411a4834a7bc2bd0c148e467";
const competitionId = '2021';
const api_options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': token
    },
}
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

function error(error) {
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
            var crestUrl = (table.team.crestUrl)?forceHttps(table.team.crestUrl) : 'images/default-team-badge.png';
    
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
                        <a class="btn-floating halfway-fab waves-effect waves-light second_color" id="${team.id}" onclick="addFavoriteTeam(this)"><i class="material-icons white-text">favorite</i></a>
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

function hideLoading() {
    var loading = document.querySelector('.loading-content');
    loading.classList.add('hide');
}