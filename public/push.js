const webPush = require('web-push');

var vapidKeys = {
  publicKey: 'BOoI1XTif0AqzKsjuqcFMeWB3X8w_wZu1xQshIi9U14ukp33Xprf0a-w2M5nDp-_SvxhIQIlydcVQDHDGhtdjD0',
  privateKey: 'YZWVvfxqIk-smSUguKfHh-IfSdG5Fjn7YB4VGcDS9K4'
};

webPush.setVapidDetails(
  'mailto:mail.bernand@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/e3m0LYfxzFs:APA91bGxL_-jZTEG43V9LIDobj2wRafvJWKNwajUxRkuSX0KDsZvZOBxZlbtyIS009aIO642tPmjwArR8PNgGNtZ7vZncPKqEOQQuE6Toccy5Luk125Qs6xdImK_bue6jZqLOoPOR5Y1',
  keys: {
    p256dh: 'BDARi1nXs4erKdOoJPfmVEPtvyteVy21VYUR8Z7pU8Tpf49Rf0xrqW7F1UGiZGfQDHpiigkLVI93LISI+ArMOAI=',
    auth: 'xPlOSFScDCTaraO6c1nrzA=='
  }
};

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
  gcmAPIKey: '141117004195',
  TTL: 60
};
webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
