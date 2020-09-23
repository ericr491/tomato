let blockList = []
let block = false
const BLOCK_STATE = 'BLOCK_MODE'
const UNBLOCK_STATE = 'UNBLOCK_MODE'


chrome.storage.local.get(null, function (items) {
    for (let keys in items) {
        blockList.push(items[keys])
    }
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key]
        blockList.push(storageChange.newValue)
        blockList = blockList.filter(ele => ele != storageChange.oldValue)
    }

})


function compareURL(tabURL) {
    for (let i = 0; i < blockList.length; i++) {
        if (tabURL.includes(blockList[i]))
            return true;
    }
    return false;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {


    if (block) {
        if (compareURL(tab.url)) {
            chrome.tabs.executeScript(null, { file: './block.js' })
        }
    }
})



let timer;
let timerAlert;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg === 'GET_TIME') {
        sendResponse({ time: timer })
    }
})

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === 'createTimer')
    port.onMessage.addListener(function (msg) {
        if (msg.message === 'START_TIME') {
            block = !block
            if (block)
                port.postMessage({ state: BLOCK_STATE })
            if (!block)
                port.postMessage({ state: UNBLOCK_STATE })
        } else if (msg.when != null) {
            timer = new Date(msg.when)
            timerAlert = setTimeout(function () {
                alert('Time\'s up!')
            }, timer - Date.now()
            )
        }
    })
})
