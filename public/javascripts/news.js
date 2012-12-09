$(function(){
	new FastClick(document.body);
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
	$('body').on('click', '.sub-news', function(){
		var self = $(this);
		self.css('opacity', .2);
		var title = self.text();
		var img = self.attr('data-img');
		var source = self.attr('data-source');
		var url =self.attr('data-url');
		console.log(url)
		getArticle(source, url, function(data){
			var el = $(jade.render('news', {title:title, article:data.data, img:img}));
			var parent = self;
			self.addClass('hide');
			self.parent().append(el);
			el.slideDown();
		});
	});
	$('body').on('click', '.news h3', function(){
		var self = $(this);
		$(this).parent().slideUp(function(){
			//self.remove();
			self.parent().parent().find('.hide').css('opacity', 1);
			self.parent().parent().find('.hide').removeClass('hide');
		})
	});
	$('body').on('click', '.main-news', function(){
		var self = $(this);
		var toggle = self.hasClass('expanded');
		if(toggle == true){
			self.find('.news').slideUp();
			self.removeClass('expanded');
			return;
		}
		var article = self.attr('data-article');
		var el = $(jade.render('news', {article:article}));
		$(this).append(el);
		el.slideDown();
		self.addClass('expanded');
	});
	
});

function getArticle(source, url, fn){
	$.getJSON('/article/' + source + '/' + url, fn);
}
