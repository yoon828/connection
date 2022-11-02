chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
	if (message == 'version') {
		const manifest = chrome.runtime.getManifest();
		sendResponse({
			type: 'success',
			version: manifest.version,
		});
		return true;
	}
	const sources = message.sources;
	const tab = sender.tab;
	chrome.desktopCapture.chooseDesktopMedia(sources, tab, (streamId) => {
		// result of selecting desktop
	});
	return true;
});
