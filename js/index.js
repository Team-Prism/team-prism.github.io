var body;
let currentPage = -1;
let isOnRealStoryPage = false;
let story = {}
let storyLoaded = false;
var heldKeys = {};
window.onkeyup = (e) => { heldKeys[e.keyCode] = false; }
window.onkeydown = (e) => { heldKeys[e.keyCode] = true; }
let meme = false && (window.location.href.endsWith("meme")) || (Math.random()*1000 < 5);

let websiteVersionString = "v0.5.2";

let currentPageA = "home"
let sb_lastY;
let sb_ratio;
let raf = window.requestAnimationFrame || window.setImmediate || function (c) { return setTimeout(c, 0) };

let attemptToSendAnalyticsEvents = true;

function le(name, params, opts) {
    if (attemptToSendAnalyticsEvents) {
        try {
            fba.logEvent(name, params, opts)
        } catch {
            attemptToSendAnalyticsEvents = false;
            setTimeout(() => {attemptToSendAnalyticsEvents = true}, 60000)
        }
    }
}

function resetBackgroundImage() {
    let bg = document.getElementById("background");
    if (currentPageA == "story" && storyLoaded && story[currentPage] && isOnRealStoryPage) {
        if (story[currentPage]['bg-dark'] && isDarkTheme()) {
            bg.style.backgroundImage = "url(" + story[currentPage]['bg-dark'].src + ")";
            if (story[currentPage]['bg-dark'].invert) bg.style.filter = "invert(100%)";
            else bg.style.filter = "invert(0%)";
        } else if (story[currentPage]['bg-light'] && isLightTheme()) {
            bg.style.backgroundImage = "url(" + story[currentPage]['bg-light'].src + ")";
            if (story[currentPage]['bg-light'].invert) bg.style.filter = "invert(100%)";
            else bg.style.filter = "invert(0%)";
        } else {
            //bg.style.backgroundImage = (meme ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/meadowgatedark.png")');
            bg.style.backgroundImage = 'url("./assets/meadowgatedark.png")'
            bg.style.filter = "";
        }
    } else {
        // bg.style.backgroundImage = (meme ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/meadowgatedark.png")');
        bg.style.backgroundImage = 'url("./assets/meadowgatedark.png")'
        bg.style.filter = "";
    }

    if (currentPageA == "story" && storyLoaded && story[currentPage] && isOnRealStoryPage && story[currentPage].themecolor) {
        setTheme(story[currentPage].themecolor)
    } else {
        setTheme("#000000")
    }
}

function loadTheme() {
    let userTheme = localStorage.getItem("theme")
    let fallbackTheme = (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    setActiveTheme({"dark+":"dark+","light":"light","dark":"dark","red":"dark","green":"light","blue":"dark"}[userTheme || fallbackTheme]);
    /*if (["red","green","blue"].includes(localStorage.getItem("theme"))) {
        setThemeColor({"red":"r","green":"g","blue":"b"}[localStorage.getItem("theme")], true);
    }*/

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!userTheme) {
            setActiveTheme(e.matches ? "dark" : "light");
        } else {
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this)
        }
    })
}

let mobileElements = ["body", "full-content", "blog-div", "blog-container", "blog-single-container"]

window.onload = function() {
    document.getElementById("db-ver").innerHTML = websiteVersionString;

    body = document.getElementById("body")
    
    resetBackgroundImage()
    handleScroll()
    document.getElementById("home-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("story-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("about-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}

    if (/mobi/i.test(navigator.userAgent)) {
        for (let el in mobileElements) {
            document.getElementById(mobileElements[el]).classList.add("mobile")
        }
        if (window.outerHeight > window.outerWidth) {
            document.getElementById("mobile-header").classList.remove("closed")
        }
        document.getElementById("full-content").classList.add("wide");
        document.getElementById("blog-div").classList.add("wide"); 
        document.getElementById("header-wide-a").innerHTML = ""
        // TODO: force modified wide mode for mobile browsers
        // note: mobile browser "force desktop site" changes the UA of the browser for that site
        // so this method will not pickup mobile if the user forces desktop site, but if they do that
        // they asked for it lol
    } else if (localStorage.getItem("wide")) {
        document.getElementById("full-content").classList.add("wide");
        document.getElementById("blog-div").classList.add("wide"); 
        document.getElementById("header-wide").innerHTML = "Narrow";
    }

    // switch to correct page
    let hsh = window.location.hash;
    //console.log(hsh)
    let sP = -1;
    if (hsh === "") setTimeout(() => {homePage(false)}, 10);
    else if (hsh.startsWith("#home")) {
        setTimeout(() => {homePage(false)}, 10);
    } else if (hsh.startsWith("#story")) {
        setTimeout(() => {storyPage(false)}, 10);
        sP = window.location.hash.split("?")[1] || -1
    } else if (hsh.startsWith("#about")) {
        setTimeout(() => {aboutPage(false)}, 10);
    } else if (hsh.startsWith("#blog")) {
        setTimeout(() => {homePage(false); openBlogPost(hsh.split("?")[1])}, 10)
    } else {
        setTimeout(() => {homePage(false)}, 10);
    }
    setTimeout(() => {generateStoryPage(parseInt(sP), true)}, 11);
    //console.log(currentPageA)

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
        loadBlog().then(() => {
            console.log("loaded blog")
            document.getElementById("blog-div").style.display = "flex";
            document.getElementById("blog-loading").remove()
        }).catch((err) => {
            let bl = document.getElementById("blog-loading");
            bl.innerHTML = err.toString()
            bl.classList.add("error")
            console.error(err)
        })
        loadStory().then(() => {
            document.getElementById("story-main").hidden = false;
            document.getElementById("story-loading").remove()
        }).catch((err) => {
            let sl = document.getElementById("story-loading");
            sl.innerHTML = err.toString()
            sl.classList.add("error")
            console.error(err)
        });
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }

    loadTheme()
    if (Notification.permission == "granted") registerFirebaseMessaging();
    console.log("loaded page")
}

fbMessagingEnabled = false;

function registerFirebaseMessaging() {
    try {
        const messaging = firebase.messaging();
        messaging.getToken({vapidKey: "BMGXe-Z5zjf_9R4NZNE8aMgmSJEG_mCja2qHNmqamspwlye0xwe56LIzGPrHdSfiHY8IMPfan3JrOkDVKJs0OV4"}).then((currentToken) => {
            if (currentToken) {
                // console.log(currentToken);
                fbMessagingEnabled = true;
            //sendTokenToServer(currentToken);
            //updateUIForPushEnabled(currentToken);
            } else {
            // Show permission request.
            console.log('No registration token available. Request permission to generate one.');
            // Show permission UI.
            //updateUIForPushPermissionRequired();
            //setTokenSentToServer(false);
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            alert("You will not be able to get notifications because there was an error enabling them. (Are you offline, or do you have an adblocker?)")
            //showToken('Error retrieving registration token. ', err);
            //setTokenSentToServer(false);
        });
        messaging.onMessage((payload) => {
            console.log("got message. ", payload)
        })
    } catch {
        alert("You will not be able to get notifications because your device or browser does not support it.")
    }
}

function requestNotificationsPermission() {
    Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
            registerFirebaseMessaging()
        } else {
            alert("You will not be able to get notifictions if you deny the permission.")
        }
    })
}

window.onresize = function(e) {
    if (/mobi/i.test(navigator.userAgent)) {
        location.reload()
        if (window.outerHeight > window.outerWidth) {
            document.getElementById("mobile-header").classList.remove("closed")
        } else {
            document.getElementById("mobile-header").classList.add("closed")
        }
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
    /*setTimeout(() => {
        if (!e.ctrlKey) document.getElementById(currentPageA + "-content")
        .scrollBy({ /* the line below is needlessly complicated because firefox uses deltaMode 1 instead of deltaMode 0
                    the w3 spec states that deltaY can be given in pixels, lines, or pages, and which of those it uses
                        is defined by the deltaMode of the event, 0 being pixels, 1 being lines, and 2 being pages
                        Firefox uses lines, while chrome uses pixels, so if the deltaMode is 1, i multiply the deltaY
                        by 30, which should mean the scroll amount is 90 (while it is 100 on chrome), so in theory
                        scrolling will be slower on firefox by 10 pixels per 'notch'
            *\/
            top: (e.deltaMode == 0 ? e.deltaY : e.deltaY * 30) * (e.altKey ? 6 : 2),
            behavior: shouldSmoothScroll() ? "smooth" : "auto"
        })
    }, 0)*/
    setTimeout(handleScroll, 0)
}

// window.ontouchstart = (e) => {
//     window.onwheel = null;
//     handleScroll = function() {}
//     document.getElementById("home-content").style.overflowY = "scroll";
//     document.getElementById("story-content").style.overflowY = "scroll";
//     document.getElementById("about-content").style.overflowY = "scroll";
//     window.ontouchstart = null;
// }