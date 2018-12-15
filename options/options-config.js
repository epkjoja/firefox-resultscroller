"use strict";
/* This file defines the settings presented to the user in the inline options. It must define a variable named optionsConfig as an
 * array of settings objects. Each setting object must have the following properties on it:
 *
 * key: The key for the setting, as passed to browser.storage.local.get and .set to read and write the setting. Also used as the id for the setting controls.
 * title: The main text that appears on the left of the setting
 * description: (optional) The smaller grey text that appears below the title
 * type: The type of control to use for the setting. This may be one of:
 *    boolean
 *    string
 *    integer
 *    menulist
 *    radiobuttons
 *    button
 *
 * For menulist and radiobuttons types, a further property must be provided:
 *
 * optionValues: an array of objects with properties {value, label}. Each one represents one of the values which may be picked by the user.
 *
 * For the button type, a further property must be provided:
 *
 * text: The text to display on the button itself
 *
 * Button types work slightly differently in that they do not get or set values from browser.storage.local, but instead when
 * clicked will send their key value as a message (using browser.runtime.sendMessage).
 */
const optionsConfig = [
    {
        key: "scrollSpeed",
        title: "Scroll speed (pixels/sec)",
        description: "How fast the page should scroll.",
        type: "integer"
    },
    {
        key: "topPause",
        title: "Pause at top (sec)",
        description: "The time to pause at the top of the page. A page reload will be done after the pause.",
        type: "integer"
    },
    {
        key: "bottomPause",
        title: "Pause at bottom (sec)",
        description: "The time to pause at the bottom of the page.",
        type: "integer"
    },
    {
        key: "minReloadTime",
        title: "Minimum time between reloads (sec)",
        description: "If the page doesn't need to scroll or completes a cycle too fast, this value decides how often the page should be reloaded.",
        type: "integer"
    }
];
