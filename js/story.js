function loadStory(forceReload) {
    return fetch("./story.json", {cache: "reload"})
        .then((res) => {
            if (!res.ok) {
                throw new Error("HTTP error: " + res.status);
            }
            return res.json()
        })
        .then((data) => {
            story = data
            storyLoaded = true;
            updateStoryIndexBannerFromTheme()
        })
        .catch((err) => {
            throw err;
        })
}

function updateStoryIndexBannerFromTheme() {
    if (isLightTheme()) {
        if (!(storyLoaded && story.meta && story.meta.banners)) return
        document.getElementById("index-a1c1").src = story.meta.banners.act1.chapter1.light
        document.getElementById("index-a1c2").src = story.meta.banners.act1.chapter2.light
    } else {
        if (!(storyLoaded && story.meta && story.meta.banners)) return
        document.getElementById("index-a1c1").src = story.meta.banners.act1.chapter1.dark
        document.getElementById("index-a1c2").src = story.meta.banners.act1.chapter2.dark
    }
}

function jumpToFirstUnreadPage() {
    if (storyLoaded) {
        let page = parseInt(localStorage.getItem("lastReadPage") || 0);
        generateStoryPage(page + ((parseInt(story['meta']['lastPage']) > page) ? 1 : 0), false);
    } else {
        setTimeout(jumpToFirstUnreadPage, 10);
    }
    //page += 1;
    //console.log("first unread: " + page)
    
}

function jumpToLastPage() {
    let page = story.meta.lastPage
    //console.log("last page: " + page)
    generateStoryPage(page)
}

function nextStoryPage() {
    if (parseInt(currentPage) == -1) currentPage = 0;
    console.log(currentPage)
    console.log(localStorage.getItem("lastReadPage"))
    console.log(parseInt(localStorage.getItem("lastReadPage") || 1) == parseInt(currentPage))
    if (parseInt(localStorage.getItem("lastReadPage") || 1) + 1 == parseInt(currentPage)) localStorage.setItem("lastReadPage", currentPage.toString())
    let page = parseInt(currentPage) + 1;
    if (page > story['meta'].lastPage) page = currentPage;
    //console.log("next page: " + page)
    generateStoryPage(page, false)
}

function prevStoryPage() {
    let page = parseInt(currentPage) - 1;
    if (parseInt(currentPage) == -1) page = -1
    //console.log("prev page: " + page)
    generateStoryPage(page, false)
}

function hideStoryPageElements() {
    document.getElementById("story-404")  .style.display = "none"
    document.getElementById("story-image").style.display = "none";
    document.getElementById("story-video").style.display = "none";
    document.getElementById("story-text") .style.display = "none";
    document.getElementById("story-index").style.display = "none";
    document.getElementById("story-video").pause();
}

let titles = {
    "-1": "Index",
    "-2": "Latest Page",
    "-3": "Unknown Page",
     "0": "1"
}

function getStoryPageText(page) {
    return titles[page] || story[page].page || page;
}

function getStoryPageTitle(page) {
    return "Story - " + (titles[page.toString()] || ("Page " + page.toString()));
}

function setStoryPageTitle(pageNumber) {
    setTitle(getStoryPageTitle(pageNumber || currentPage) + " - Chroma Fracture")
}

function generateStoryPage(pageNumber, sethash) {
    if (!storyLoaded) { setTimeout(() => {generateStoryPage(pageNumber, sethash)}, 50);; return; }
    let nf = null
    isOnRealStoryPage = false;
    if (pageNumber == -2) { jumpToFirstUnreadPage(); return}
    //if (pageNumber < -3) pageNumber = -1
    if (pageNumber > story["meta"].lastPage) {nf = pageNumber; pageNumber = -3;}
    if (pageNumber == 0) pageNumber = -1
    currentPage = parseInt(pageNumber);
    if (pageNumber > 0) localStorage.setItem("lastVisitedPage", pageNumber.toString())
    if (pageNumber > -2 && !sethash) window.location.hash = "#story?" + pageNumber;
    if (!story[pageNumber] || pageNumber == -3) {
        isOnRealStoryPage = false;
        document.getElementById("story-image-fw").hidden = true
        document.getElementById("story-image-back").hidden = true

        hideStoryPageElements()
        setStoryPageTitle(-3)

        document.getElementById("story-404").style.display = "block"
        document.getElementById("sh-page").innerHTML = "?";
        document.getElementById("s404-page").innerHTML = (nf == null ? ". you asked for this, didnt you..." : ": Story-" + nf);
    }
    else if (story[pageNumber].type === "homepage") {
        isOnRealStoryPage = false;
        document.getElementById("story-image-fw").hidden = true
        document.getElementById("story-image-back").hidden = true
        
        hideStoryPageElements()
        setStoryPageTitle(-1)

        document.getElementById("story-index").style.display = "block";
        document.getElementById("sh-page").innerHTML = "index";
    } else {
        hideStoryPageElements()
        setStoryPageTitle(pageNumber)
        if (story[pageNumber].type === "video") {
            isOnRealStoryPage = true;
            document.getElementById("story-image-fw").hidden = true
            document.getElementById("story-image-back").hidden = true
            document.getElementById("story-video").style.display = "block";
            document.getElementById("story-video").src = story[pageNumber].src;
        } else if (story[pageNumber].type === "image") {
            isOnRealStoryPage = true;
            document.getElementById("story-image-fw").hidden = false
            document.getElementById("story-image-back").hidden = false
            document.getElementById("story-image").style.display = "block";
            document.getElementById("story-image").src = story[pageNumber].src;
        } else {
            console.warn("whoops");
            return;
        }

        if (story[pageNumber].themecolor) {
            setTheme(story[pageNumber].themecolor)
        }

        document.getElementById("story-text").style.display = "block";
        document.getElementById("story-text").innerHTML = story[pageNumber].text || "";

        document.getElementById("sh-page").innerHTML = getStoryPageText(pageNumber);
    }

    resetBackgroundImage()
    handleScroll()

    //if (pageNumber == 1) {
    //    document.getElementById
    //}
}