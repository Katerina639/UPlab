//module
const dom = (function() {
    return {
        posts_on_page: 5,
        page: 0,
        user: 'Kate Kunts',
        LogInOrUser: 1,
        swapButtons(a, a_text, b) {
            let signButton = document.createElement("button")
            signButton.id = a;
            signButton.innerText = a_text;
            let element = document.getElementById(b)
            element.replaceWith(signButton);
        },
        loadPage() {
            if (!dom.user) {
                if (this.LogInOrUser == 1) {
                    this.swapButtons("LogIn", "Log In", "User");
                    this.swapButtons("Registration", "Registration", "LogOut")
                    this.LogInOrUser = 0;
                }
            } else {
                if (this.LogInOrUser == 0) {
                    this.swapButtons("User", dom.user, "LogIn");
                    this.swapButtons("LogOut", "Log Out", "Registration")
                    this.LogInOrUser = 1;
                }
            }
        },
    getMainElement() {
        return document.getElementById('main');
    },
    getFilteringElement() {
        return document.getElementById('filtering');
    },
    getPhotoListElement() {
        return document.getElementById('posts_list')
    },
    getMainPage() {
        let element = document.createElement("div");
        element.classList.add("main");
        element.innerHTML = templates.mainPage();
        return element;
    },
    getFiltering() {
        let element = document.createElement("div");
        element.classList.add("filtering");
        element.innerHTML = templates.filteringBlock();
        return element;
    },
    getPostElement(post) {
        let element = document.createElement("div");
        element.id = post.id;
        element.classList.add("post");
        element.innerHTML = templates.postBlock({post: post})
        return element;
    },
    getAddElement() {
        let element = document.createElement("div");
        element.classList.add("addPage");
        element.innerHTML = templates.addPostPage({user: this.user}) 
        return element;
    },
    getEditElement(post) {
        let element = document.createElement("div");
        element.classList.add("editPage");
        element.innerHTML = templates.editPostPage({user: this.user, post:post}) 
        return element;
    },
    getMistakeElement() {
        let element = document.createElement("div");
        element.classList.add("mistakePage");
        element.innerHTML = templates.errorPage();
        return element;
    },
    getSignInElement() {
        let element = document.createElement("div");
        element.classList.add("signInPage");
        element.innerHTML = templates.signInPage()
        return element;
    },

    createMainPage() {
        this.createFilter();
        this.clearMain();
        let list_element = this.getMainElement()
        let element = this.getMainPage();
        list_element.appendChild(element);
        this.applyFilters();
    },
    createFilter() {
        let element = this.getFilteringElement();
        let element_content = this.getFiltering();
        element.appendChild(element_content);
        this.updateAuthorSelect();
    },
    createAddPage() {
        this.clearMain();
        let list_element = this.getMainElement()
        let element = this.getAddElement();
        list_element.appendChild(element);
    },
    createEditPage(post) {
        this.clearMain();
        let list_element = this.getMainElement()
        let element = this.getEditElement(post);
        list_element.appendChild(element);
    },
    createMistakePage() {
        this.clearMain();
        let list_element = this.getMainElement()
        let element = this.getMistakeElement();
        list_element.appendChild(element);
    },
    createSignInPage() {
        this.clearMain();
        let list_element = this.getMainElement()
        let element = this.getSignInElement();
        list_element.appendChild(element);
    },

    getCurrentPhoto(isEdit) {
        let currentAuthor = dom.user
        let currentHashtag = document.getElementById('in_hashtags').value
        let currentComment = document.getElementById('in_comments').value
        let currentPhoto
        if (isEdit === false) {
            currentPhoto = document.getElementById('in_photo').value
        } else {
            currentPhoto = document.getElementById('editPhotoLink').value
        }
        let post = {
            description: currentComment,
            createdAt: new Date(), /////////////////
            author: currentAuthor,
            photoLink: currentPhoto, /////////////////
            Tags: [currentHashtag], ////////////////////////////
            like: []
        }
        return post
    },
    getCurrentFilterConfig() {
        let author_filter = document.getElementById('author_filter').value
        let date_filter = document.getElementById('date_filter').value
        let hashtag_filter = document.getElementById('hashtag_filter').value
        let filter = {}
        if (author_filter) filter.author = author_filter;
        if (date_filter) {
            let b = date_filter.split(/\D/);
            const [year, month, day] = b;
            filter.Date = new Date(year, month, day);
        }
        if (hashtag_filter) {
            filter.Tags = hashtag_filter.split(',');
        }
        return filter
    },
    getCurrentName() {
        let author = document.getElementById('login').value
        dom.user = author;
    },
    getCurrentPostToEdit(id) {
        let element = document.getElementById(id);
        document.getElementById('in_hashtags').value = element.Tags.length;
        document.getElementById('in_comments').value = element.description;
        document.getElementById('in_photo').value = element.photoLink;
    },

    displayPosts(posts) {
        let list_element = this.getPhotoListElement()
        for (post of posts) {
            let element = this.getPostElement(post)
            list_element.appendChild(element);
        }
    },
    applyFilters() {
        this.clearAllPageElements()
        this.displayPosts(this.getPostsSlice())
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
    updateAuthorSelect() {
        let select_el = document.getElementById('author_filter');
        this.clearElementContents(select_el);
        let authors = photoPosts.getAuthorsList();
        let option = document.createElement("option");
        option.value = '';
        option.text = '- all auhtors -';
        select_el.add(option);
        for (author of authors) {
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

    clearElementContents(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    clearAllPageElements() {
        dom.page = 0;
        this.clearPostsDom()
    },
    clearPostsDom() {
        let list_element = this.getPhotoListElement()
        this.clearElementContents(list_element)
    },
    clearMain() {
        let element = this.getMainElement()
        this.clearElementContents(element);
    },
    clearFiltering() {
        let element = document.getElementById('filtering');
        this.clearElementContents(element);
    },
}
})();

function loadPage() {
    dom.loadPage();
}

function displayPosts() {
    dom.displayPosts(dom.getPostsSlice());
}

function addPost() {
    const post = dom.getCurrentPhoto(false)
    if (photoPosts.addPost(post)) {
        createMainPage();
        displayPosts();
        return true;
    } else return false;
}

function removePost(id) {
    if (dom.user === photoPosts.getPost(id).author) {
        if (photoPosts.removePost(id)) {
            if (dom.removePost(id)) {
                showFittingPosts();
            }
            return true;
        }
    }
    return false;
}

function editPost(id) {
    if (dom.user === photoPosts.getPost(id).author) {
        MainToEdit(photoPosts.getPost(id));
        //dom.getCurrentPostToEdit(id);
        newPost = dom.getCurrentPhoto(true);
        if (photoPosts.editPost(id, newPost)) {
            dom.editPost(id, photoPosts.getPost(id));
            return true;
        }
    }
    return false;
}

function pressLoadMoreButton() {
    dom.loadMorePosts();
}

function showFittingPosts() {
    dom.applyFilters();
}

function updateAuthorSelect() {
    dom.updateAuthorSelect();
}

function MainToAdd() {
    clearMainPage();
    createAddPage();
}

function MainToEdit(post) {
    clearMainPage();
    createEditPage(post);
}

function clearMainPage() {
    dom.clearFiltering();
    dom.clearMain();
}

function createAddPage() {
    dom.createAddPage();
}

function createEditPage(post) {
    dom.createEditPage(post);
}

function createMainPage() {
    clearMainPage()
    dom.createMainPage();
}

function createMistakePage() {
    dom.createMistakePage();
}

function createSignInPage() {
    dom.createSignInPage();
}

function MainToSignIn() {
    clearMainPage();
    createSignInPage();
}

function MainToMistake() {
    clearMainPage();
    createMistakePage();
}

function logOut() {
    dom.user = null;
    dom.loadPage();
    MainToSignIn();
}

function logIn() {
    dom.getCurrentName();
    dom.loadPage();
    createMainPage();
}
window.addEventListener('load', () => {
    loadPage();
    createMainPage();
})