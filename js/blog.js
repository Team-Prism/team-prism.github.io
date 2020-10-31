/* changeblog */


var blogData = {};
var blogLoaded = false;

/*function blogHeader() {
    ret = ""
    for (var line in blogData["header"]) {
        ret += blogData["header"][line]
    }
    return ret
}

function blogNext() {
    ret = "<div class='b-next'><h3 style='margin-bottom:0px'>Planned Features:</h3>"
    for (var next in blog["next"]) {
        ret += blogData["next"][next] + "<br>"
    }
    return ret + "</div>"
}*/

/*
<div class="blog-post">
    <div class="blog-image">image</div>
    <table class="blog-table">
        <tbody>
            <tr>
                <td>Author</td>
                <td>Title</td>
                <td>Date</td>
            </tr>
        </tbody>
    </table>
    <p class="blog-content">content</p>
</div>*/


function formatPost(data, fullMode) {
    let ret = "<div class='blog-post' " + (fullMode ? "" : "onclick='openBlogPost(\"" + data.id + "\")'") + ">"
    if (data['image']){ret += "<img class='blog-image' src='" + data["image"] + "'>"}
    ret += "<table class='blog-table'><tbody><tr>"
    if (data['author']) {
        ret += "<td>";
        if (data["type"]) ret += {"announcement":"Announcement by ","blog": "Blog Post by ","website":"Website News Post by "}[data["type"]] || "";
        ret += data['author'] + "</td>"
    }
    if (data['title']){ret += "<td>" + data['title'] + "</td>"}
    if (data['date']){ret += "<td>" + data['date'] + "</td>"}
    ret += "</tr></tbody></table>"
    if (data['content'] && fullMode){
        ret += "<div class='blog-content'>"
        for (let p in data['content']) {
            ret += "<p>" + data['content'][p] + "</p>"
        }
        
        ret += "</div>"
    } else if (data['desc'] && !fullMode) {
        ret += "<p>" + data['desc'] + "</p>"
    }
    
    return ret + "</div>";
}

function blogContent(data) {
    ret = "";
    
    for (let post in data['allPosts']) {
        ret += formatPost(data['allPosts'][post], false)
    }

    return ret
}

function populateBlogDiv(data) {
    var bl = document.getElementById('blog-div')
    var fullContent = ""
    //fullContent += changelogHeader()
    //fullContent += changelogNext() + "<hr>"
    fullContent += blogContent(data);


    fullContent = fullContent.replace("[discord]", "<a href='https://discord.gg/vGwKZep'>discord</a>")
    //fullContent = fullContent.replace("[test-branch]", "<a href='https://thederpymemesquad.github.io/ibr-beta/client/index.html'>test branch</a>")
    
    bl.innerHTML = fullContent;
    if (data['allPosts'].length == 1) bl.classList.add('singlepost')
}

function wait(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

async function loadBlog() {
    //await wait(1000)
    return fetch("./blog.json", {cache: "reload"})
    .then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }
        return res.json()
    })
    .then((data) => {
        populateBlogDiv(data)
        blogData = data;
        blogLoaded = true;
        return true;
    })
    .catch((err) => {
        throw err;
    })
    
}

function closeBlogPost() {
    document.getElementById("home-top").hidden = false;
    document.getElementById("blog-container").hidden = false;
    document.getElementById("blog-single-container").hidden = true;
}

function openBlogPost(post) {
    if (!blogLoaded) {setTimeout(() => {openBlogPost(post)}, 50); return; }
    let bsp = document.getElementById("blog-single-container")
    console.log("finding post", post)
    for (let bp in blogData['allPosts']) {
        if (blogData['allPosts'][bp].id == post) {
            bsp.innerHTML = formatPost(blogData['allPosts'][bp], true)
            document.getElementById("home-top").hidden = true;
            document.getElementById("blog-container").hidden = true;
            bsp.hidden = false;
            window.location.hash = "#blog?" + post;
            return;
        }
    }
    console.log("could not find post")
}