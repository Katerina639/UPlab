var filterConfig1 = {
    author: 'Kate Kunts'
}

var filterConfig2 = {
    Tags: ['#Deer']
}

var filterConfig3 = {
    Date: new Date(2018, 02, 14)
}

var filterConfig4 = {
    author: 'Pups',
    Date: new Date(2018, 02, 14)
}

var filterConfig5 = {
    author: 'Ketko Evgenia',
    Date: new Date(2017, 02, 16)
}




console.log("\ntesting getPosts\n")
console.log("skip and top = default    :", photoPosts.getPosts());
console.log("skip = 4 and top = default:", photoPosts.getPosts(4));
console.log("skip = 7 and top = 4      :", photoPosts.getPosts(7, 4));
console.log("filtering1     :", photoPosts.getPosts(0, 10, filterConfig1));
console.log("filtering2     :", photoPosts.getPosts(0, 10, filterConfig2));
console.log("filtering3     :", photoPosts.getPosts(0, 10, filterConfig3));
console.log("filtering4     :", photoPosts.getPosts(0, 10, filterConfig4));
console.log("filtering5     :", photoPosts.getPosts(0, 10, filterConfig5));
console.log("invalid value  :", photoPosts.getPosts(""))


console.log("\ntesting getPost\n");
console.log("1 id       :", photoPosts.getPost('1'));
console.log("7 id      :", photoPosts.getPost('7'));
console.log("invalid id (42):", photoPosts.getPost('42'));

console.log("\ntesting validatePost\n");
console.log("Good post    :", photoPosts.validatePost({
    id: 'post_15',
    description: 'My fauvorite actor',
    createdAt: new Date(2017, 02, 17),
    author: 'Ginzburg Andrey',
    photoLink: 'http://cdn.collider.com/wp-content/uploads/daniel_radcliffe_01.jpg',
    Tags: ['#HarryPotter'],
    like: ['Julia', 'Boris', 'Kate']
}));
console.log("invalid link:", photoPosts.validatePost({
    id: 'post_15',
    description: 'My fauvorite actor',
    createdAt: new Date(2017, 02, 17),
    author: 'Ginzburg Andrey',
    photoLink: '',
    Tags: ['#HarryPotter'],
    like: ['Julia', 'Boris', 'Kate']
}));
console.log("invalid date:", photoPosts.validatePost({
    id: 'post_15',
    description: 'My fauvorite actor',
    createdAt: "nfdv",
    author: 'Ginzburg Andrey',
    photoLink: 'http://cdn.collider.com/wp-content/uploads/daniel_radcliffe_01.jpg',
    Tags: ['#HarryPotter'],
    like: ['Julia', 'Boris', 'Kate']
}));

console.log("\ntesting addPost\n");
console.log("all posts:", photoPosts);
console.log("invalid post:", photoPosts.addPost({
    description: 'My fauvorite actor',
    createdAt: new Date(2017, 02, 17),
    author: '',
    photoLink: 'http://cdn.collider.com/wp-content/uploads/daniel_radcliffe_01.jpg',
    Tags: ['#HarryPotter'],
    like: ['Julia', 'Boris', 'Kate']
}));
console.log("all posts:", photoPosts);
console.log("valid post  :", photoPosts.addPost({
    description: 'My fauvorite actor',
    createdAt: new Date(2017, 02, 17),
    author: 'Ginzburg Andrey',
    photoLink: 'http://cdn.collider.com/wp-content/uploads/daniel_radcliffe_01.jpg',
    Tags: ['#HarryPotter'],
    like: ['Julia', 'Boris', 'Kate']
}));
console.log("all posts:", photoPosts);


console.log("\ntesting editPost\n");
console.log("4th id now:", photoPosts.getPost('post_4'));
console.log("edit post 4   :", photoPosts.editPost('post_4', {
    photoLink: 'images/photo3.jpg',
    description: 'Nice Day'
}));
console.log("post 4 :", photoPosts.getPost('post_4'));
console.log("invalid value        :", photoPosts.editPost(''));


console.log("\ntesting removePost-");
console.log("invalid value:", photoPosts.removePost(''));
console.log("remove 5th post     :", photoPosts.removePost('post_5'));
console.log("get 5th post :", photoPosts.getPost('post_5'));