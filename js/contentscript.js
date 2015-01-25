// Content Scripts

//https://www.fanfiction.net/s/4564625/1/Isis-s-Bane
(function() {
	var readStories;
	
	chrome.storage.local.get("readStories", function(items) {
		readStories = items.readStories;
		markReadStories();
	});

	var markReadStories = function () {
		$.each(readStories, function(index, item) {
			$( "div[data-storyid*='" + item.id + "']" ).addClass("fanficq-read");
		});
	};
})();
