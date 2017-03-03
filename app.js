const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const cors = require('cors');
var ejs = require('ejs');
// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', function() {
  console.log('Connected to '+config.database);
});

// On Error
mongoose.connection.on('error', function(err) {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');

const port = 8080  ;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(users);
app.set('views', path.join(__dirname, 'public'));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Start Server
app.listen(port, function() {
  console.log('Listening on port '+port);
});


/*error: function(error){
          if(error.responseText == 'showSignUpAlert')
            {
              alert("Account Successfully Created. Log in Now!");
            }
          }*/
