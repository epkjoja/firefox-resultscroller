"use strict";

let defaultOptions = {
    scrollSpeed: 50,
    topPause: 3,
    bottomPause: 3,
    minReloadTime: 10
};

let scroll = {
    state: 0,
    delay: 20,
    step: 1,
    secsAtTop: 3,
    secsAtBottom: 3,
    minSecsBetweenReloads: 10,
    totalCounter: 0
};

function getPageHeight() {
    let body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function pageFitsInWindow() {
    return window.innerHeight >= getPageHeight()
}

function isAtBottom() {
    return window.scrollY + window.innerHeight + scroll.step >= getPageHeight();
}

function scrollPage() {
    scroll.totalCounter++;

    switch (scroll.state) {
        case 0: // Scrolling not needed
            if (pageFitsInWindow()) {
                if (scroll.totalCounter * scroll.delay > scroll.minSecsBetweenReloads * 1000) {
                    browser.runtime.sendMessage({reloadPageMsg: true});
                    scroll.totalCounter = 0;
                }
            } else {
                scroll.state = 1;
            }
            break;
        case 1: // Scrolling Down
            if (isAtBottom()) {
                scroll.state = 2;
                scroll.bottomCounter = 1000 / scroll.delay * scroll.secsAtBottom;
            } else {
                window.scrollBy(0, scroll.step);
            }
            break;

        case 2: // At bottom
            if (--scroll.bottomCounter <= 0) scroll.state = 3;
            break;

        case 3: // Scrolling Up
            if (window.scrollY == 0) {
                scroll.state = 4;
                scroll.topCounter = Math.max(1000 / scroll.delay * scroll.secsAtTop, 15);
            } else {
                window.scrollBy(0, -scroll.step);
            }
            break;
        case 4: // At Top
            if (--scroll.topCounter <= 0) {
                scroll.state = 1;
            } else if (scroll.topCounter == 10) {
                if (scroll.totalCounter * scroll.delay > scroll.minSecsBetweenReloads * 1000) {
                    browser.runtime.sendMessage({reloadPageMsg: true});
                    scroll.totalCounter = 0;
                }
            }
            break;
    }
}

function toggleScroll() {
    if (scroll.interval) {
        clearInterval(scroll.interval);
        scroll.interval = null;
    } else {
        scroll.interval = setInterval(scrollPage, scroll.delay);
    }
}

browser.runtime.onMessage.addListener(function (msg) {
    if (msg.toggleScrollMsg) {
        toggleScroll();
    }
});

browser.storage.onChanged.addListener(function (changes) {
    for (let change in changes) {
        console.log("Setting changed: " + change + " =", changes[change].newValue);
        switch (change) {
            case "scrollSpeed":
                scroll.delay = 1000 / changes[change].newValue;
                if (scroll.interval) {
                    clearInterval(scroll.interval)
                    scroll.interval = setInterval(scrollPage, scroll.delay);
                }
                break;

            case "topPause":
                scroll.secsAtTop = changes[change].newValue;
                break;

            case "bottomPause":
                scroll.secsAtBottom = changes[change].newValue;
                break;

            case "minReloadTime":
                scroll.minSecsBetweenReloads = changes[change].newValue;
                break;
        }
    }
});

browser.storage.local.get(["scrollSpeed", "topPause", "bottomPause", "minReloadTime"]).then(function(items) {
    if (Object.keys(items).length < 4) {
        browser.storage.local.set(defaultOptions);
    } else {
        scroll.delay = 1000 / items.scrollSpeed;
        scroll.secsAtTop = items.topPause;
        scroll.secsAtBottom = items.bottomPause;
        scroll.minSecsBetweenReloads = items.minReloadTime;
    }
})

browser.runtime.sendMessage({scrollingScriptLoadedMsg: true});
