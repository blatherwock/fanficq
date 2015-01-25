// Content Scripts

var updateReadStoriesForPage = function() {
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
				storyNode.removeClass("fanficq-started");
				storyNode.addClass("fanficq-read");
			}
		});
	};
};

updateReadStoriesForPage();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "onActivated") {
		updateReadStoriesForPage();
	}
});
