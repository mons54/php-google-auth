const apiKey = 'AIzaSyDqJdjczT16RdchXyPG04z7rbyMZfsxKTw'
const clientId = '695188843140-i8clhg6on93u7gufg5k9nhv7npt0kr1q.apps.googleusercontent.com'

let auth
let user

function initGAuth () {
  auth = gapi.auth2.getAuthInstance()
  auth.isSignedIn.listen(loginStatus)
  loginStatus()
}

function loginStatus () {
  const isSignedIn = auth.isSignedIn.get()
  if (isSignedIn) {

    user = auth.currentUser.get()

    const idToken = user.getAuthResponse().id_token

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        const response = JSON.parse(this.response)
        window.location.href = 'profile.php'
      }
    }
    xhr.open('POST', 'google.php', true)
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded")
    xhr.send(`id_token=${idToken}`)
  }
}

function loginGoogle () {
  auth.signIn()
}

function logoutGoogle () {
  auth.signOut().then(() => {
    auth.disconnect()
    auth.isSignedIn.set(null)
    window.location.href = 'logout.php'
  });
}

if (typeof gapi === 'object' && gapi.load) {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
      scope: 'profile',
    }).
    then(initGAuth)
  })
}
