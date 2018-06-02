//express is a web framework for node.js
const express = require('express');
//to render templates with data, we install npm package for handlebars.js
const hbs = require('hbs');
const fs = require('fs');

//Creates an Express application. The express() function is a top-level function exported by the express module.
let app = express();

//registerPartitials() collects reusable template as files in partials dir; use '{{>filename}}' to replace orginal code position
hbs.registerPartials(__dirname + '/views/partials');
//Using hbs as the default view engine
app.set('view engine', 'hbs');
//middleware functions that can be used as the callback argument to app.use()
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});//the function inside middleware is the same as below inside app.get(), except need next() to finish async function

//the middleware below can be used during maintainance
app.use((req, res, next) => {
    res.render('maintainance.hbs');
});
//registerHelper(): create helper function for reusable, 1st arg is function name; 2nd arg is function definition
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});//to use helper function, paste {{function name}} in html file

hbs.registerHelper('toUpperCase', (text) => {
    return text.toUpperCase();
});//to use helper function, paste {{function name arguments}} in html file

//when someone requests page route '/', the callback function will run
//req(request): include data like header, body, status...
//res(response): include a bunch of methods that could respond to http request
//res,send(): Send a response of various types.
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Start',
        welcomeMsg: 'Hello!'
    });
    // res.send({
    //     name: 'Andrew',
    //     likes: ['Biking', 'Cities']
    // });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Us'
    });
});

app.get('/bad', (req, res) => {
    res.send('<h3>Unable to connect!</h3>');
});

//Binds and listens for connections on the specified host and port. This method is identical to Node’s http.Server.listen().
app.listen(3000);