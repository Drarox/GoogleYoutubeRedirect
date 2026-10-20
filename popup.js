// Default settings
const DEFAULT_SETTINGS = {
    autoRedirect: true,
    showYouTubeButton: true
};

// When the popup opens, ask for the password first if one is set
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const passwordRecord = await getPasswordRecord();
        if (passwordRecord) {
            showLockScreen(passwordRecord);
        } else {
            await showSettings(false);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
});

// Load settings and reveal the settings panel
async function showSettings(hasPassword) {
    const settings = await loadSettings();
    updateUI(settings);
    setupEventListeners();
    setupPasswordProtection(hasPassword);
    document.getElementById('settingsPanel').hidden = false;
}

// Keep the settings hidden until the correct password is entered
function showLockScreen(passwordRecord) {
    const lockScreen = document.getElementById('lockScreen');
    const passwordInput = document.getElementById('unlockPassword');
    const unlockButton = document.getElementById('unlockButton');
    const unlockError = document.getElementById('unlockError');

    function setError(message) {
        unlockError.textContent = message;
        if (message) {
            passwordInput.setAttribute('aria-invalid', 'true');
        } else {
            passwordInput.removeAttribute('aria-invalid');
        }
    }

    lockScreen.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = passwordInput.value;
        if (!password) {
            setError('Enter your password.');
            passwordInput.focus();
            return;
        }

        setError('');
        unlockButton.disabled = true;
        unlockButton.textContent = 'Unlocking...';

        let unlocked = false;
        let errorMessage = 'Incorrect password. Try again.';
        try {
            unlocked = await verifyPassword(password, passwordRecord);
        } catch (error) {
            console.error('Error verifying password:', error);
            errorMessage = 'Could not check the password. Try again.';
        }

        if (unlocked) {
            lockScreen.hidden = true;
            passwordInput.value = '';
            await showSettings(true);
            document.getElementById('autoRedirect').focus();
            return;
        }

        unlockButton.disabled = false;
        unlockButton.textContent = 'Unlock';
        passwordInput.value = '';
        setError(errorMessage);
        passwordInput.focus();
    });

    lockScreen.hidden = false;
    passwordInput.focus();
}

// Password protection toggle, "Change password" button and new password form
function setupPasswordProtection(hasPassword) {
    const toggle = document.getElementById('passwordProtection');
    const changeButton = document.getElementById('changePassword');
    const form = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const formError = document.getElementById('passwordFormError');
    const saveButton = document.getElementById('savePassword');

    document.getElementById('newPasswordHint').textContent = `At least ${MIN_PASSWORD_LENGTH} characters.`;

    // The toggle stays on while a new password is being entered
    function render() {
        toggle.checked = hasPassword || !form.hidden;
        changeButton.hidden = !hasPassword || !form.hidden;
    }

    function showError(input, message) {
        formError.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
    }

    function clearErrors() {
        formError.textContent = '';
        newPasswordInput.removeAttribute('aria-invalid');
        confirmPasswordInput.removeAttribute('aria-invalid');
    }

    function openForm() {
        form.hidden = false;
        render();
        newPasswordInput.focus();
    }

    function closeForm() {
        form.reset();
        clearErrors();
        form.hidden = true;
        render();
    }

    toggle.addEventListener('change', async () => {
        if (toggle.checked) {
            // A password has to be chosen before protection is turned on
            openForm();
            return;
        }

        if (!hasPassword) {
            // Turned off again before a password was saved
            closeForm();
            return;
        }

        try {
            await removePassword();
            hasPassword = false;
            closeForm();
            showStatus('Password protection disabled!');
        } catch (error) {
            console.error('Error removing password:', error);
            render();
        }
    });

    changeButton.addEventListener('click', openForm);

    document.getElementById('cancelPassword').addEventListener('click', () => {
        closeForm();
        (hasPassword ? changeButton : toggle).focus();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const newPassword = newPasswordInput.value;
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            showError(newPasswordInput, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (newPassword !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, "Passwords don't match.");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        try {
            await setPassword(newPassword);
            const message = hasPassword ? 'Password changed!' : 'Password protection enabled!';
            hasPassword = true;
            closeForm();
            changeButton.focus();
            showStatus(message);
        } catch (error) {
            console.error('Error saving password:', error);
            formError.textContent = 'Could not save the password. Try again.';
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Save password';
        }
    });

    render();
}

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