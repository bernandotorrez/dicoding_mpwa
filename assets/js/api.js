document.addEventListener('DOMContentLoaded', function () {
    getClassmen();
})

var base_url = "https://api.football-data.org/v2/";
var token = "37f0467b411a4834a7bc2bd0c148e467";
async function getData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(base_url + url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'X-Auth-Token': token
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getClassmen() {
    getData('competitions/2021/standings')
        .then(function (response) {
            const {
                competition,
                standings
            } = response;
            const total = standings[0];
            const home = standings[1];
            const away = standings[2];
     
            let body_content = document.getElementById('body-content');

            let total_table_html;
            total.table.forEach(function(table) {
                let team = table.team.name;
                let team_image = table.team.crestUrl;
                total_table_html += `
                <div class="row">
                    <div class="col s12 m6">
                    <div class="card">
                        <div class="card-image">
                        <img src="${team_image}">
                        <span class="card-title">${team}</span>
                        </div>
                        <div class="card-content">
                        <p>I am a very simple card. I am good at containing small bits of information.
                        I am convenient because I require little markup to use effectively.</p>
                        </div>
                        <div class="card-action">
                        <a href="#">This is a link</a>
                        </div>
                    </div>
                    </div>

                    <div class="col s12 m6">
                    <div class="card">
                        <div class="card-image">
                        <img src="${team_image}">
                        <span class="card-title">${team}</span>
                        </div>
                        <div class="card-content">
                        <p>I am a very simple card. I am good at containing small bits of information.
                        I am convenient because I require little markup to use effectively.</p>
                        </div>
                        <div class="card-action">
                        <a href="#">This is a link</a>
                        </div>
                    </div>
                    </div>
                </div>
                `
            })

            body_content.innerHTML = total_table_html;
        })
}