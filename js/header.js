//const body = document.getElementById("body")

function setTitle(text) {
    document.getElementById("title").innerHTML = text;
}

function isDarkTheme() {
    return (document.getElementById("theme-css").href.endsWith("/dark.css"))
}

function isLightTheme() {
    return (document.getElementById("theme-css").href.endsWith("/light.css"))
}

function shouldSmoothScroll(a) {
    return (a || true) && !window.matchMedia("(prefers-reduced-motion)").matches
}

window.onresize = function on_resize(e) {
    switch (currentPageA) {
        case "home":
            homePage(false);
            break;
        case "story":
            storyPage(false);
            break;
        case "about":
            aboutPage(false);
            break;
        default:
            homePage(false);
    }
}

function toggleWidePages() {
    let fc = document.getElementById("full-content");
    
    if (fc.classList.contains("wide")) fc.classList.remove("wide");
    else fc.classList.add("wide");
}

function homePage(smooth) {
    currentPageA = "home"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 0, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    handleScroll()
    resetBackgroundImage()
    setTitle("Home - Color Thing")
}

function storyPage(smooth) {
    currentPageA = "story"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 1, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    handleScroll()
    if (smooth) {
        setStoryPageTitle()
        setTimeout(() => { window.location.hash = "story?" + currentPage; }, 2)
    }
}

function aboutPage(smooth) {
    currentPageA = "about"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 2, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    handleScroll()
    resetBackgroundImage()
    setTitle("About - Color Thing")
}

function switchTheme() {
    let style = document.getElementById("theme-css");
    if (heldKeys[91] || heldKeys[16]) {
        style.href = "./themes/very-dark.css"
        localStorage.setItem("theme", "dark+");
    } else if (heldKeys[17]) {
        localStorage.removeItem("theme");
        loadTheme();
    } else {
        if (style.href.endsWith("/dark.css")) {
            style.href  = "./themes/light.css"
            localStorage.setItem("theme", "light");
            resetBackgroundImage()
        } else {
            style.href  = "./themes/dark.css";
            localStorage.setItem("theme", "dark");
            resetBackgroundImage()
        }
    }
}

function setThemeColor(c, skip, requirekey) {
    if (requirekey && !heldKeys[18]) return;
    //console.log(c)
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

let _logoisrgb = false;

function rgbLogo() {
    if (heldKeys[17]) {
        if (!_logoisrgb) {
            document.getElementById("logo-r").classList.add("rgb-r");
            document.getElementById("logo-g").classList.add("rgb-g");
            document.getElementById("logo-b").classList.add("rgb-b");
            _logoisrgb = true;
        } else {
            document.getElementById("logo-r").classList.remove("rgb-r");
            document.getElementById("logo-g").classList.remove("rgb-g");
            document.getElementById("logo-b").classList.remove("rgb-b");
            _logoisrgb = false;
        }
    } //else console.log("not holding key")
}