/* changeblog */


var blogData = {}

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


function formatPost(data) {
    let ret = "<div class='blog-post'>"
    if (data['image']){ret += "<img class='blog-image' src='" + data["image"] + "'>"}
    ret += "<table class='blog-table'><tbody><tr>"
    if (data['author']){ret += "<td>" + data['author'] + "</td>"}
    if (data['title']){ret += "<td>" + data['title'] + "</td>"}
    if (data['date']){ret += "<td>" + data['date'] + "</td>"}
    ret += "</tr></tbody></table>"
    if (data['content']){
        ret += "<div class='blog-content'>"
        for (let p in data['content']) {
            ret += "<p>" + data['content'][p] + "</p>"
        }
        ret += "</div>"
    }
    
    return ret + "</div>";
}

function blogContent(data) {
    ret = "";
    for (let post in data['allPosts']) {
        ret += formatPost(data['allPosts'][post])
    }

    return ret
}

function populateBlogDiv(data) {
    var bl = document.getElementById('blog-div')
    var fullContent = ""
    //fullContent += changelogHeader()
    //fullContent += changelogNext() + "<hr>"
    fullContent += blogContent(data) + "You reached the end of the changeblog!"


    fullContent = fullContent.replace("[discord]", "<a href='https://discord.gg/vGwKZep'>discord</a>")
    //fullContent = fullContent.replace("[test-branch]", "<a href='https://thederpymemesquad.github.io/ibr-beta/client/index.html'>test branch</a>")
    
    bl.innerHTML = fullContent;
}

function wait(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

async function loadBlog() {
    //await wait(1000)
    return fetch("./blog.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }
        return res.json()
    })
    .then((data) => {
        populateBlogDiv(data)
        return true;
    })
    .catch((err) => {
        throw err;
    })
    
}