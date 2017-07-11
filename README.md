# Dialogger 

A transcript-based media editor.

## Installation

    git clone --recursive https://github.com/bbc/dialogger.git
    sudo apt-get install -y nodejs npm mediainfo mongodb
    sudo npm install -g gulp bower
    npm install

During installation, set the Semantic UI path to `public/semantic/`.

## System description

Users can upload media 'assets' and create multiple different 'edits' of their assets.

The front-end is written in HTML/CSS/JS. It uses CKEditor for text editing, Semantic UI as the UI framework, Backbone
as the MVC framework and Dropzone for file uploads.  The back-end is written using Node.js and Express. It uses MongoDB
and Monk for data storage/access, Passport.js for authentication
