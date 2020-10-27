var body;

function resetBackgroundImage() {
    document.getElementById("background").style.backgroundImage = (window.location.href.endsWith("meme") || (Math.random()*1000 < 5)  ? 'url("https://media1.tenor.com/images/9a762bc54a465df741b0efd0ac887601/tenor.gif")' : 'url("./assets/meadowgatedark.png")')
}

window.onload = function() {
    console.log("loaded page")

    body = document.getElementById("body")
    
    resetBackgroundImage()
    handleScroll()
    document.getElementById("home-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("story-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}
    document.getElementById("about-content").onscroll = (e) => {setTimeout(() => {handleScroll()}, 0)}

    document.getElementById("theme-css").href = "./themes/" + {"dark+":"very-dark","light":"light","dark":"dark","red":"red","green":"green","blue":"blue"}[localStorage.getItem("theme") || "dark"] + ".css";
    if (["red","green","blue"].includes(localStorage.getItem("theme"))) {
        setThemeColor({"red":"r","green":"g","blue":"b"}[localStorage.getItem("theme")], true);
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
    let el = document.getElementById(currentPage + "-content");
    document.getElementById("scrollbar-handle").style.height = ((el.clientHeight / el.scrollHeight) * 100).toString() + "vh";
    document.getElementById("scrollbar-handle").style.top = ((el.scrollTop / el.scrollHeight) * 100).toString() + "vh";
    document.getElementById("scrollbar").style.display = (el.clientHeight < el.scrollHeight ? "block" : "none");
    console.log(document.getElementById("scrollbar").style.display + " " + (el.clientHeight > el.scrollHeight));
}

window.onwheel = (e) => {
    setTimeout(() => {document.getElementById(currentPage + "-content").scrollBy({top: e.deltaY * 2, behavior: "smooth"})}, 0)
}

window.ontouchstart = (e) => {
    window.onwheel = null;
    handleScroll = function() {}
    document.getElementById("home-content").style.overflowY = "scroll";
    document.getElementById("story-content").style.overflowY = "scroll";
    document.getElementById("about-content").style.overflowY = "scroll";
    window.ontouchstart = null;
}