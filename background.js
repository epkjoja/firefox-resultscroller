"use strict";

var scrollingTabs = [];

function isScrolling(tabId) {
    return scrollingTabs.includes(tabId);
}

function addScroll(tabId) {
    scrollingTabs.push(tabId);
}

function removeScroll(tabId) {
    scrollingTabs.splice(scrollingTabs.indexOf(tabId), 1);
}

function toggleScroll(tabId) {
    browser.tabs.sendMessage(tabId, {toggleScrollMsg: true});
}

browser.browserAction.onClicked.addListener(function (tab) {
    if (isScrolling(tab.id)) {
        removeScroll(tab.id);
    } else {
        addScroll(tab.id);
    }
    toggleScroll(tab.id);
});

browser.runtime.onMessage.addListener(function (request, sender) {
    if (request.scrollingScriptLoadedMsg) {
        if (isScrolling(sender.tab.id)) {
            toggleScroll(sender.tab.id);
        }
    }

    if (request.reloadPageMsg) {
        browser.tabs.reload(sender.tab.id);
    }
});

browser.tabs.onRemoved.addListener(function (tabId) {
    if (isScrolling(tabId)) {
        removeScroll(tabId);
    }
});
