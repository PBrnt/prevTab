'use strict';
/**
 * @author Paul Bournat
 * @version 1.0
 */

/** @global */
const { query, update } = browser.tabs;

browser.browserAction.onClicked.addListener(goToNextTab);

/**
 * When the button is clicked then the tab on the left of the active one
 * in the current window is activated
 * @summary Go to next tab
 */
async function goToNextTab() {
  try {
    const currentTabIndex = await getCurrentTabIndex();
    console.log(currentTabIndex);

    const tabsNumber = await getTabsNumber();
    console.log(tabsNumber);

    const previousTabIndex = getPreviousTabIndex(currentTabIndex, tabsNumber);
    const previousTabID = await getTabID(previousTabIndex);
    console.log(previousTabIndex, previousTabID);

    goToTab(previousTabID);
  } catch (error) {
    console.error(error.message);
  }
}

/** Get the current tab index */
const getCurrentTabIndex = async () =>
  (await query({ currentWindow: true, active: true }))[0].index;

/**
* Determine if the current tab is the first tab
* If it is the case then the previous tab is the last at the very end
* @param {Number} currentTabIndex
* @param {Number} tabsNumber
*/
const getPreviousTabIndex = (currentTabIndex, tabsNumber) =>
  (currentTabIndex ? currentTabIndex : tabsNumber) - 1;

/** 
 * Get the tab ID from its index
 * @param {Number} index
*/
const getTabID = async index =>
  (await query({ currentWindow: true, index }))[0].id;

/** Get the number of tabs */
const getTabsNumber = async () =>
  (await query({ currentWindow: true })).length;

/**
 * Activate the tab identified by the given ID number
 * @param {Number} id
 */
const goToTab = async tabID => await update(tabID, { active: true });
