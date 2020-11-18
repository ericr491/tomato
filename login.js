baseUrl = 'https://tomato-ext-backend.herokuapp.com/'

const register = async () => {
  usernameElement = document.getElementById('username')
  passwordElement = document.getElementById('password')
  if (usernameElement && passwordElement) {
    const username = usernameElement.value
    const password = passwordElement.value
    const response = await fetch(baseUrl + 'api/users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const result = await response.json()
    try {
      if (result.error) throw "error"
      alert('success')
    } catch (exception) {
      alert('username is taken')
    }
  }
}

const login = async () => {
  usernameElement = document.getElementById('username')
  passwordElement = document.getElementById('password')
  if (usernameElement && passwordElement) {
    const username = usernameElement.value
    const password = passwordElement.value
    const response = await fetch(baseUrl + 'api/login/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const result = await response.json()
    try {
      if (result.token && result.username) {
        alert('success!')
        console.log(result)
        localStorage.setItem('token', JSON.stringify(result.token))
        localStorage.setItem('user', JSON.stringify(result.username))
        hideLogin()
      } else {
        throw 'error'
      }
    } catch (exception) {
      alert('failed login')
    }
  }
}

const hideLogin = () => {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    form = document.getElementById('account')
    form.style.display = 'none'
    logoutElement = document.getElementById('logoutButton')
    logoutElement.style.display = ''
    logoutElement.addEventListener("click", () => {
      localStorage.clear()
      unhideLogin()
    })
    span = document.getElementsByTagName('span')[0]
    span.innerHTML = JSON.parse(localStorage.getItem('user')) + ' is logged in!'
  }

}

const unhideLogin = () => {
  form.style.display = ''
  logoutElement.style.display = 'none'
  span.style.display = 'none'
}

// on page load
document.addEventListener('DOMContentLoaded', () => {
  usernameElement = document.getElementById('username')
  passwordElement = document.getElementById('password')
  document.getElementById('account').onsubmit = () => false
  document.getElementById('registerButton').addEventListener("click", register);
  document.getElementById('loginButton').addEventListener("click", login);

  hideLogin()

})
