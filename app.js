
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , jade_browser = require('jade-browser')
  , redis = require('redis')
  , async = require('async')
var client = redis.createClient();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(jade_browser('/js/templates.js', '**', {root: __dirname + '/views/components', cache:false}));
  app.use(express.compress())
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
	getData(req, function(data){
		var column = 1;
		var column1 = [];
		var column2 = [];
		for(var source in data.content){
			var src = data.content[source];
			if(src.length == 0) continue;
			//set first element as the first object to hold an image
			var main;
			for(var i = 0; i < data.content[source].length; i++){
				if(typeof data.content[source][i].images == 'object'){
					main = src.splice(i,1)[0];
					break;
				}
			}
			//set large image for main image
			if(main && typeof main.images == 'object'){
				for(var i = 0; i < main.images.sizes.length; i++){
					if( main.images.sizes[i].width <= 480 && main.images.sizes[i].width > 320){
						main.images.thumb = main.images.sizes[i].source;
						break;
					}
				}
				if(main.images.thumb == ""){
					main.images.thumb = main.images.sizes[i].pop().source;
				}
			}else{
			
			}
			if(column == 1){
				column2.push({source:source, main:main, others:src, logo:source + ".png"});
				column = 2;
			}else{
				column1.push({source:source, main:main, others:src, logo:source + ".png"});
				column = 1;
			}
		}
		res.render('index',{column1:column1, column2:column2});
	})
});

app.get('/article/:source/:url', function(req,res){
	var source = req.params.source
	 ,  url = req.params.url;
	 client.hget(source, url, function(err, data){
	 	if(err){
	 		return res.json({error:"An error occured"});
	 	}
	 	var obj = {};
 		obj.data = data;
 		res.json(obj);
	 });
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

function getData(req,fn){
	var cmd;
	client.smembers('articles::sources', function(err, sources){
		var build = {
			content:{}
		};
		var sources_build = sources.reverse();
		var limit = 20;
		
		//remove empty values
		sources_build.clean("");
		
		async.forEach(sources_build, function(source, fn){
			//remove sources which dont exist
			if(sources.indexOf(source) === -1){
				build.content[source] = [];
				return fn(null);
			};
			
			client.lrange('articles:' + source, 0, limit, function(err, data){
				var parsed = [];
				data.forEach(function(e){
					var doc = JSON.parse(e);
					delete doc.article;
					console.log(doc);
					parsed.push(doc);
				})
				build.content[source] = parsed;
				return fn(null);
			});
		}, function(){
			fn(build);
		});
	});
}
