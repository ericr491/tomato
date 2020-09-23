var style = document.createElement('style')
style.innerHTML =
    '.bodyColor {' +
    'color: black;' +
    'font-size: 60px;' +
    '}'

document.querySelector('head').appendChild(style)

document.querySelector('body').innerHTML = '<h1 class="bodyColor"> Content blocked. </h1>'


console.log('completed')