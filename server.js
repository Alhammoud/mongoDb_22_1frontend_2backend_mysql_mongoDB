const express = require('express');
const app = express();

app.use(express.json());
app.use('/', express.static('public'));

// use mysqlDB :

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'zohir',
    password: 'password',
    database: 'miniblog'
});

app.get('/blogposts', (req, res) => {
    const query = `select * from blogpost order by id desc`;

    connection.query(query,
        (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            return res.send(rows);
        });
})


app.post('/blogposts', (req, res) => {
    if (!(req.body.title || req.body.content)) {
        return res.send({
            error: 'Titel and content required'
        });
    }

    const query = `insert into blogpost (
            created, title, content
            )
            values (
                now(),?,?
                )`;

    connection.query(
        query, [req.body.title, req.body.content],
        (err, result) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            return res.send({
                error: 0,
                result: result.id
            });
        });

});




// use mongoDB

const mongoose = require('mongoose');
const Post = require("./Post");

require('dotenv').config();

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.get('/blogposts_mongo_db', async (req, res) => {

    const found = await Post.find() // finde() ist ein mongoose methode
    res.send(found);

})

app.post('/blogpostmongodb', async (req, res) => {

    if (!(req.body.title || req.body.content)) {
        res.send({
            error: 'Titel and content required'
        });
    }

    const post = await Post.create(req.body)
    res.json(post);


});


app.get('/:post_id', async (req, res) => {

    console.log('req.params.post_id', req.params.post_id);

    const found = await Post.findById(req.params.post_id);

    res.json(found);
});


// UPDATE DOC

/* app.post('/:post_id', async (req, res) => {
    const found = await Post.findById(req.params.post_id)
      await found.update(req.body);
    return res.json(found);
}); */

// app.post('/:post_id', async (req, res) => {
// const found = await Post.findById(req.params.post_id)
// const found = await Post.findByIdAndUpdate(req.params.post_id, req.body);
// const updatedPost = await found.update(req.body);
// console.log( 'req.body',  req.body);
// console.log('found',found);
// console.log('await Post.findByIdAndUpdate(req.params.post_id, req.body)',await Post.findByIdAndUpdate(req.params.post_id, req.body));
// return res.json(await Post.findById(req.params.post_id));
//  return res.json(req.body);
// })


/* app.post('/:post_id', async (req, res) => {
    return res.json(await Post.findByIdAndUpdate(req.params.post_id, req.body,{new: true}));
}) */

app.put('/:post_id', async (req, res) => {

    /* const post = await Post.findByIdAndUpdate(req.params.post_id, req.body);
    req.json(post); */

    res.json(await Post.findByIdAndUpdate(req.params.post_id, req.body, {
        new: true
    }));
});




// DELETE
app.delete('/:post_id', async (req, res) => {

    await Post.findByIdAndRemove(req.params.post_id);
    res.json(`Post  #${req.params.post_id} deleted`);
});


console.log('Hallo World from Backend.');
app.listen(3000);