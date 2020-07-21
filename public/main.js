/* eslint-disable no-unused-vars */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function() {
        console.log('Service Worker Registered Successfully');
      })
      .catch(function() {
        console.log('Service Worker Failed to Register');
      });
  });
} else {
  console.log('Browser dont support Service Worker');
}

if ('Notification' in window) {
  Notification.requestPermission().then((result) => {
    if (result === 'denied') {
      console.log('Notification Feature is Denied');
    } else if (result === 'default') {
      console.error('User close the Box Permission');
    } else if (result === 'granted') {
      var url = window.location.href;
      if (url.indexOf('index.html') > -1) {
        // showNotifikasiBadge();
      }

      console.log('Notification Feature Granted');
    }
  });
} else {
  console.error("Browser don't Support Notification");
}

function showNotifikasiBadge() {
  const title = 'Welcome to English Premier League Application!';
  const options = {
    body: 'Hope you Enjoy to Use this Application',
    badge: '/icon.jpg',
    icon: '/icon.jpg',
    actions: [
      {
        action: 'no-action',
        title: 'Close Me'
      }
    ]
  };
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.showNotification(title, options);
    });
  } else {
    console.error('Notification Feature Granted');
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

navigator.serviceWorker.ready.then(() => {
  if (('PushManager' in window)) {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BOoI1XTif0AqzKsjuqcFMeWB3X8w_wZu1xQshIi9U14ukp33Xprf0a-w2M5nDp-_SvxhIQIlydcVQDHDGhtdjD0')
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
});
