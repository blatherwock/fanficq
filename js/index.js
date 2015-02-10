
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
				if (parseInt(existingStory.lastChapter, 10) <= parseInt(story.lastChapter, 10)) {
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
		chrome.storage.local.get("readStories", function(items) {
			var stories = items["readStories"];
			$.each(stories, function(index, item) {
				readStories.add(item);
			});

			$.each(results, function(index, item) {
				var regexResults = storyIDRegex.exec(item.url);
				if(regexResults != null) {
					var story = {title: item.title, id:regexResults[1], lastChapter:regexResults[2], url:item.url};
					readStories.add(story);
				}
			});
			chrome.storage.local.set({"readStories": readStories.getAllAsArray()}, function() {
				displayStorage();
			});
		});
	});
};
var importText = function() {
	var storageInput = $("#storageIO").val();
	try {
		var newStorage = JSON.parse(storageInput);
		chrome.storage.local.clear(function() {
			chrome.storage.local.set(newStorage, function() {
				displayStorage();
			});
		});
	} catch (e) {
		//whoops didn't work. Oh well...
	}
}
var displayStorage = function() {
	chrome.storage.local.get(null, function(items) {
		var stories = items["readStories"]
		$("#storyList").empty();
		
		$.each(stories, function(index, item) {
			var storyNode = $("<tr />");
			var storyLink = $("<a />", {href: item.url, text: item.id});
			var lastChapter = $("<td />", {text: item.lastChapter, "class": "lastChapter"});
			var innerStory = $("<td />", {text: item.title});
			storyNode.append($("<td />").append(storyLink));
			storyNode.append(lastChapter);
			storyNode.append(innerStory);
			$("#storyList").append(storyNode);
		});
		$("#storageIO").val(JSON.stringify(items));
	});
};
var clearStorage = function() {
	chrome.storage.local.clear();
	displayStorage();
};


var initHandlers = function() {
	$("#import").click(importHistory);
	$("#importText").click(importText);
	$("#display").click(displayStorage);
	$("#clear").click(clearStorage);
}

initHandlers();
