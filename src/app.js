const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
	  mysql = require('mysql'),
	  session = require('express-session'),
      myConnection = require('express-myconnection');
const app = express();
// importing routes
const system = require('./routes/system');
const fileUpload = require('express-fileupload')
// -------------- ports -------------
const port = 3000; 		// port to use on local machines
// const port = 21013; 	// port to use on webhosts
// --------------------------------
// settings
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middlewares
app.use(morgan('dev'));
app.use(session({ secret: 'produnox'}));
app.use(myConnection(mysql, 
{
	// ----------- db credencials ------------
	host: 'mysql.produnox.kinghost.net',
	user: 'produnox',
	password: 'produnox1',
	port: 3306,
	database: 'produnox'
	// host: 'localhost',
	// user: 'root',
	// password: 'root',
	// port: 3306,
	// database: 'produnox'
}, 'single'));
app.use(fileUpload());
app.use(express.urlencoded({extended: false}));
// routes
app.use('/', system);
app.use('/', system);
// static files
app.use('/static', express.static(path.join(__dirname, 'public')));
// starting the server
app.listen(port);
