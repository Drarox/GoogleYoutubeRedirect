// Password protection for the extension settings.
// The password itself is never stored: only a salted PBKDF2-SHA256 hash is kept in
// chrome.storage.local, so it stays on this device and is not synced.

const PASSWORD_STORAGE_KEY = 'passwordProtection';
const MIN_PASSWORD_LENGTH = 4;
const PBKDF2_ITERATIONS = 600000;
const PBKDF2_SALT_BYTES = 16;
const PBKDF2_HASH_BITS = 256;

// Get the stored password hash, or null when no password is set
async function getPasswordRecord() {
    const result = await localStorageCall('get', PASSWORD_STORAGE_KEY);
    return result[PASSWORD_STORAGE_KEY] || null;
}

// Hash and store a new password, replacing the current one
async function setPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
    const hash = await derivePasswordHash(password, salt, PBKDF2_ITERATIONS);

    await localStorageCall('set', {
        [PASSWORD_STORAGE_KEY]: {
            hash: bytesToBase64(hash),
            salt: bytesToBase64(salt),
            iterations: PBKDF2_ITERATIONS
        }
    });
}

// Remove the password, which turns protection off
function removePassword() {
    return localStorageCall('remove', PASSWORD_STORAGE_KEY);
}

// Check a password attempt against the stored hash
async function verifyPassword(password, record) {
    const expected = base64ToBytes(record.hash);
    const actual = await derivePasswordHash(password, base64ToBytes(record.salt), record.iterations);
    return constantTimeEqual(actual, expected);
}

async function derivePasswordHash(password, salt, iterations) {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
        keyMaterial,
        PBKDF2_HASH_BITS
    );
    return new Uint8Array(bits);
}

// Compare every byte so the check doesn't stop early at the first mismatch
function constantTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let difference = 0;
    for (let i = 0; i < a.length; i++) {
        difference |= a[i] ^ b[i];
    }
    return difference === 0;
}

// Wrap a chrome.storage.local call in a promise that rejects on storage errors
function localStorageCall(method, argument) {
    return new Promise((resolve, reject) => {
        chrome.storage.local[method](argument, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(result);
            }
        });
    });
}

function bytesToBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(base64) {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}
