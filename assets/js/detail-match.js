document.addEventListener('DOMContentLoaded', function () {
    const MSG_NOT_FOUND = 'Page not Found';
    const MSG_FORBIDDEN = 'Page cant be Accessed';
    const MSG_ERROR = 'Something wrong in Server';
    const MSG_NO_FAVORITE = 'Favorite teams is Empty';

    loadTopNav();

    function loadTopNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status != 200) return;

                document.querySelectorAll(".topnav").forEach(function (elm) {
                    elm.innerHTML = xhttp.responseText;
                });
            }
        };
        xhttp.open("GET", "components/detail-match-nav.html", true);
        xhttp.send();
    }

    
})