const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BPggIY3Cs6Ar0O5A1E_35mM7E1J4bHjCFEI9NksRrE0RSMgOSo7Iw2YyzmgwRADL4vO5OlgBkkeGuK7OPE6dc14',
  privateKey: 'Y47JxCVBmgN_WcgIFi2rmpqkBripUEzTc6GQaB6LL2o'
};

webPush.setVapidDetails(
  'mailto:mail.bernand@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dGk2dFZPSyA:APA91bEaELOG-4G7QuJv7YhHFU5Wb_ot1XNK9S9dwZd4mm85A2eieHYntsw0WuS9z9Gt4xmIIUjzSyIm2Fy5bZV8oulR4IIHUnvIunTrR8pYtQ5fGCa58pUDv1MZqxXq9UmRcSXYtaoJ',
  keys: {
    p256dh: 'BC2q66Kh4rSPQOr3VHXzWYvlo6MLI6cNiu0ZtKBPdSmTtaGH3I5RfarFc6OrucKiyELgsAGG5wbpOQWzhgOp+Qo=',
    auth: 'uCkGdtulTFIjW0n73r9c9A=='
  }
};

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
  gcmAPIKey: '489407451958',
  TTL: 60
};
webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
