var photoPosts = [];
var number = 20;
var functions = (function() {
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
            if (typeof offset !== 'number') {
                return;
            }
            let photo_posts = this;
            if (typeof filterConfig === 'object') {
                photo_posts = photo_posts.filter((photo) => {
                    if (filterConfig.hasOwnProperty('author')) {
                        if (filterConfig.author !== photo.author) return false;
                    }
                    if (filterConfig.hasOwnProperty('Date')) {
/*////////////////////*/if (Date.parse(filterConfig.Date) !== Date.parse(photo.createdAt)) return false; 
                    }
                    if (filterConfig.hasOwnProperty('Tags')) {
                        if (!filterConfig.Tags.every((tag) => {
                                return photo.Tags.includes(tag);
                            })) return false;
                    }
                    return true;
                });
            }
            return photo_posts.slice(offset, offset + count);
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
            photo.id = "post_" + (++number).toString();
            if (!this.validatePost(photo)) {
                number = number - 1;
                return false;
            }
            this.push(photo);
            this.sort((photo1, photo2) => (photo2.createdAt - photo1.createdAt));
            this.saveState()
            return true;
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