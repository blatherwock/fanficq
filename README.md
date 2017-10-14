FanFicQ
=======

Little Chrome extension to help with some fanfic related management.

## Current Features:
* Records latest chapter read of fanfiction read on fanfiction.net
* On fanfiction.net, changes the styling of story lists to have a blue background if it is a story you've read some of and a red background if it is a story you've read to the last chapter of.
* If you have a bookmark of a story and you navigate to a later chapter, automatically updates the bookmark to the last chapter read
* Management page where you can see all stories read and can export / import reading history to a json file for backup
* Can also import reading history from browser history

## Permissions needed:
* storage: uses local storage for saving read progress
* history: on management page can import reading progress from browser history
* bookmarks: reads and edits bookmarks of stories on fanfiction.net
* fanfiction.net: when you are on fanfiction.net, interacts with the DOM to update story listing backgrounds

## Installation:
1. Fork the repository
1. Enable developer mode in chrome://extensions
1. Load unpacked extension and select the directory of the forked project

## Possible Future Features:
* Simple Queue for keeping links to stories that you haven't had a chance to read yet (rather than relying on bookmarks)
** Ideally store info about story making it easier to decide what to read (author, word count, completed status, summary)
** Perhaps also adding authors to queue to checkout more of their stories/favs
