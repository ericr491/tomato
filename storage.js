String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

dictForUser = []
baseUrl = 'https://tomato-ext-backend.herokuapp.com/'

async function displayWebsites() {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    const res = await fetch(baseUrl + 'api/sites/', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
    })
    const json = await res.json()
    console.log(json)
    const sites = json.sites
    let string = ''
    chrome.storage.local.clear()
    for (let index in sites) {
      dictForUser.push(sites[index])
      const givenWebsite = sites[index].website
      const key = givenWebsite.hashCode().toString()
      string += givenWebsite + '\n'
      chrome.storage.local.set({ [key]: givenWebsite })
    }
    document.getElementById('websiteTextArea').value = string


  } else {
    chrome.storage.local.get(null, function (items) {
      let str = ""
      for (let property in items) {
        str += items[property] + '\n'
      }

      document.getElementById('websiteTextArea').value = str
      // console.log(items)
    })
  }
}

async function saveChanges() {
  var givenWebsite = document.getElementById('websiteText').value
  var elements = document.getElementsByName('addOrRemove')

  if (!givenWebsite) {
    alert('Error: No value specified')
    return;
  }

  var flag = elements[0].checked
  var key = givenWebsite.hashCode().toString()
  console.log(key)
  // add
  if (flag) {
    chrome.storage.local.set({ [key]: givenWebsite }, function () {
      alert('Settings saved')
    })
    // logon
    // i still need chrome.storage for the event listener! / offline option
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      const res = await fetch(baseUrl + 'api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        body: JSON.stringify({ 'website': givenWebsite })
      })
      console.log(res)
    }
  } else {
    chrome.storage.local.remove(key)
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      const foundObj = dictForUser.find(obj => obj.website === givenWebsite)
      const res = await fetch(baseUrl + `api/sites/${foundObj.id}`, {
        method: 'DELETE'
      })
      console.log(res)
    }

  }
  return false
}


document.getElementById('form1').onsubmit = saveChanges
displayWebsites()
