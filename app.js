// Environment
require('dotenv').config();

// Load dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialise application
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Create a connection
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'bulletinboard',
  password: process.env.DB_PASSWORD || 'bulletinboard',
  database: process.env.DB_NAME || 'bulletinboard',
});

// Index page with messages
app.get('/', function (request, response) {
    pool.query('SELECT * FROM messages ORDER BY id DESC', (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            response.render('index', {posts: res.rows});
        }
    });
});

app.get('/new', function (request, response) {
  response.render('new');
});

app.post('/create', function(request, response) {
    var title = request.body.title;
    var body = request.body.body;

    const text = 'INSERT INTO messages(title, body) VALUES($1, $2) RETURNING *'
    const values = [title, body]

    pool.query(text, values, (error, result) => {
        if (error) {
            console.log(error.stack);
        } else {
            response.redirect('/');
        }
    })
});

app.use(express.static('public'));

// Start a new server on 3000
app.listen(3000, function(){
  console.log('Server is running on port 3000');
});