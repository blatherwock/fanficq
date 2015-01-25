
var readStories = (function() {
	var stories = {};
	return {
		get: function(id) {
			return stories[id];
		},
		add: function(story) {
			if (stories[story.id] == undefined) {
				stories[story.id] = story;
			} else {
				var existingStory = stories[story.id];
				if (parseInt(existingStory.lastChapter, 10) < parseInt(story.lastChapter, 10)) {
					existingStory.title = story.title;
					existingStory.lastChapter = story.lastChapter;
					existingStory.url = story.url;
				}
			}
		},
		getAll: function() {
			return stories;
		},
		getAllAsArray: function() {
			var storyArray = [];
			for (itemID in stories) {
				storyArray.push(stories[itemID]);
			}
			return storyArray;
		},
		clear: function() {
			stories = {};
		}
	};
})();

var importHistory = function() {
	chrome.history.search({text:"",maxResults:100000,startTime:0}, function(results) {
		var storyIDRegex = /fanfiction.net\/s\/(\d+)\/(\d+)/;
		
		$.each(results, function(index, item) {
			var regexResults = storyIDRegex.exec(item.url);
			if(regexResults != null) {
				var story = {title: item.title, id:regexResults[1], lastChapter:regexResults[2], url:item.url};
				readStories.add(story);
			}
		});
		console.log(readStories.getAllAsArray());
		chrome.storage.local.set({"readStories": readStories.getAllAsArray()}, function() {
			displayStorage();
		});
	});
};
var displayStorage = function() {
	chrome.storage.local.get(null, function(items) {
		var stories = items["readStories"]
		$("#contentArea").empty();
		
		$.each(stories, function(index, item) {
			var storyNode = $("<p />", {text: item.id + ": " + item.title + ", " + item.lastChapter});
			$("#contentArea").append(storyNode);
		});
		//$("#contentArea").text(JSON.stringify(items));
	});
};
var clearStorage = function() {
	chrome.storage.sync.clear();
	displayStorage();
};


var initHandlers = function() {
	$("#import").click(importHistory);
	$("#display").click(displayStorage);
	$("#clear").click(clearStorage);
}

initHandlers();
