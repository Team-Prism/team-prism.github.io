//const body = document.getElementById("body")

function setTitle(text) {
    if (document.getElementById("body").classList.contains("offline")) text = "Offline - " + text;
    document.getElementById("title").innerHTML = text;
}

function setTheme(color) {
    document.getElementById("meta-theme-color").setAttribute("content", color)
}

function isDarkTheme() {
    return ((localStorage.getItem("theme") || "dark") == "dark")
}

function isLightTheme() {
    return (localStorage.getItem("theme") == "light")
}

function shouldSmoothScroll(a) {
    return ((a == undefined) ? true : a) && !window.matchMedia("(prefers-reduced-motion)").matches
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
    let blog = document.getElementById("blog-div");
    
    if (fc.classList.contains("wide")) {fc.classList.remove("wide"); blog.classList.remove("wide"); document.getElementById("header-wide").innerHTML = "Wide"; localStorage.removeItem("wide")}
    else {fc.classList.add("wide"); blog.classList.add("wide"); document.getElementById("header-wide").innerHTML = "Narrow"; localStorage.setItem("wide", "1")}
    setTimeout(handleScroll, 250)
}

function homePage(smooth) {
    currentPageA = "home"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 0, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    document.getElementById("story-video").pause();
    document.getElementById("header-about").classList.remove("selected")
    document.getElementById("header-story").classList.remove("selected")
    document.getElementById("header-home").classList.add("selected")
    closeBlogPost()
    handleScroll()
    resetBackgroundImage()
    setTitle("Home - Color Thing")
}

function storyPage(smooth) {
    currentPageA = "story"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 1, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    document.getElementById("header-about").classList.remove("selected")
    document.getElementById("header-story").classList.add("selected")
    document.getElementById("header-home").classList.remove("selected")
    handleScroll()
    resetBackgroundImage()
    if (smooth) {
        setStoryPageTitle()
        setTimeout(() => { window.location.hash = "story?" + currentPage; }, 2)
    }
    if (storyLoaded && story[currentPage].type == "video") {
        setTimeout(() => {document.getElementById("story-video").play()}, 350)
    }
}

function aboutPage(smooth) {
    currentPageA = "about"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 2, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    document.getElementById("story-video").pause();
    document.getElementById("header-about").classList.add("selected")
    document.getElementById("header-story").classList.remove("selected")
    document.getElementById("header-home").classList.remove("selected")
    handleScroll()
    resetBackgroundImage()
    setTitle("About - Color Thing")
}

function setActiveTheme(theme) {
    document.getElementById("dark-theme-css").sheet.disabled = true;
    document.getElementById("vdark-theme-css").sheet.disabled = true;
    document.getElementById("light-theme-css").sheet.disabled = true;
    document.getElementById({"vdark": "vdark", "dark+": "vdark", "dark": "dark", "light": "light"}[theme] + "-theme-css").sheet.disabled = false
}

function switchTheme() {
    if (heldKeys[91] || heldKeys[16]) {
        setActiveTheme("dark+")
        localStorage.setItem("theme", "dark+");
    } else if (heldKeys[17]) {
        localStorage.removeItem("theme");
        loadTheme();
    } else {
        if (localStorage.getItem("theme") !== "dark") {
            setActiveTheme("dark")
            localStorage.setItem("theme", "dark");
            resetBackgroundImage()
        } else {
            setActiveTheme("light")
            localStorage.setItem("theme", "light");
            resetBackgroundImage()
        }
    }
}

function setThemeColor(c, skip, requirekey) {
    if (requirekey && !heldKeys[18]) return;
    //console.log(c)
    c = {"r":"red","g":"green","b":"blue"}[c] || "dark";
    /*if (!skip && document.getElementById("theme-css").href.endsWith("/themes/" + c + ".css")) {
        console.log("reset theme")
        c = "dark"
    }*/
    //document.getElementById("theme-css").href = "./themes/" + c + ".css";
    //localStorage.setItem("theme", c);
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