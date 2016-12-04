chrome.tabs.query({active: true}, function(tabs) {
  const tab = tabs[0];
  chrome.tabs.captureVisibleTab(null, function(imageData) {
    console.log(imageData);
    chrome.tabs.sendMessage(tab.id, {type: 'SCREENSHOT', imageData});
  });
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log('test');
//   if (request.type === 'GET_SCREENSHOT') {
//     chrome.tabs.captureVisibleTab(null, function(imageData) {
//       sendResponse(imageData);
//     });
//   }
//   return true;
// });
