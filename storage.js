String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function displayWebsites() {
    chrome.storage.local.get(null, function (items) {
        let str = ""
        for (let property in items) {
            str += items[property] + '\n'
        }

        document.getElementById('websiteTextArea').value = str
    })
}

function saveChanges() {
    var givenWebsite = document.getElementById('websiteText').value
    var elements = document.getElementsByName('addOrRemove')

    if (!givenWebsite) {
        alert('Error: No value specified')
        return;
    }

    var flag = elements[0].checked
    var key = givenWebsite.hashCode().toString()
    console.log(key)
    if (flag) {
        chrome.storage.local.set({ [key]: givenWebsite }, function () {
            alert('Settings saved')
        })
    } else {
        chrome.storage.local.remove(key)

    }

}

document.getElementById('form1').onsubmit = saveChanges
displayWebsites()