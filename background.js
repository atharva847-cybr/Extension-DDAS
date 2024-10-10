chrome.downloads.onCreated.addListener(function(downloadItem) {
    const downloadedFilename = downloadItem.filename.split('\\').pop().split('/').pop();

    chrome.storage.local.get("downloadedFiles", function(result) {
        let downloadedFiles = result.downloadedFiles || [];

        if (downloadedFiles.includes(downloadedFilename)) {
            showNotification(downloadedFilename);
        } else {
            downloadedFiles.push(downloadedFilename);
            chrome.storage.local.set({ downloadedFiles: downloadedFiles });
        }
    });
});

function showNotification(filename) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Duplicate Download Detected',
        message: `The file "${filename}" already exists.`,
        buttons: [
            { title: "Show Location" },
            { title: "Download Anyway" }
        ],
        priority: 1
    });

    chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
        if (btnIdx === 0) {
            chrome.downloads.showDefaultFolder();
        }
    });
}

