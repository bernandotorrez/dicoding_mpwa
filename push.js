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
  endpoint: 'https://fcm.googleapis.com/fcm/send/fm5N_QndMeY:APA91bGrsQ3Xl-8zWg1I0XywCVNxpFeNI5JzvD8oUYbk_SjlT7mOz3IVkRlLzGkn5ob_dOr_uCdh0vma8-A4XvGtC1ALolPAEz8dfxM6KTiWjPEgTsSMec9p6EVwKrCJ5OSTziTHxttv',
  keys: {
    p256dh: 'BBLCYZSGoqn4H9g7LnFuUHB7uaKAEe3fqt8m5aNn7/kfl/1HnMcmpa8hboXZKhL9cUrSeTlgszUvgk2+8TNTsjA',
    auth: 'TPHQuxm9eA+ZmX25ppTRyA=='
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
