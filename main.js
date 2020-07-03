if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function () {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function () {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

function forceHttps(text) {
  return text.replace(/^http:\/\//i, 'https://');
}


function imgError($this) {
  $this.setAttribute('src', 'assets/images/default-team-badge.png');
}