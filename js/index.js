var body;
let currentPage = -1;
let isOnRealStoryPage = false;
let story = {}
let storyLoaded = false;
var heldKeys = {};
window.onkeyup = (e) => { heldKeys[e.keyCode] = false; }
window.onkeydown = (e) => { heldKeys[e.keyCode] = true; }

let websiteVersionString = "v0.2.4 - PWA Test 4";

let currentPageA = "home"
let sb_lastY;
let sb_ratio;
let raf = window.requestAnimationFrame || window.setImmediate || function (c) { return setTimeout(c, 0) };

function resetBackgroundImage() {
    if (currentPageA == "story" && storyLoaded && story[currentPage] && isOnRealStoryPage) {
        if (story[currentPage]['bg-dark'] && isDarkTheme()) {
            document.getElementById("background").style.backgroundImage = "url(" + story[currentPage]['bg-dark'].src + ")";
            if (story[currentPage]['bg-dark'].invert) document.getElementById("background").style.filter = "invert(100%)";
            else document.getElementById("background").style.filter = "invert(0%)";
        } else if (storyLoaded  && story[currentPage] && story[currentPage]['bg-light'] && isLightTheme() && isOnRealStoryPage) {
            document.getElementById("background").style.backgroundImage = "url(" + story[currentPage]['bg-light'].src + ")";
            if (story[currentPage]['bg-light'].invert) document.getElementById("background").style.filter = "invert(100%)";
            else document.getElementById("background").style.filter = "invert(0%)";
        } else {
            document.getElementById("background").style.backgroundImage = (window.location.href.endsWith("meme") || (Math.random()*1000 < 5)  ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/meadowgatedark.png")');
            document.getElementById("background").style.filter = "";
        }
    } else {
        document.getElementById("background").style.backgroundImage = (window.location.href.endsWith("meme") || (Math.random()*1000 < 5)  ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/meadowgatedark.png")');
        document.getElementById("background").style.filter = "";
    }
}

function loadTheme() {
    let userTheme = localStorage.getItem("theme")
    let fallbackTheme = (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    document.getElementById("theme-css").href = "./themes/" + {"dark+":"very-dark","light":"light","dark":"dark","red":"red","green":"green","blue":"blue"}[userTheme || fallbackTheme] + ".css";
    if (["red","green","blue"].includes(localStorage.getItem("theme"))) {
        setThemeColor({"red":"r","green":"g","blue":"b"}[localStorage.getItem("theme")], true);
    }

    if (!userTheme) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
            if (!userTheme) {
                document.getElementById("theme-css").href = "./themes/" + (e.matches ? "dark" : "light") + ".css";
            } else {
                window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this)
            }
        })
    }
}

window.onload = function() {
    console.log("loaded page")
    document.getElementById("db-ver").innerHTML = websiteVersionString;

    body = document.getElementById("body")
    
    resetBackgroundImage()
    handleScroll()
    document.getElementById("home-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("story-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("about-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}

    loadTheme()

    // switch to correct page
    let hsh = window.location.hash;
    console.log(hsh)
    if (hsh === "") console.log("nothing")
    else if (hsh.startsWith("#home")) {
        setTimeout(homePage, 10, [false]);
    } else if (hsh.startsWith("#story")) {
        setTimeout(storyPage, 10, [false]);
        setTimeout(generateStoryPage, 11, [window.location.hash.split("?")[1] || -1]);
    } else if (hsh.startsWith("#about")) {
        setTimeout(aboutPage, 10, [false]);
    }
    console.log(currentPageA)

    document.getElementById("db-useragent").innerHTML = window.navigator.userAgent;

    document.getElementById("scrollbar-handle").onmousedown = function scrollbar_mousedown(e) {
        sb_lastY = e.pageY;
        document.getElementById("scrollbar").classList.add("held")

        function scroll_drag(e) {
            let delta = e.pageY - sb_lastY;
            sb_lastY  = e.pageY;

            raf(function() {
                document.getElementById(currentPageA + "-content").scrollTop += delta / sb_ratio;
            })
        }

        function scroll_end(e) {
            document.getElementById("scrollbar").classList.remove("held")
            window.removeEventListener("mousemove", scroll_drag);
            window.removeEventListener("mouseup", scroll_end);
        }

        window.addEventListener("mousemove", scroll_drag);
        window.addEventListener("mouseup", scroll_end)
    }

    if (window.location.href.endsWith("offline.html")) {
        document.getElementById("story-content").innerHTML = "<div class='content-main fancy-border'>You are offline, and you must be online to read the story!</div><div class='content-footer fancy-border'>&copy; 2020 Team Prism</div>"
    } else {
        loadStory()
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
}

/*function updateScrollbar() {
    let list = document.getElementById("list-container")
    let bar = document.getElementById("list-container-scrollbar")
    bar.value = list.scrollTop;
    bar.max = list.scrollHeight - list.clientHeight;
    bar.hidden = (list.scrollHeight == list.clientHeight)
}

document.getElementById("full-content").addEventListener("scroll", updateScrollbar, {passive: true})

document.getElementById("scrollbar").oninput = function(e) {
    let bar = document.getElementById("scrollbar")
    list.scrollTop = bar.value;
    bar.max = list.scrollHeight - list.clientHeight;
}*/

function handleScroll() {
    let el   = document.getElementById(currentPageA + "-content");
    let sb   = document.getElementById("scrollbar");
    let sb_h = document.getElementById("scrollbar-handle");
    let totalHeight = el.scrollHeight;
    let viewHeight  = el.clientHeight;
    sb_ratio = viewHeight / totalHeight;

    if (sb_ratio >= 1) sb.style.display = "none";
    else {
        sb.style.display = "block"
        sb_h.style.height = Math.max(sb_ratio * 100, 10) + "%";
        sb_h.style.top = ((el.scrollTop / totalHeight) * 100) + "%"
    }

    //if (el.scrollTop >= )
    
    //console.log(document.getElementById("scrollbar").style.display + " " + (el.clientHeight > el.scrollHeight));
}

window.onwheel = (e) => {
    //console.log(e)
    setTimeout(() => {
        if (!e.ctrlKey) document.getElementById(currentPageA + "-content")
        .scrollBy({ /* the line below is needlessly complicated because firefox uses deltaMode 1 instead of deltaMode 0
                    the w3 spec states that deltaY can be given in pixels, lines, or pages, and which of those it uses
                        is defined by the deltaMode of the event, 0 being pixels, 1 being lines, and 2 being pages
                        Firefox uses lines, while chrome uses pixels, so if the deltaMode is 1, i multiply the deltaY
                        by 30, which should mean the scroll amount is 90 (while it is 100 on chrome), so in theory
                        scrolling will be slower on firefox by 10 pixels per 'notch'
            */
            top: (e.deltaMode == 0 ? e.deltaY : e.deltaY * 30) * (e.altKey ? 3 : 1),
            behavior: shouldSmoothScroll() ? "smooth" : "auto"
        })
    }, 0)
}

window.ontouchstart = (e) => {
    window.onwheel = null;
    handleScroll = function() {}
    document.getElementById("home-content").style.overflowY = "scroll";
    document.getElementById("story-content").style.overflowY = "scroll";
    document.getElementById("about-content").style.overflowY = "scroll";
    window.ontouchstart = null;
}