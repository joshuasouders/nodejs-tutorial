var pg = require("pg"),
	express = require('express'),
	d3 = require('d3'),
	fs = require('fs'),
	routes = require('./routes');

app = express();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

var conString = JSON.parse(fs.readFileSync('config.json')).connection;

app.listen(8888);
console.log('Listening on port 8888');



app.get('/', function(req, res){
	res.render('index.html');
});

app.get('/request', function(req, res){

	
	console.log(conString);

	var client = new pg.Client(conString);
	client.connect();

	var query = client.query("SELECT county, population2011 FROM cnty_population");

	query.on("row", function (row, result) {
		result.addRow(row);
	});

	query.on("end", function (result) {
		var str=JSON.stringify(result.rows, null, "    ");
		res.end(str);
	});
});

