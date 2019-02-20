const webPush = require('web-push');
const pushSubscription = {
  endpoint: "https://android.googleapis.com/gcm/send/f8kPr_JzfbI:APA91bEPS_8UTIdVuTEtkfBOaEujERl0CSj3z6EOclYtSLvDsjaqQjVASMnzIyB7-2r9vfrKmnQOqfKJ97CkqH17elXuDWs175d9DQNx_ZZeGmCm07L0MIqbhUJGhxsatZAEBLhLscMv",
  keys: {
    p256dh: "BELODGFqBbKtQiJ6UPQay/Kr7DO7CjStY+y/yFbO6IBT0AOzEO8oGrUerlEwIGB59ohfhOvBgUoxnHn5WDS8EfA=",
    auth: "3OAZmhTOS5UENYEookXDZw=="
  }
};

const payload = 'Pesan push dengan data payload!';
const options = {
  gcmAPIKey: 'AIzaSyBVNCSsu_E1_asq-TbqK63300VQjTWyC1Y',
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
