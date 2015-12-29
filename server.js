var http        = require('http'),
    fs          = require('fs'),
    express     = require('express'),

    app         = express(),
    
    config      = JSON.parse(fs.readFileSync("config.json")),
    host        = config.host,
    port        = config.port,
    
    imgDir      = __dirname + '\\files\\img',
    copyDir     = __dirname + '\\views\\copy';

app.use(express.static(__dirname + '/files'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var readImages = new Promise(function(resolve, reject) {
        
    fs.readdir(imgDir, function(err, files) {

        if(err) throw err;

        resolve(files);

    });

});

var readCopy = function(route) {
    
    route = route.substring(1);
    
    console.log(route);
    
    return new Promise(function(resolve, reject) {
        
        fs.readdir(copyDir, function(err, copy) {

            if(err) throw err;

            console.log(copy); 

            for(i = 0; i < copy.length; i++) {

                if(copy[i].toString().substring(0, copy[i].toString().indexOf('-')) == route) {

                    console.log(copy[i]);

                    var copyFile = copyDir + '\\' + copy[i];
                    console.log(copyFile); 

                }

            }

            fs.readFile(copyFile, 'utf-8', function(err, data) {

                if(err) throw err;

                resolve(data);

            });

        });
        
    });
    
}

app.get('/', function(req, res) {
    
    console.log(req.originalUrl);
    
    Promise.all([readImages, readCopy]).then(function(values) {
        
        res.render('index.html', {imgDir: imgDir, image: values[0], copy: values[1]});
        
    }, function(reason) {
        
        console.log(reason);
        
    });
    
});

app.get('/about', function(req, res) {
    
    readCopy(req.originalUrl).then(function(values) {
        
        res.render('about.html', {imgDir: imgDir, image: values, copy: values}); 
        
    });
    
});

app.use(function(req, res, next) {
    
  res.status(404).send('404.');
    
});

app.use(function(err, req, res, next) {
    
  console.error(err.stack);
  res.status(500).send('Something broke!');
    
});

app.listen(port, function() {
    
//    console.log('Server listening on port ' + port);
    
})