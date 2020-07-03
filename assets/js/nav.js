document.addEventListener('DOMContentLoaded', function () {

  const MSG_NOT_FOUND = 'Page not Found';
  const MSG_FORBIDDEN = 'Page cant be Accessed';
  const MSG_ERROR = 'Something wrong in Server';
  const MSG_NO_FAVORITE = 'Favorite teams is Empty';

  loadTopNav();
 
  function loadTopNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
   
        document.querySelectorAll(".topnav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
      }
    };
    xhttp.open("GET", "components/nav.html", true);
    xhttp.send();
  }

    function loadBottomNav(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status !== 200) return;
        var body = document.querySelector("body");
        body.insertAdjacentHTML('beforeend', xhttp.responseText);
        var elms = document.querySelectorAll('.bottom-navigation nav a, .topnav a');
        elms.forEach(elm => {
          elm.addEventListener('click', function (event) {
            elms.forEach(e => {
              e.classList.remove('active')
            });
            elm.classList.add('active');
            var page = event.target.getAttribute('href').substr(1);
            loadPage(page, callback);
          });
        });
  
        var page = window.location.hash.substr(1);
        if (page == '') page = 'standings';
        loadPage(page, callback);
  
        elms.forEach(elm => {
          if (elm.getAttribute('href').substr(1) === page) {
            elms.forEach(e => {
              e.classList.remove('active')
            });
            elm.classList.add('active');
          }
  
        });
      }
    };
    xhttp.open("GET", 'components/bottom-nav.html', true);
    xhttp.send();
  }

  function loadPage(page, callback) {
    var content = document.querySelector("#body-content");
    var loading = document.querySelector(".loading-content");
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      loading.classList.add("hide");
  
      if (this.readyState === 4) {
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
          callback.loaded(page);
        } else if (this.status === 404) {
          content.innerHTML = "<h5 class='center-content center'>"+MSG_NOT_FOUND+"</h5>";
        } else {
          content.innerHTML = "<h5 class='center-content center'"+MSG_FORBIDDEN+"</h5>";
        }
      }
    };
  
    xhttp.open("GET", 'pages/' + page + '.html', true);
    xhttp.send();
    loading.classList.remove("hide");
    content.innerHTML = "";
  }

    loadBottomNav({
      loaded: (page) => {
        var bodyContent = document.querySelector("#body-content > .container");
        var loading = document.querySelector(".loading-content");
        switch (page) {
          case 'standings':
            loading.classList.remove("hide");
            getCompetitionStandings({
              success: (response) => {
                if (response.status === 200) {
                  loading.classList.add("hide");
                  
                  var options = {
                  swipeable: true
                  }
                  var tabs = document.getElementById('tabs-swipe-demo');
                  M.Tabs.init(tabs, options);
                } else {
                  loading.classList.add("hide");
                  bodyContent.innerHTML =
                    "<h5 class='center-content center'>"+MSG_ERROR+"</h5>";
                }
              },
              error: (error) => {}
            });
            break;
          case 'teams':
            loading.classList.remove("hide");
            getTeams({
              success: (response) => {
                loading.classList.add("hide");
                if (response.status !== 200) {
                  bodyContent.innerHTML =
                    "<h5 class='center-content center'>"+MSG_ERROR+"</h5>";
                }
              },
              error: (error) => {}
            });
            break;
          case 'favorite':
            loading.classList.remove("hide");
            getAllFavorite({
              success: (response) => {
                loading.classList.add("hide");
                if (response === 0) {
                  bodyContent.innerHTML =
                    "<h5 class='center-content center'>"+MSG_NO_FAVORITE+"</h5>";
                }
              },
              error: (error) => {}
            })
            break;
        }
      }
    });
  });