document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();
   
    function loadNav() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status != 200) return;
     
          // Muat daftar tautan menu
          document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
            elm.innerHTML = xhttp.responseText;
          });
     
          // Daftarkan event listener untuk setiap tautan menu
          document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              // Tutup sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
     
              // Muat konten halaman yang dipanggil
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });

          });
        }
      };
      xhttp.open("GET", "components/nav.html", true);
      xhttp.send();
    }

    // Load page content
    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);
    
    function loadPage(page) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if(this.readyState == 1) {
            var content = document.querySelector("#body-content");
            showLoading(content);
          } else if (this.readyState == 4) {
          var content = document.querySelector("#body-content");
          if (this.status == 200) {
            content.innerHTML = xhttp.responseText;
          } else if (this.status == 404) {
            content.innerHTML = "<h3 class='header center light red-text'>Halaman tidak ditemukan</h3>";
          } else {
            content.innerHTML = "<h3 class='header center light red-text'>Halaman tidak dapat diakses</h3>";
          }
        }
      };
      xhttp.open("GET", "pages/" + page + ".html", true);
      xhttp.send();
    }

    function showLoading(content) {
        var html = `<div class="section no-pad-bot" id="index-banner">
        <div class="container">
         
          <div class="row center">
            <h3 class='header center light blue-text'>Mohon tunggu...</h3>
          </div>
        </div>
      </div>`;

      content.innerHTML = html;
    }
  });