self.addEventListener('push', function (event) {
    const data = event.data.json()
    data.notification.data = data.data
    if (data.data.requireInteraction) {
        data.notification.requireInteraction = true
    }
    data.notification.data.url = data.notification.click_action

    if (data.notification.data.image) {
        data.notification.image = data.notification.data.image;
    }

    console.log(data.notification);

    event.waitUntil(self.registration.showNotification(data.notification.title, data.notification))
    // Track open
    fetch('https://api.mailfire.io/v1/webpush/show/' + data.data.id, {
        method: 'post'
    })
})

self.addEventListener('notificationclick', function (event) {
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