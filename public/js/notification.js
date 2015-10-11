define([], function()
{
  var getPermission = function() {
    if (!("Notification" in window)) {
      console.log('Notifications not supported');
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };
  var notify = function(message) {
    if (("Notification" in window) && Notification.permission === 'granted') {
      return new Notification(message);
    }
  };
  return {
    getPermission: getPermission,
    notify: notify
  };
});
