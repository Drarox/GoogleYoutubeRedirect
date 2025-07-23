// Default settings
const DEFAULT_SETTINGS = {
    autoRedirect: true,
    showYouTubeButton: true
};

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const settings = await loadSettings();
        updateUI(settings);
        setupEventListeners();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
});

// Load settings from storage
async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
            resolve(result);
        });
    });
}

// Save settings to storage
async function saveSettings(settings) {
    return new Promise((resolve) => {
        chrome.storage.sync.set(settings, () => {
            resolve();
        });
    });
}

// Update UI with current settings
function updateUI(settings) {
    document.getElementById('autoRedirect').checked = settings.autoRedirect;
    document.getElementById('showYouTubeButton').checked = settings.showYouTubeButton;
}

// Setup event listeners
function setupEventListeners() {
    // Auto-redirect toggle
    document.getElementById('autoRedirect').addEventListener('change', async (e) => {
        const settings = await loadSettings();
        settings.autoRedirect = e.target.checked;
        await saveSettings(settings);
        showStatus('Settings saved!');
    });
    
    // Show YouTube button toggle
    document.getElementById('showYouTubeButton').addEventListener('change', async (e) => {
        const settings = await loadSettings();
        settings.showYouTubeButton = e.target.checked;
        await saveSettings(settings);
        showStatus('Settings saved!');
        
        // Reload current tab to apply button visibility changes
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url.includes('google.') && tabs[0].url.includes('/search')) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    });
}

// Show status message
function showStatus(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status success';
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 2000);
}