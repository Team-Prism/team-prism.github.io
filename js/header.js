//const body = document.getElementById("body")

var heldKeys = {};
window.onkeyup = (e) => { heldKeys[e.keyCode] = false; }
window.onkeydown = (e) => { heldKeys[e.keyCode] = true; }

let currentPage = "home"

function homePage(smooth) {
    currentPage = "home"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 0, behavior: (smooth == true ? "smooth" : "auto")})
    handleScroll()
    //body.scrollLeft = body.clientWidth * 0;
}

function storyPage(smooth, pageId) {
    currentPage = "story"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 1, behavior: (smooth == true ? "smooth" : "auto")})
    handleScroll()
}

function aboutPage(smooth) {
    currentPage = "about"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 2, behavior: (smooth == true ? "smooth" : "auto")})
    handleScroll()
}

function switchTheme() {
    let style = document.getElementById("theme-css");
    if (heldKeys[91] || heldKeys[16]) {
        style.href = "./themes/very-dark.css"
        localStorage.setItem("theme", "dark+");
    } else {
        if (style.href.endsWith("/dark.css")) {
            style.href  = "./themes/light.css"
            localStorage.setItem("theme", "light");
            resetBackgroundImage("dark")
        } else {
            style.href  = "./themes/dark.css";
            localStorage.setItem("theme", "dark");
            resetBackgroundImage("dark")
        }
    }
}

function setThemeColor(c, skip) {
    console.log(c)
    c = {"r":"red","g":"green","b":"blue"}[c] || "dark";
    if (!skip && document.getElementById("theme-css").href.endsWith("/themes/" + c + ".css")) {
        console.log("reset theme")
        c = "dark"
    }
    document.getElementById("theme-css").href = "./themes/" + c + ".css";
    localStorage.setItem("theme", c);
    if (c == "dark" || c == "light") resetBackgroundImage()
    else document.getElementById("background").style.backgroundImage = 'url("./assets/bg-' + c + '.png")'
}