window.onload = function() {
    console.log("loaded page")

    document.getElementById("background").style.backgroundImage = ((Math.random()*1000 < 5) ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/temp-background.png")')
    console.log(document.getElementById("background").style.backgroundImage)
}