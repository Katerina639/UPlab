var photoPosts = [];
var number = 20;

let obj = {
    posts: []
}
let api = (function () {

    let PhotoPost = (function () {
        return class PhotoPost {

            constructor({
                            description,
                            createdAt,
                            author,
                            photoLink,
                            Tags = [],
                            like = [],
                            id,
                        }) {
                this.id = id;
                this.description = description;
                this.createdAt = createdAt;
                this.author = author;
                this.photoLink = photoLink;
                this.Tags = Tags;
                this.like = like;
            }

            getLikesCnt() {
                return this.like.length;
            }

            like(userName) {
                const ind = this.like.indexOf(userName);
                if (ind === -1) {
                    this.like.push(userName);
                } else {
                    this.like.splice(ind, 1);
                }
            }

            static validate(post) {
                return (
                    post instanceof PhotoPost &&
                    isString(post.id) && post.id.length > 0 &&
                    isString(post.description) && post.description.length < 200 &&
                    (post.createdAt instanceof Date) &&
                    isString(post.author) && post.author.length > 0 &&
                    isString(post.photoLink) && post.photoLink.length > 0 &&
                    post.Tags instanceof Array &&
                    post.like instanceof Array
                );
            }
        }

    })();

    function buildRequest(url, params = {}) {
        const stringParams = Object.keys(params)
            .filter(key => typeof params[key] !== 'undefined')
            .reduce(
                (res, key) => `${res}&${key}=${
                    params[key] instanceof Object ? JSON.stringify(params[key]) : params[key]}`,
                '',
            );
        return `${url}?${stringParams.slice(1)}`;
    }

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    function objectToFormData(obj) {
        const data = new FormData();
        Object.getOwnPropertyNames(obj)
            .forEach(key => data.append(key, obj[key]));
        return data;
    }

    function parsePost(rawPost) {
        const postObj = Object.assign({}, rawPost, {createdAt: new Date(rawPost.createdAt)});
        return new PhotoPost(postObj);
    }

    function getPost(id) {
        return fetch(buildRequest(`/posts/${id}`))
            .then(handleErrors)
            .then(response => response.json())
            .then(rawPost => parsePost(rawPost));
    }

    function getPosts(offset = 0, count = 10, filterConfig = {}) {
        return fetch(buildRequest('/posts', {offset, count, filterConfig}))
        .then(handleErrors)
        .then(response => response.json())
        .then(rawPosts => rawPosts.map(rawPost => parsePost(rawPost)));
    }

    function likePost(id, user) {
        return fetch(buildRequest(`/posts/${id}/like`, {user}), {
            method: 'PUT',
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => parsePost(json));
    }

    function createPost(post) {
        const data = objectToFormData(post);
        return fetch('/posts', {
            method: 'POST',
            body: data,
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => parsePost(json));

    }

    function updatePost(id, post) {
        const data = objectToFormData(post);
        return fetch(`/posts/${id}`, {
            method: 'PUT',
            body: data,
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => parsePost(json));
    }

    function deletePost(id) {
        return fetch(`/posts/${id}`, {
            method: 'DELETE',
        });
    }

    function poll() {
        return fetch('/poll')
            .then(handleErrors)
            .then(response => response.json())
            .then(postsRaw => postsRaw.map(rawPost => parsePost(rawPost)));
    }

    return {
        getPost,
        getPosts,
        likePost,
        createPost,
        updatePost,
        deletePost,
        poll
    }
})();

var functions = (function() {
    function loadPosts(offset = 0, count = 10, filterConfig){
        return api.getPosts(offset, count, filterConfig).then((posts) => {
            posts.forEach((post) => obj.posts.push(post));
            return obj.posts;
        });
    }
    return {
        loadState() {
            let storedList = JSON.parse(localStorage.getItem('photopeace_list'));
            if (storedList){
                for (post of storedList){
                    post.createdAt = new Date(post.createdAt);
                    this.push(post);
                }  
            }
        },
        saveState() {
            localStorage.setItem('photopeace_list', JSON.stringify(this))
        },
        getPosts(offset = 0, count = 10, filterConfig) {
            if (typeof offset !== 'number') {
                return;
            }
            return loadPosts(offset , count , filterConfig).then(posts => posts.filter((photo) => {
                if (filterConfig.hasOwnProperty('author')) {
                    if (filterConfig.author !== photo.author) return false;
                }
                if (filterConfig.hasOwnProperty('Date')) {
                    if (Date.parse(filterConfig.Date) !== Date.parse(photo.createdAt)) return false; 
                }
                if (filterConfig.hasOwnProperty('Tags')) {
                    if (!filterConfig.Tags.every((tag) => {
                            return photo.Tags.includes(tag);
                        })) return false;
                }
                return true;
            }));
        },
        getAuthorsList() {
            let photo_posts = this;
            let authors = [];
            for (post of photo_posts) {
                if (authors.indexOf(post.author) == -1) {
                    authors.push(post.author)
                }
            }
            return authors;
        },
        getPost(id) {
            if (typeof id !== 'string' || id === '') return;
            return this.find((el) => {
                return el.id === id;
            });
        },
        validatePost(photo) {
            if (typeof photo !== 'object') return false;
            if (typeof photo.id !== 'string' || photo.id === '') return false;
            if (typeof photo.description !== 'string' || photo.description === '' || photo.description.length > 200) return false;
            if (!(photo.createdAt instanceof Date)) return false;
            if (typeof photo.author !== 'string' || photo.author === '') return false;
            if (typeof photo.photoLink !== 'string' || photo.photoLink === '') return false;
            if (!Array.isArray(photo.Tags) || !Array.isArray(photo.like)) return false;
            return true;
        },
        addPost(photo) {
            console.log(photo);
            photo.id = "post_" + (++number).toString();
            if(api.createPost(photo)){
                return true;
                this.saveState()
            }
            else return false;
        },
        editPost(id, editPost) {
            if (typeof id !== 'string' || id === '' || typeof editPost !== 'object') {
                return false;
            }
            let post = this.getPost(id);
            if (post) {
                if (editPost.hasOwnProperty('description')) post.description = editPost.description;
                if (editPost.hasOwnProperty('photoLink')) post.photoLink = editPost.photoLink;
                if (editPost.hasOwnProperty('Tags')) post.Tags = editPost.Tags;
                if (editPost.hasOwnProperty('like')) post.like = editPost.like;
                this.saveState()
                return true;
            }
            return false;
        },
        removePost(id) {
            if (typeof id !== 'string' || id === '') {
                return false;
            }
            let element = this.findIndex((el) => {
                return el.id === id;
            });
            if (~element) {
                this.splice(element, 1);
                this.saveState()
                return true;
            }
            return false;
        }
    }
})();

for (method in functions) {
    photoPosts.__proto__[method] = functions[method];
}

photoPosts.loadState();