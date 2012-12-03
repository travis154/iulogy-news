(function($, window){
	var News = function(obj){
		this.url = obj.url;
	};
	News.prototype.fetch = function(fn){
		$.getJSON(this.url + "fetch?limit=20", fn);
	}
	
	News.prototype.render = function(){
		var self = this;
		this.fetch(function(data){
			var column = 1;
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
				if(typeof main.images == 'object'){
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
				var html = jade.render('news-section', {main:main, others:src, logo:source + ".png"});
				if(column == 1){
					$("#stuff2").append(html);
					column = 2;
				}else{
					$("#stuff").append(html);
					column = 1;
				}
				
			}
		})
	}
	
	window.News = new News({url:'http://' + window.location.hostname + ':4003/'});
	window.News.render();
})(jQuery, window, jade);

$(function(){
	$("body").on('click', '.toggle-display', function(){
		var action = $(this).attr('data-action');
		console.log(action)
		if(action == 'expand'){
			$(this).parent().find('.news-item.hide').removeClass('hide');
			$('span', this).text('މަދު ސުރުޚީތައް');
			$(this).attr('data-action', 'collapse');
		}else{
			var el = $(this).parent().find('.news-item').slice(5).addClass('hide');
			$('span', this).text('އިތުރު ސުރުޚީތައް');
			$(this).attr('data-action', 'expand');
		}
	});
	$('body').on('click', '.title', function(){
		var self = $(this);
		var title = self.text();
		var article = self.attr('data-article');
		var img = self.attr('data-img');
		var el = $(jade.render('news', {title:title, article:article, img:img}));
		var parent = self.parent().parent();
		parent.addClass('hide');
		parent.parent().append(el);
		el.slideDown();
	});
	$('body').on('click', '.news h3', function(){
		var self = $(this);
		$(this).parent().slideUp(function(){
			//self.remove();
			self.parent().parent().find('.hide').removeClass('hide');
		})
	});
})
