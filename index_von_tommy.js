require('dotenv').config();
const express  = require("express");
const mongoose = require("mongoose");
const app = express();

const port=process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.MONGURL,{
    useNewUrlParser: true,
    useCreateIndex: true,
     useUnifiedTopology: true
});

const Post = require("./Post");

app.get('/',async(req,res) =>{
    const posts = await Post.find();
    res.json(posts);
});

app.post('/', async(req,res) =>{
    const post = await Post.create(req.body)
    res.json(post);
});

app.listen(post, () => console.log(`Example app listening on port ${post}`));