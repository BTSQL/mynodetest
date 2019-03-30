var express = require('express');
var app = express();

// set up handlebars view engine 
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' }); 
app.engine('handlebars', handlebars.engine); 

/* 실습완료 */
/*
var fortunes = [
        "Conquer your fears or they will conquer you.",        
        "Rivers need springs.",        
        "Do not fear what you don't know.",        
        "You will have a pleasant surprise.",        
        "Whenever possible, keep it simple.", 
        ]; 
*/
var fortunelib = require('./lib/fortune.js');

app.use(express.static(__dirname+'/public'));

app.set('view engine', 'handlebars');
app.set('port',process.env.PORT || 9000);

// set 'showTests' context property if the querystring contains test=1

app.use(function(req, res, next){

	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';

	next();

});
/*
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') != 'production' && req.query.test === '1';
	next();
});
*/

app.get('/',function(req,res){
	res.render('home');
});

app.get('/about',function(req,res){
	
	// 실습으로 생략 
	// var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about',{fortune: fortunelib.getFortune(),
						pageTestScript: '/qa/tests-about.js'});

});

app.get('/tours/hood-river', function(req, res){        
	res.render('tours/hood-river'); 
}); 

app.get('/tours/request-group-rate', function(req, res){        
	res.render('tours/request-group-rate'); 
}); 


app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	res.status(500);
	res.render('500');
});

/*
app.get('/', function(req, res){        
	res.type('text/plain');        
	res.send('Meadowlark Travel'); 
});

app.get('/about', function(req, res){        
	res.type('text/plain');        
	res.send('About Meadowlark Travel'); 
});

// custom 404 page 
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');

});

// custom 505 page
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});
*/
app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:'+app.get('port')+'; press Ctrl-C to terminate');
});


