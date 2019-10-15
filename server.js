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
    return res.send(found);

})


app.post('/blogpostmongodb', async (req, res) => {

    if (!(req.body.title || req.body.content)) {
        return res.send({
            error: 'Titel and content required'
        });
    }

    const post = await Post.create(req.body)
    res.json(post);


});






console.log('Hallo World from Backend.');
app.listen(3000);