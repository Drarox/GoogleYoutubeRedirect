#!/bin/bash

# Define function to make zip file
function make_zip {
    local zip_type=$1
    local version=$(grep -o '"version": *"[0-9.]*"' manifest.json | cut -d'"' -f4)
    local zip_file="output/${zip_type}_v${version}.zip"
    zip -r "$zip_file" manifest.json src/ assets/ -x "*.DS_Store"
}

# Create output directory if it doesn't already exist
if [ ! -d "output" ]; then
    mkdir "output"
fi

# If manifest-firefox.json exists, create a zip with the chrome files and rename manifest files
if [ -f "manifest-firefox.json" ]; then
    # Create chrome.zip
    make_zip "chrome"

    # Rename manifest files
    mv manifest.json manifest-chrome.json
    mv manifest-firefox.json manifest.json

    # Create firefox.zip
    make_zip "firefox"

    # Roll back name changes
    mv manifest.json manifest-firefox.json
    mv manifest-chrome.json manifest.json

# If manifest-firefox.json does not exist but manifest-chrome.json does, create a zip with the firefox files and rename manifest files
elif [ -f "manifest-chrome.json" ]; then
    # Create firefox.zip
    make_zip "firefox"

    # Rename manifest files
    mv manifest.json manifest-firefox.json
    mv manifest-chrome.json manifest.json

    # Create chrome.zip
    make_zip "chrome"

    # Roll back name changes
    mv manifest.json manifest-chrome.json
    mv manifest-firefox.json manifest.json
fi
