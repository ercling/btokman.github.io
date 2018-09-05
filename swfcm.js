self.addEventListener('push', function (event) {
    const data = event.data.json()
    data.notification.data = data.data
    if (data.data.requireInteraction) {
        data.notification.requireInteraction = true
    }
    data.notification.data.url = data.notification.click_action

    event.waitUntil(self.registration.showNotification('Hi', {
        'image' : 'https://static-tuko.akamaized.net/0fgjhs64rmuljvdin.36cc39f5.jpg',

    }))
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
            .then(function() {
                return clients.openWindow(event.notification.data.url)
            })
    )
    // Track click
    fetch('https://api.mailfire.io/v1/webpush/click/' + event.notification.data.id, {
        method: 'post'
    })
})