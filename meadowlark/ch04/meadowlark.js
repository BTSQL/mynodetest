var express = require('express');
var app = express();



//핸들바 뷰 엔진 설정
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 9000);

app.use(express.static(__dirname + '/public'));


/* export 해서 포춘쿠기 사용하기*/
var fortune = require('./lib/fortune.js'); 

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', { fortune: fortune.getFortune() }); 
});

// 커스텀 404
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 커스텀 500
app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500);
    res.render('500');
});


/*  뷰 엔진을 사용하기전에 작성한 코드  */
/* START
app.get('/', function(req, res){
    res.type('text/plain');
    res.send('Meadowlark Travel');
});

app.get('/about', function(req, res){
    res.type('text/plain');
    res.send('this is about pages');    
});

// 커스텀 404
app.use(function(req, res, next){
    res.type('text/plain');
    res.status(404);
    res.send('404 - NOT Found');
});

// 커스텀 500
app.use(function(err, req, res, next){
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
END */
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});