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
		console.log('sdf')
		var self = $(this);
		var title = self.text();
		var article = self.attr('data-article');
		var img = self.attr('data-img');
		var el = $(jade.render('news', {title:title, article:article, img:img}));
		var parent = self;
		self.addClass('hide');
		self.parent().append(el);
		el.slideDown();
	});
	$('body').on('click', '.news h3', function(){
		var self = $(this);
		$(this).parent().slideUp(function(){
			//self.remove();
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
	})
})
