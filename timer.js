// these are not persistent like background.js b/c the script gets reload everytime popup.html is open/close, now it's persistent b/c we retrieve the date 
let intervalID
let date

// Auto-runs everytime popup.html is opened 
chrome.runtime.sendMessage({ msg: 'GET_TIME' }, (response) => {
    // If background.js sends a response back to this message, it will retrieve the timer that we already set previously

    // If timer is not null, so first createTimer() is called
    if (response.time) {
        date = new Date(response.time.valueOf())
        displayTimer(date)
    }
})

// We do not need to keep track of current time b/c it's automatically generated using Date.now()

function displayTimer(dateObj) {
    let desiredTime = new Date(dateObj.valueOf())

    intervalID = setInterval(function () {
        let currentTime = Date.now()
        let timeLeft = desiredTime - currentTime

        var hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        document.getElementById("hours").innerHTML = hours + "h "
        document.getElementById("mins").innerHTML = minutes + "m "
        document.getElementById("secs").innerHTML = seconds + "s "

        if (timeLeft < 0) {
            document.getElementById("hours").innerHTML = "0" + "h "
            document.getElementById("mins").innerHTML = "0" + "m "
            document.getElementById("secs").innerHTML = "0" + "s "
        }
    }, 1000)
}

function createTimer() {
    if (date == null || date - Date.now() <= 0) {
        clearInterval(intervalID)
        date = new Date()
        let port = chrome.runtime.connect({ name: 'createTimer' })
        port.postMessage({ message: 'START_TIME' })
        port.onMessage.addListener(function (msg) {
            if (msg.state === 'BLOCK_MODE') {
                // 30 minutes from now
                date.setTime(Date.now() + 1500000)
                port.postMessage({ when: date })
            } else if (msg.state === 'UNBLOCK_MODE') {
                // 5 minutes from now
                date.setTime(Date.now() + 300000)
                port.postMessage({ when: date })
            }
            displayTimer(date)
        })
        // Show the timer on popup.html
    } else {
        alert('Time is not up yet!')
    }
}


let button = document.createElement("button")
button.textContent = 'Start/Reset Timer'
button.style.height = "40px"
button.style.width = "85px"
button.style.textAlign = "center"
button.style.color = "black"
button.onclick = createTimer
document.getElementById('buttonbox').appendChild(button)
