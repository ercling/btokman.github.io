self.addEventListener('push', function ( event ) {
  const data = event.data.json()


  self.registration.pushManager.getSubscription().then(function ( s ) {
    var publicKey = btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('p256dh'))));
    var authToken = btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('auth'))));
    var endpoint = s.endpoint;

    var serverData = {
      endpoint: endpoint,
      publicKey: publicKey,
      authToken: authToken
    };

    console.log(serverData);
  });


  // data.notification.data = data.data
  // if (data.data.requireInteraction) {
  //     data.notification.requireInteraction = true
  // }
  // data.notification.data.url = data.notification.click_action
  //
  // if (data.notification.data.image) {
  //     data.notification.image = data.notification.data.image;
  // }
  //
  // console.log(data.notification);
  //
  // event.waitUntil(self.registration.showNotification(data.notification.title, data.notification))
  // // Track open
  // fetch('https://api.mailfire.io/v1/webpush/show/' + data.data.id, {
  //     method: 'post'
  // })
})

self.addEventListener('notificationclick', function ( event ) {
  event.notification.close()

  // Show page
  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(function () {
        return clients.openWindow(event.notification.data.url)
      })
  )
  // Track click
  fetch('https://api.mailfire.io/v1/webpush/click/' + event.notification.data.id, {
    method: 'post'
  })
})