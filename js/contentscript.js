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
			var storyNode = $( "div[data-storyid*='" + item.id + "']" );
			var totalChapters = storyNode.attr("data-chapters");
			if (parseInt(item.lastChapter, 10) < parseInt(totalChapters, 10)) {
				storyNode.addClass("fanficq-started");
			} else {
				storyNode.addClass("fanficq-read");
			}
		});
	};
})();
