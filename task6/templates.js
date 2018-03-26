const templates = {
    addPostPage: (context) => {
        return `
        <div class="createPage">
            <div class="photoCreation">
                <img alt="photo" class="photo_image" src='images/dog.jpg'>
                <div class="photo_header">
                    <div class="information">
                        <h3>Work Of:</h3>
                        <div id='author_name'>
                            ${context.user}
                        </div>
                    </div>
                    <div class="information">
                        <h4>Hashtags</h4>
                        <div>
                            <input id="in_hashtags">
                        </div>
                    </div>
                    <div class="information">
                        <h4>Information</h4>
                        <div>
                            <textarea id="in_comments"></textarea>
                        </div>
                    </div>
                </div>
            </div><button class="endButton" onclick="addPost()">Add photo</button>
        </div>`
    },
    signInPage: () => {
        return `
        <div class="SignInPattern">
            <h1>PhotoPeace</h1>
            <div class="signInPage">
                <img alt="photo" src='images/man.jpg' width="600px">
                <div class="signInForm">
                    <div class="block">
                        <div class="details">
                            e-mail
                        </div><input class="details" id="login">
                    </div>
                    <div class="block">
                        <div class="details">
                            password
                        </div><input class="details" id="password">
                    </div><button class='endButton' id="LogIn" onclick="logIn()">LogIn</button>
                </div>
            </div>
            <div class="details">
                You Are What You See!
            </div>
        </div>`
    },
    errorPage: () => {
        return `
        <div class="Error">Error! Something went wrong :(</div>
        <div class="mistakePage">
            <img alt="photo" class="photo_image" src="images/mistake.jpg">
        </div>
        <button class="endButton" onClick="createMainPage()">Homepage</button>`
    },
    mainPage: () => {
        return `
            <h1>PhotoPeace</h1>
            <div id="posts_list"></div>
            <button id="load-more" class="endButton" onClick="pressLoadMoreButton()">
                load more
            </button>
        `
    },
    filteringBlock: () => {
        return `
            <div class="Add-photo">
                <p class="adding">Add new photo</p><i class="camera_enhance material-icons" onclick="MainToAdd()">camera_enhance</i>
            </div>
            <div class="filt">
                <div class="center_string">
                    Search
                </div>
                <div class="seach_tools">
                    <div class="search_names">
                        author
                    </div><select class="filter" id="author_filter">
                    </select>
                </div>
                <div class="seach_tools">
                    <div class="search_names">
                        date
                    </div><input class="filter" id="date_filter" type="date">
                </div>
                <div class="seach_tools">
                    <div class="search_names">
                        hashtag
                    </div><input class="filter" id="hashtag_filter" placeholder="#tag1,#tag2" type="text">
                </div>
                <div class="seach_tools">
                    <button class="ApplyFilters" onclick="showFittingPosts()">Apply filters</button>
                </div>
            </div>`
    },
    postBlock: (context) => {
        const post = context.post;
        const date = post.createdAt;
        
        const a = `
            <img alt="photo" class="photo_image" src=${post.photoLink}>
            <div class="photo_header">
                <div class="information">
                    <h3>Work Of:</h3>
                    <h3>${post.author}</h3>
                </div>
                <div class="information">
                    <h4>Data:</h4>
                    <h4>
                        ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}
                    </h4>
            </div>`;

        const b = `
            <div class="information">
                <h4>Hashtags</h4>
                <div class="hashtags">
                    ${post.Tags.join(" ")}
                </div>
            </div>`

        const c = `
            <div class="information">
                    <h4>Information</h4>
                    <div class="comments">
                    ${post.description}
                    </div>
                </div>
                <div class="icons">
                    <i class="edit_icon material-icons" onClick = "editPost('${post.id}')">mode_edit</i> 
                    <i class="like_icon material-icons">thumb_up</i> 
                    <i class="dislike_icon material-icons">thumb_down</i> 
                    <i class="delete_icon material-icons" onClick="removePost('${post.id}')">delete</i>
                </div>
            </div>`

        const content = (post.Tags.length == 0) ?  a + c :  a + b + c;
        return `<div class="photo_post">
                ${content}
            </div>`
    }
}

