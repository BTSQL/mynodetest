var express = require('express');
/* export 해서 포춘쿠기 사용하기*/
var fortune = require('./lib/fortune.js'); 

var formidable = require('formidable');
var jqupload =  require('jquery-file-upload-middleware');
var express_handlebars_sections = require('express-handlebars-sections');

var app = express();

//핸들바 뷰 엔진 설정
// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    section :  express_handlebars_sections() 
    //extname : 'hbs',  // 확장자 변경 
    /*helpers : {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }*/
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 9000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({extended: true}));


/* 쿼리스트링에 따라서 테스트코드를 넣고 빼는 기능 라우터들보다 앞에 있어야함 */
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// mocked weather data
function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials)
        res.locals.partials ={};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});


// jQuery File Upload endpoint middleware
app.use('/upload', function(req, res, next){
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function(){
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function(){
            return '/uploads/' + now;
        },
    })(req, res, next);
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});


app.get('/', function(req, res){
    res.render('home');
});

app.get('/contest/vacation-photo', function(req, res){
    var now = new Date();
    res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/newsletter',function(req, res){
    res.render('newsletter', {csrf : 'CSRF tocken goes here'});

});
app.post('/process', function(req, res){
    console.log("test1");
    if(req.xhr || req.accepts('json,html')==='json'){
        console.log("test3");
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        console.log("test2");
        res.redirect(303, '/thank-you');
    }
});

app.get('/about', function(req, res){
    res.render('about', { 
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js' 
    });
});

app.get('/tours/hood-river', function(req, res){        
    res.render('tours/hood-river'); 
}); 

app.get('/tours/oregon-coast', function(req, res){
    res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate'); 
}); 

app.get('/jquery-test', function(req, res){
    res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});
// 커스텀 404
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});


// next함수가 없더라도 꼭 써야만 익스프레스에서  error 핸들 이라고 인식합니다. 
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});



app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});