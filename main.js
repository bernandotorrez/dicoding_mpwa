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

if ("Notification" in window) {
  Notification.requestPermission().then( (result) => {
      if (result === "denied") {
          console.log("Notification Feature is Denied");
          return;
      } else if (result === "default") {
          console.error("User close the Box Permission");
          return;
      } else if (result === 'granted') {
 
        console.log("Notification Feature Granted");
          
      }
      
  });
} else {
  console.error("Browser don't Support Notification");
}

function showNotifikasiBadge() {
  const title = 'Welcome to English Premier League Application!';
  const options = {
      'body': 'Hope you Enjoy to Use this Application',
      'badge': '/icon.jpg',
      'actions': [
        {
            'action': 'no-action',
            'title': 'Close Me',
        }
    ]
  };
  if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification(title, options);
      });
  } else {
      console.error('Fitur notifikasi tidak diijinkan.');
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if (('PushManager' in window)) {
  navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BPggIY3Cs6Ar0O5A1E_35mM7E1J4bHjCFEI9NksRrE0RSMgOSo7Iw2YyzmgwRADL4vO5OlgBkkeGuK7OPE6dc14')
      }).then(function(subscribe) {
          console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
          console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
          console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
      }).catch(function(e) {
          console.error('Tidak dapat melakukan subscribe ', e.message);
      });
  });
}