//module
const dom = (function () {
    return {
        posts_on_page: 5,
        page: 0,

        loadPage() {
            let user = 'Kate'; 
        
            if (!user) {
                let signButton = document.createElement("button")
                signButton.classList.add("LogIn");
                signButton.innerText = "Log in";
                let element = document.getElementById("User")
                element.replaceWith(signButton);
                element = document.getElementById("LogOut");
                element.innerText = "Registration";
            } else {
                let element = document.getElementById("User").textContent = user;
            }
        },

        getPhotoListElement() {
            return document.getElementById('posts_list')
        },

        getPostElement(post) {
            let element = document.createElement("div");
            element.id = post.id;
            element.classList.add("post");
            element.innerHTML = this.createHTMLforPost(post);

            return element;
        },

        displayPosts(posts) {
            let list_element = this.getPhotoListElement()
            
            for (post of posts) {
                let element = this.getPostElement(post)
                list_element.appendChild(element);
            }
        },
        getCurrentFilterConfig(){
            let author_filter = document.getElementById('author_filter').value
            let date_filter = document.getElementById('date_filter').value
            let hashtag_filter = document.getElementById('hashtag_filter').value

            let filter = {}

            if (author_filter) filter.author = author_filter;
            if (date_filter) {
                let b = date_filter.split(/\D/);
                filter.Date = new Date(b[0], b[1], b[2]);
            }
            if (hashtag_filter) { 
                filter.Tags = hashtag_filter.split(',');
            }

            return filter
        },
        applyFilters() {
            dom.page = 0;
            this.clearPostsDom()
            this.displayPosts(this.getPostsSlice())
        },
        clearElementContents(element){
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        },
        clearPostsDom() {
            let list_element = this.getPhotoListElement()
            this.clearElementContents(list_element)
        },
        getPostsSlice() {
            let filterConfig = dom.getCurrentFilterConfig()

            let offset = dom.page * dom.posts_on_page
            let count = dom.posts_on_page
            
            return photoPosts.getPosts(offset, count, filterConfig);
        },
        loadMorePosts() { 
            this.page += 1;
            this.displayPosts(this.getPostsSlice())
        },
        updateAuthorSelect(){
            let select_el = document.getElementById('author_filter');
            this.clearElementContents(select_el);

            let authors = photoPosts.getAuthorsList();
            let option = document.createElement("option");
            option.value = '';
            option.text = '- all auhtors -';
            select_el.add(option);

            for (author of authors){
                option = document.createElement("option");
                option.value = author;
                option.text = author;
                select_el.add(option);
            }
        },
        removePost(id) {
            let element = document.getElementById(id);
            if (element) { 
                element.remove();
                return true;
            }
            return false;
        },
        editPost(id, post) {
            let postToEdit = document.getElementById(id);
            if (postToEdit) {
                let element = this.getPostElement(post);
                postToEdit.replaceWith(element);
            }
        },
        createHTMLforPost(post) {
            let data = post.createdAt;
            let a = `
            <div class="photo_post">
            <img alt="photo" class="photo_image" src=${post.photoLink}>
            <div class="photo_header">
                <div class="information">
                    <h3>Work Of:</h3>
                    <h3>${post.author}</h3>
                </div>
                <div class="information">
                    <h4>Data:</h4>
                    <h4>
                ${data.getDate()}.${data.getMonth() + 1}.${data.getFullYear()}
                </h4>
                </div>`;
            let b = `
                <div class="information">
                    <h4>Hashtags</h4>
                    <div class="hashtags">
                    ${post.Tags.join(" ")}
                    </div>
                </div>`
            let c = `
            <div class="information">
                    <h4>Information</h4>
                    <div class="comments">
                    ${post.description}
                    </div>
                </div>
                <div class="icons">
                    <i class="edit_icon material-icons">mode_edit</i> 
                    <i class="like_icon material-icons">thumb_up</i> 
                    <i class="dislike_icon material-icons">thumb_down</i> 
                    <i class="delete_icon material-icons" onClick="removePost('${post.id}')">delete</i>
                </div>
            </div>
        </div>`

        if (post.Tags.length == 0) {
            return a + c;
        } else {
            return a + b + c;
        }
    }
    }
})();


function displayPosts() {  
    dom.displayPosts(dom.getPostsSlice());
}

function addPost(post) { 
    if (photoPosts.addPost(post)) {
        showFittingPosts();
        return true;
    }
    else return false;
}

function removePost(id) {
    if (photoPosts.removePost(id)) {
        if (dom.removePost(id)) {
            showFittingPosts();
        }
        return true;
    }
    return false;
}
function editPost(id, newPost) {
    if (photoPosts.editPost(id, newPost)) {
        dom.editPost(id, photoPosts.getPost(id));
        return true;
    }
    return false;
}
function pressLoadMoreButton() {
    dom.loadMorePosts();
}

function showFittingPosts(){
    dom.applyFilters();
}

window.addEventListener('load', () => {
    dom.loadPage();
    dom.updateAuthorSelect();
    displayPosts();

    let post1 = {
        description: 'My fauvorite actor',
        createdAt: new Date(2019, 02, 17),
        author: 'Ginzburg Andrey',
        photoLink: 'http://cdn.collider.com/wp-content/uploads/daniel_radcliffe_01.jpg',
        Tags: ['#HarryPotter'],
        like: ['Julia', 'Boris', 'Kate']
    }

    addPost(post1);
    removePost("post_1");
    editPost('post_4', {
            photoLink: 'images/dog.jpg',
            description: 'Nice Day'
    })
   pressLoadMoreButton() 
})