//const body = document.getElementById("body")

function setTitle(text) {
    if (document.getElementById("body").classList.contains("offline")) text = "Offline - " + text;
    document.getElementById("title").innerHTML = text;
}

function setTheme(color) {
    document.getElementById("meta-theme-color").setAttribute("content", color)
}

function isMobile() {
    return (/mobi/i.test(navigator.userAgent))
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

// window.onresize = function on_resize(e) {
//     switch (currentPageA) {
//         case "home":
//             homePage(false);
//             break;
//         case "story":
//             storyPage(false);
//             break;
//         case "about":
//             aboutPage(false);
//             break;
//         default:
//             homePage(false);
//     }
// }

function toggleWidePages() {
    let fc = document.getElementById("full-content");
    let blog = document.getElementById("blog-div");
    
    if (fc.classList.contains("wide")) {fc.classList.remove("wide"); blog.classList.remove("wide"); document.getElementById("header-wide").innerHTML = "Wide"; localStorage.removeItem("wide")}
    else {fc.classList.add("wide"); blog.classList.add("wide"); document.getElementById("header-wide").innerHTML = "Narrow"; localStorage.setItem("wide", "1")}
    setTimeout(handleScroll, 250)
}

function storyPageFlip(side) {
    let s = document.getElementById("story-content")
    if (side == "left") {
        s.classList.add("fast");
        s.classList.remove("right");
        s.classList.add("left");
        s.classList.remove("fast");
    } else if (side == "right") {
        s.classList.add("fast");
        s.classList.remove("left");
        s.classList.add("right");
        s.classList.remove("fast");
    }
}

function selectPage(page) {
    document.getElementById("header-about").classList.remove("selected");
    document.getElementById("header-story").classList.remove("selected");
    document.getElementById("header-home").classList.remove("selected");
    document.getElementById("header-mobile-about").classList.remove("selected");
    document.getElementById("header-mobile-story").classList.remove("selected");
    document.getElementById("header-mobile-home").classList.remove("selected");
    document.getElementById("header-mobile-" + page).classList.add("selected");
    document.getElementById("header-" + page).classList.add("selected");
}

function homePage(smooth) {
    closeBlogPost()
    handleScroll()
    if (currentPageA === "home") { return }
    le("switch_page", {"from": currentPageA, "to": "home"})
    currentPageA = "home"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 0, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    document.getElementById("story-video").pause();
    selectPage("home")
    document.getElementById("home-content").classList.add("show")
    document.getElementById("story-content").classList.remove("show")
    document.getElementById("about-content").classList.remove("show")
    storyPageFlip("right")
    resetBackgroundImage()
    setTitle("Home - Chroma Fracture")
}

function storyPage(smooth) {
    if (currentPageA === "story") { return }
    le("switch_page", {"from": currentPageA, "to": "story"})
    currentPageA = "story"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 1, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    selectPage("story")
    document.getElementById("home-content").classList.remove("show")
    document.getElementById("story-content").classList.add("show")
    document.getElementById("about-content").classList.remove("show")
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
    if (currentPageA === "about") { return }
    le("switch_page", {"from": currentPageA, "to": "about"})
    currentPageA = "about"
    body.scrollTop = 0;
    body.scrollTo({top: 0, left: body.clientWidth * 2, behavior: (shouldSmoothScroll(smooth) == true ? "smooth" : "auto")})
    document.getElementById("story-video").pause();
    selectPage("about")
    document.getElementById("home-content").classList.remove("show")
    document.getElementById("story-content").classList.remove("show")
    document.getElementById("about-content").classList.add("show")
    storyPageFlip("left")
    handleScroll()
    resetBackgroundImage()
    setTitle("About - Chroma Fracture")
    
}

function setActiveTheme(theme) {
    document.getElementById("dark-theme-css").sheet.disabled = true;
    document.getElementById("vdark-theme-css").sheet.disabled = true;
    document.getElementById("light-theme-css").sheet.disabled = true;
    document.getElementById({"vdark": "vdark", "dark+": "vdark", "dark": "dark", "light": "light"}[theme] + "-theme-css").sheet.disabled = false
}

let shouldEnableVeryDarkTheme = false

function switchTheme() {
    if (heldKeys[91] || heldKeys[16] || (shouldEnableVeryDarkTheme && isMobile())) {
        setActiveTheme("dark+")
        localStorage.setItem("theme", "dark+");
        shouldEnableVeryDarkTheme = false
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
    updateStoryIndexBannerFromTheme()
}

function toggleMobileHeaderState() {
    let mh = document.getElementById("mobile-header").classList
    if (window.outerHeight < window.outerWidth) {
        if (mh.contains("closed")) {
            mh.remove("closed");
        } else {
            mh.add("closed");
        }
    } else {
        mh.remove("closed")
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
            document.querySelectorAll(".logo-r").forEach(e => {e.classList.add("rgb-r")});
            document.querySelectorAll(".logo-g").forEach(e => {e.classList.add("rgb-g")});
            document.querySelectorAll(".logo-b").forEach(e => {e.classList.add("rgb-b")});
            _logoisrgb = true;
        } else {
            document.querySelectorAll(".logo-r").forEach(e => {e.classList.remove("rgb-r")});
            document.querySelectorAll(".logo-g").forEach(e => {e.classList.remove("rgb-g")});
            document.querySelectorAll(".logo-b").forEach(e => {e.classList.remove("rgb-b")});
            _logoisrgb = false;
        }
    } //else console.log("not holding key")
}