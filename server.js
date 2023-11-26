// npm i nodemon -   
// npm init
// npm i date-fns      install date function
// npm i nodemon -D   nodeman install as dev dependency
// npm i uuid      generate different id
// npm i express
const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cors stand for cross origin resource sharing
const whitelist = ['https://www.google.lk','http://localhost:3500',  'http://127.0.0.1:5500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) { //no origin == undifined or fault
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// built in middleware to handle url encoded data
// in other wise , form data;
// 'content-type: appliction/x-www-form-urlencoded
app.use(express.urlencoded({extended: false})); 

// built in middleware for json
app.use(express.json());

// serve static files(automatically first check the public)
app.use(express.static(path.join(__dirname, '/public')));

// begin with "/" end with "/" or /index.html  ##(.html)$ does the .html optional
app.get('^/$|/index(.html)?', (req, res)=>{  
  // res.send('hello world');
  // res.sendFile('./views/index.html', {root: __dirname});
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res)=>{
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// re-directing the old page to the new page
app.get('/old-page(.html)?', (req, res)=>{
  res.redirect(301,'/new-page.html'); // 302 by default
});

// route handlers
app.get('/hello(.html)?', (req,res,next)=>{
  console.log('Attepted to load hello.html');
  next()
},(req,res)=>{
  res.send('hello world')
})

const one = (req,res,next) =>{
  console.log("one");
  next()
}
const two = (req,res,next) =>{
  console.log("two");
  next()
}
const three = (req,res,next) =>{
  console.log("three");
  // res.send('finished')
  next()
}

app.get('/chain(.html)?' , [one,two,three,(req, res) => {
  // Your fourth function logic here
  // For example:
  res.send('Hello from the fourth function!');
}]);



// if / with non route this show the 404.html what we have created manually
// app.get('/*', (req, res)=>{
//   res.status(404).sendFile(path.join(__dirname, 'views', '/404.html')); // 302 by default
// });

app.all('*', (req, res)=>{
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '/404.html')); // 302 by default
  } else if (req.accepts('json')){
    res.json({error: "404 Not found"});
  } else {
    res.type('txt').send("404 Not found");
  }
});

// error handling (cores)
app.use(errorHandler);

app.listen(PORT, () => {console.log(`Server running on PORT ${PORT}`);});


