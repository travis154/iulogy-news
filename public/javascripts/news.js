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
		getArticle(source, url, function(data){
			var el = $(jade.render('news', {title:title, article:data.data.article, img:img}));
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
	$('body').on('click', '.hide-source', function(){
		var self = $(this);
		var source = self.attr('data-source-en');
		var hidden_sources = $.cookie('hidden_sources') != null ? JSON.parse($.cookie('hidden_sources')) : {};
		if(self.hasClass('active')){
			//add source
			hidden_sources[source] = 1;
			$("[data-en='"+source+"']").addClass('hide');
			
		}else{
			//remove source
			delete hidden_sources[source];
			$("[data-en='"+source+"']").removeClass('hide');
		}
		//set cookie
		$.cookie("hidden_sources", JSON.stringify(hidden_sources), { expires: 365 });
	});
	$('body').on('click', '.main-news', function(){
		var self = $(this);
		var toggle = self.hasClass('expanded');
		var source = self.attr('data-source');
		var url =self.attr('data-url');
		if(toggle == true){
			self.find('.news').slideUp();
			self.removeClass('expanded');
			return;
		}
		getArticle(source, url, function(data){
			var el = $(jade.render('news', {article:data.data.article}));
			self.append(el);
			el.slideDown();
			self.addClass('expanded');
		});
	});
	//read cookie, create if not found
	var hidden_sources = $.cookie('hidden_sources') ? JSON.parse($.cookie('hidden_sources')) : {};
	var sources = $(".news-section").map(function(){ 
		return {
			source_dv: $(this).attr("data-dv"), 
			source_en: $(this).attr("data-en"),
			hide: $(this).attr("data-en") in hidden_sources
		} 
	})
	$("#options").popover({
		html:true, 
		title: '<div style="text-align:right;">ސޯސްތައް</div>', 
		placement:'bottom',
		content:jade.render('options-sources',{sources:sources})
	});

});

function getArticle(source, url, fn){
	$.getJSON('/article/' + source + '/' + url, fn);
}
