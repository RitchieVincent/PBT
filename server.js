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

var readImages = function(route) {
    
    route = route.substring(1);
        
    fs.readdir(imgDir, function(err, files) {

        if(err) throw err;

        for(i = 0; i < files.length; i++) {

            if(files[i] == route) {

                imagesDir = imgDir + '\\' + route;

            }

        };
        
        fs.readdir(imagesDir, function(err, files) {
            
            if(err) throw err;
        
            images = files;
            
        });

    });
    
};

var readFiles = function(route) {
    
    route = route.substring(1);
    
    return new Promise(function(resolve, reject) {
        
        fs.readdir(copyDir, function(err, copy) {

            if(err) throw err;

            for(i = 0; i < copy.length; i++) {

                if(copy[i].toString().substring(0, copy[i].toString().indexOf('-')) == route) {

                    var copyFile = copyDir + '\\' + copy[i]; 

                }

            }

            fs.readFile(copyFile, 'utf-8', function(err, data) {

                if(err) throw err;

                resolve(data);

            });

        });
        
    });
    
};

app.get('/', function(req, res) { 
    
    readImages('/index');
    
    readFiles('/index').then(function(values) {

        res.render('index.html', {imgDir: imagesDir, image: images, copy: values}); 

    });
    
});

app.get('/about', function(req, res) {
    
    readImages(req.originalUrl);

    readFiles(req.originalUrl).then(function(values) {
        
        res.render('about.html', {imgDir: imagesDir, image: images, copy: values}); 
        
    });
    
});

app.get('/test', function(req, res) {
    
    readImages(req.originalUrl);

    readFiles(req.originalUrl).then(function(values) {

        res.render('test.html', {imgDir: imagesDir, image: images, copy: values}); 

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
    
    console.log('Server listening on port ' + port);
    
})