/* eslint-disable no-undef */
/* eslint-disable padded-blocks */
document.addEventListener('DOMContentLoaded', function() {
  const MSG_NOT_FOUND = 'Page not Found';
  const MSG_FORBIDDEN = 'Page cant be Accessed';

  loadTopNav();

  function loadTopNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        document.querySelectorAll('.topnav').forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
      }
    };
    xhttp.open('GET', 'components/nav.html', true);
    xhttp.send();
  }

  function loadBottomNav(callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status !== 200) return;
        const body = document.querySelector('body');
        body.insertAdjacentHTML('beforeend', xhttp.responseText);
        const elms = document.querySelectorAll('.bottom-navigation nav a, .topnav a');
        elms.forEach(elm => {
          elm.addEventListener('click', function(event) {
            elms.forEach(e => {
              e.classList.remove('active');
            });
            elm.classList.add('active');
            const page = event.target.getAttribute('href').substr(1);
            loadPage(page, callback);
          });
        });

        let page = window.location.hash.substr(1);
        if (page === '') page = 'standings';
        loadPage(page, callback);

        elms.forEach(elm => {
          if (elm.getAttribute('href').substr(1) === page) {
            elms.forEach(e => {
              e.classList.remove('active');
            });
            elm.classList.add('active');
          }

        });
      }
    };
    xhttp.open('GET', 'components/bottom-nav.html', true);
    xhttp.send();
  }

  function loadPage(page, callback) {
    const content = document.querySelector('#body-content');
    const loading = document.querySelector('.loading-content');

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      loading.classList.add('hide');

      if (this.readyState === 4) {
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
          callback.loaded(page);
        } else if (this.status === 404) {
          content.innerHTML = "<h5 class='center-content center'>" + MSG_NOT_FOUND + '</h5>';
        } else {
          content.innerHTML = "<h5 class='center-content center'" + MSG_FORBIDDEN + '</h5>';
        }
      }
    };

    xhttp.open('GET', 'pages/' + page + '.html', true);
    xhttp.send();
    loading.classList.remove('hide');
    content.innerHTML = '';
  }

  loadBottomNav({
    loaded: (page) => {
      var loading = document.querySelector('.loading-content');
      switch (page) {
        case 'standings':
          loading.classList.remove('hide');
          getCompetitionStandings();
          break;
        case 'teams':
          loading.classList.remove('hide');
          getTeams();
          break;
        case 'favorite':
          loading.classList.remove('hide');
          getFavoritedTeam();
          break;
      }
    }
  });
});