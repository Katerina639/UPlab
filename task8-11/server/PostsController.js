const fs = require('fs');
const postsModule = require('../photos.js');

const filePath = `${__dirname}/data/posts.json`;
const content = JSON.parse(fs.readFileSync(filePath));
const posts = content.posts.map((post) => {
  post.createdAt = new Date(post.createdAt);
  return post;
});

function updateFile() {
  fs.writeFile(filePath, JSON.stringify({
    posts: posts
  }));
}

function createPost(post) {
  post.Tags = post.Tags.split('#').slice(1).map(elem => "#" + elem);
  post.likes = undefined;
  post.like = [];
  post.createdAt = new Date();
  if(!post.Tags) post.Tags = [];
  posts.addPhotoPost = postsModule.addPost;
  console.log(post);
  const createdPost = posts.addPhotoPost(post);
  if (createdPost) {
    updateFile();
    return createdPost;
  }
  return false;
}

function updatePost(id, fields) {
  posts.editPhotoPost = postsModule.editPost;
  if (posts.editPhotoPost(id, fields)) {
    updateFile();
    return posts.getPhotoPost(id);
  }
  return false;
}

function getPosts(skip, top, filterConfig) {
  posts.getPhotoPosts = postsModule.getPosts;
  return posts.getPhotoPosts(skip, top, filterConfig);
}

function getPost(id) {
  posts.getPhotoPost = postsModule.getPost;
  return posts.getPhotoPost(id);
}

function removePost(id) {
  posts.removePhotoPost = postsModule.removePost;
  const success = posts.removePhotoPost(id);
  if (success) {
    updateFile();
    return true;
  }
  return false;
}

function likePost(id, user) {
  posts.getPhotoPost = postsModule.getPost;
  const post = posts.getPhotoPost(id);
  if (post) {
    post.like.push(user);
    //post.like(user);
    updateFile();
    return posts.getPhotoPost(id);
  }
  return false;
}

module.exports = {
  likePost,
  updatePost,
  removePost,
  createPost,
  getPost,
  getPosts,
};