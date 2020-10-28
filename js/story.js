function loadStory() {
    fetch("./story.json")
        .then((res) => {
            console.log(res);
            if (!res.ok) {
                throw new Error("HTTP error: " + res.status);
            }
            return res.json()
        })
        .then((data) => {
            console.log(data);
            story = data
            storyLoaded = true;
        })
        .catch((err) => {
            console.error(err)
        })
}

function jumpToFirstUnreadPage() {
    let page = localStorage.getItem("lastReadPage") || 0;
    page += 1;
    //console.log("first unread: " + page)
    generateStoryPage(parseInt(page) + 1);
}

function jumpToLastPage() {
    let page = story.meta.lastPage
    //console.log("last page: " + page)
    generateStoryPage(page)
}

function nextStoryPage() {
    if (currentPage == -1) currentPage = 0;
    localStorage.setItem("lastReadPage", currentPage)
    let page = currentPage + 1;
    if (page > story['meta'].lastPage) page = currentPage;
    //console.log("next page: " + page)
    generateStoryPage(page)
}

function prevStoryPage() {
    let page = currentPage - 1;
    if (currentPage == -1) page = -1
    //console.log("prev page: " + page)
    generateStoryPage(page)
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
     "0": "Page 1"
}

function getStoryPageTitle(page) {
    return "Story - " + (titles[page.toString()] || ("Page " + page.toString()));
}

function setStoryPageTitle(pageNumber) {
    setTitle(getStoryPageTitle(pageNumber || currentPage) + " - Color Thing")
}

function generateStoryPage(pageNumber) {
    if (!storyLoaded) { setTimeout(generateStoryPage, 10, [pageNumber]); return; }
    let nf = null
    isOnRealStoryPage = false;
    if (pageNumber == -2) { jumpToFirstUnreadPage(); return}
    if (pageNumber < -3) pageNumber = -1
    if (pageNumber > story["meta"].lastPage) {nf = pageNumber; pageNumber = -3;}
    if (pageNumber == 0) pageNumber = -1
    currentPage = pageNumber;
    if (pageNumber > 0) localStorage.setItem("lastVisitedPage", pageNumber.toString())
    if (pageNumber > -2) window.location.hash = "#story?" + pageNumber;
    if (!story[pageNumber] || pageNumber == -3) {
        isOnRealStoryPage = false;
        hideStoryPageElements()
        setStoryPageTitle(-3)

        document.getElementById("story-404").style.display = "block"
        document.getElementById("sh-page").innerHTML = "?";
        document.getElementById("s404-page").innerHTML = (nf == null ? ". you asked for this, didnt you..." : "Story-" + nf);
    }
    else if (story[pageNumber].type === "homepage") {
        isOnRealStoryPage = false;
        
        hideStoryPageElements()
        setStoryPageTitle(-1)

        document.getElementById("story-index").style.display = "block";
        document.getElementById("sh-page").innerHTML = "index";
    } else {
        hideStoryPageElements()
        setStoryPageTitle(pageNumber)
        if (story[pageNumber].type === "video") {
            isOnRealStoryPage = true;
            document.getElementById("story-video").style.display = "block";
            document.getElementById("story-video").src = story[pageNumber].src;
        } else if (story[pageNumber].type === "image") {
            isOnRealStoryPage = true;
            document.getElementById("story-image").style.display = "block";
            document.getElementById("story-image").src = story[pageNumber].src;
        } else {
            console.warn("whoops");
            return;
        }

        document.getElementById("story-text").style.display = "block";
        document.getElementById("story-text").innerHTML = story[pageNumber].text || "";

        document.getElementById("sh-page").innerHTML = pageNumber;
    }

    resetBackgroundImage()
    handleScroll()

    //if (pageNumber == 1) {
    //    document.getElementById
    //}
}