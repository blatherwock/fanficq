chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')});
});

chrome.history.onVisited.addListener(function(item) {
	var storyIDRegex = /fanfiction.net\/s\/(\d+)\/(\d+)/;
 	
	var regexResults = storyIDRegex.exec(item.url);
	if(regexResults != null) {
		var newStory = {title: item.title, id:regexResults[1], lastChapter:regexResults[2], url:item.url};
		chrome.storage.local.get("readStories", function(items) {
			var stories = items["readStories"];
			var foundMatch = false;
			for(var i = 0; i < stories.length; i++) {
				var story = stories[i];
				if (story.id == newStory.id) {
					if(parseInt(story.lastChapter, 10) <= parseInt(newStory.lastChapter, 10)) {
						story.title = newStory.title;
						story.lastChapter = newStory.lastChapter;
						story.url = newStory.url;
					}
					foundMatch = true;
					break;
				}
			}
			if (!foundMatch) {
				stories.push(newStory);
			}
			chrome.storage.local.set({"readStories": stories});
		});
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.sendMessage(activeInfo.tabId, {action: "onActivated"});
});
