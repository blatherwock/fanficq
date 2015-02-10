chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')});
});

chrome.history.onVisited.addListener(function(item) {
	var storyIDRegex = /fanfiction.net\/s\/(\d+)\/(\d+)/;
 	
	var regexResults = storyIDRegex.exec(item.url);
	if(regexResults != null) {
		var newStory = {title: item.title, id:regexResults[1], lastChapter:regexResults[2], url:item.url};

		/* Update read stories in local storage to the new entry */
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

		/* Determine if the story had been saved as a bookmark and update if required */
		chrome.bookmarks.search(newStory.id, function(results) {
			for (var i = 0; i < results.length; i++) {
				var bookmark = results[i];
				var bookmarkRegexResult = storyIDRegex.exec(bookmark.url);
				if (bookmarkRegexResult != null) {
					var bookmarkStory = {title: bookmark.title, id:bookmarkRegexResult[1], lastChapter:bookmarkRegexResult[2], url:bookmark.url};
					if (newStory.id == bookmarkStory.id &&
						parseInt(newStory.lastChapter, 10) >= parseInt(bookmarkStory.lastChapter, 10)) {
						chrome.bookmarks.update(bookmark.id, {url:newStory.url, title:newStory.title});
					}
				}
			}
		});	
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.sendMessage(activeInfo.tabId, {action: "onActivated"});
});
