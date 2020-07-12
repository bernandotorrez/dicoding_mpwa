/* eslint-disable no-undef */
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

        loadPage('one-team');
      }
    };
    xhttp.open('GET', 'components/detail-match-nav.html', true);
    xhttp.send();
  }

  function loadPage(page) {
    const content = document.querySelector('#body-content');
    const loading = document.querySelector('.loading-content');
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      // loading.classList.add("hide");
      if (this.readyState === 4) {
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
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

    getDetailTeam();
  }
});
