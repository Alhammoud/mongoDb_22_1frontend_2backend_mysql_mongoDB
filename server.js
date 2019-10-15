const express = require('express');
const app = express();

const mysql = require('mysql');


 const connection = mysql.createConnection({
    host: 'localhost',
    user: 'zohir',
    password: 'password',
    database: 'miniblog'
});

app.use(express.json());
app.use('/', express.static('public'));


/* 
app.get(`/`, (request, response) => {
    return response.send('Hello World in server.js  .. !')
}); 

 */





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



console.log('Hallo World from Backend.');
app.listen(3000);
