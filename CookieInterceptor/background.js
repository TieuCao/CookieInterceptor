var isStart = false;

chrome.browserAction.onClicked.addListener(t => {
	isStart = !isStart;
	if(isStart) {
		chrome.browserAction.setBadgeText({"text" : "ON"});
		chrome.browserAction.setBadgeBackgroundColor( {"color" :"#769ce6" });
		chrome.webRequest.onBeforeRequest.addListener(beforeRequestListener, {
			urls: ["<all_urls>"]  // filters
		  }
		);
		
		chrome.webRequest.onCompleted.addListener(completeRequestListener, {
			urls: ["<all_urls>"]  // filters
		  }
		);
	} else {
		chrome.browserAction.setBadgeText({"text" : "OFF"});
		chrome.browserAction.setBadgeBackgroundColor( {"color" : "#db4437"});
		chrome.webRequest.onBeforeRequest.removeListener(beforeRequestListener);
		chrome.webRequest.onCompleted.removeListener(completeRequestListener);
	}
})

function beforeRequestListener(info) {
	console.log(`Request: ${info.url}`);
	removeAllCookies();
}

function completeRequestListener(info) {
	console.log(`Done Response: ${info.url}`);
	removeAllCookies();
}

function removeAllCookies() {
	chrome.cookies.getAll({}, function(cookies) {
		cookies.forEach(cookie => {
			var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
			chrome.cookies.remove({url: url, name: cookie.name});
		});
	});
}

