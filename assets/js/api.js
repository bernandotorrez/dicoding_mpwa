document.addEventListener('DOMContentLoaded', function () {
    getCompetitionStandings();
})

const base_url = "https://api.football-data.org/v2/";
const token = "37f0467b411a4834a7bc2bd0c148e467";
const competitionId = '2021';
const api_options = {
    method: 'GET',
    headers: {
        'X-Auth-Token': token
    },
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

function getCompetitionStandings() {
    const url_api = `${base_url}/competitions/${competitionId}/standings`;

    fetch(url_api, api_options)
        .then(status)
        .then(json)
        .then(function (response) {
            viewHtmlTotal(response);
            viewHtmlHome(response);
            viewHtmlAway(response);
        })
}

function viewHtml(data) {
    const home = document.getElementById('body-content');
    const standings = data.standings;
    let html = '';

    standings.forEach(function (standing) {
        html += `<div id="${standing.type.toLowerCase()}" class="col s12">`;
        html += `<div class="row">`;
        standing.table.forEach(function (table) {
            var crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'images/default-team-badge.png';

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

    })

    home.innerHTML = html;
}

function viewHtmlTotal(data) {
    const home = document.getElementById('total');
    const standings = data.standings[0];
    let html = '';

    html += `<div class="row">`;
    html += `<div id="${standings.type.toLowerCase()}" class="col s12 m12">`;
    standings.table.forEach(function (table) {
        var crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'images/default-team-badge.png';

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

    home.innerHTML = html;

}

function viewHtmlHome(data) {
    const home = document.getElementById('home');
    const standings = data.standings[1];
    let html = '';

    html += `<div class="row">`;
    html += `<div id="${standings.type.toLowerCase()}" class="col s12 m12">`;
    standings.table.forEach(function (table) {
        var crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'images/default-team-badge.png';

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

    home.innerHTML = html;

}

function viewHtmlAway(data) {
    const home = document.getElementById('away');
    const standings = data.standings[2];
    let html = '';

    html += `<div class="row">`;
    html += `<div id="${standings.type.toLowerCase()}" class="col s12 m12">`;
    standings.table.forEach(function (table) {
        var crestUrl = (table.team.crestUrl) ? forceHttps(table.team.crestUrl) : 'images/default-team-badge.png';

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

    home.innerHTML = html;

}