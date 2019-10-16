require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const Post = require("./Post");
const port = process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.MONGURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.post('/', async (req, res) => {
    const post = await Post.create(req.body)
    res.json(post);
});

// READ single
app.get('/:post_id', async (req, res) => {

    const post = await Post.findById(req.params.post_id);
    req.json(post);

});

// UPDATE
app.put('/:post_id', async (req, res) => {

    const post = await Post.findByIdAndUpdate(req.params.post_id, req.body);
    req.json(post);
});



// DELETE
app.delete('/:post_id', async (req, res) => {

    await Post.findByIdAndRemove(req.params.post_id);
    res.json(`Post  #${req.params.post_id} deleted`);
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));