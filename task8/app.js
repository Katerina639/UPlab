const express = require('express');
const app = express();
const fs = require('fs');
const postsModule = require('./photos');
const path = 'server/data/posts.json';
bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

function readFile() {
    return JSON.parse(fs.readFileSync(path));
}

function writeFile(data) {
    fs.writeFileSync(path, JSON.stringify(data));
}

app.get('/getPost?:id', (req, res) => { 
    let photoList = readFile();
    photoList.getPost = postsModule.getPost;
    let post = photoList.getPost(req.query.id);
    if (post) {
        res.statusCode = 200;
        res.json(post);
    } else {
        res.statusCode = 404;
        res.end();
    }
})

app.post('/getPosts', (req, res) => { 
    let photoList = readFile();
    let top = req.query.top;
    let skip = req.query.skip;
    for (let item in photoList) {
        item.createdAt = new Date(item.createdAt);
    }
    let filterConfig = req.body;
    photoList.getPosts = postsModule.getPosts;
    let posts = photoList.getPosts(skip, top, filterConfig);
    if (posts) {
        res.status = 200;
        res.json(posts);
    } else {
        res.sendStatus(404);
    }
})

app.get('/getPosts', (req, res) => { 
    let photoList = readFile();
    res.json(posts);
})

app.delete('/removePost?:id', (req, res) => { 
    let photoList = readFile();
    photoList.removePost = postsModule.removePost;
    if (photoList.removePost(req.query.id)) {
        writeFile(photoList);
        res.status = 200;
        res.send("Ok! Post removed!");
    } else {
        res.status = 404;
        res.send("Ooooooooh... Foo! Post is absent");
    }
})

app.post('/addPost', (req, res) => {
    let photoList = readFile();
    let post = req.body;
    post.createdAt = new Date();
    photoList.addPost = postsModule.addPost;
    if (photoList.addPost(post)) {
        writeFile(photoList);
        res.status = 200;
        res.send("Ok! Post added");
    } else {
        res.status = 404;
        res.send("Ooooooooh... Foo! Some problems! Can't add post!");
    }
})

app.put('/editPost?:id', (req, res) => {
    let photoList = readFile();
    let post = req.body;
    let id = req.query.id;
    console.log();
    photoList.editPost = postsModule.editPost;
    if (photoList.editPost(id, post)) {
        writeFile(photoList);
        res.status = 200;
        res.send("Ok! Post changed!");
    } else {
        res.status = 404;
        res.send("Bad work :( Post not changed... Ooooooooh... Foo!");
    }
})

app.get('/', function(req, res) {
    res.send('/public/index.html');
})

app.listen(3000, function() {
    console.log(`Server is listening on port 3000`)
})
