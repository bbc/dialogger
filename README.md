# Dialogger 

A transcript-based media editor.

## Installation

    git clone --recursive https://github.com/bbc/dialogger.git
    sudo apt-get install -y nodejs npm mediainfo mongodb
    sudo npm install -g gulp bower
    npm install

During installation, set the Semantic UI path to `public/semantic/`.

## Speech-to-text setup

Dialogger does not come with a speech-to-text system, so you will need to add some code to `helpers/stt.js` which
accepts a path to an audio/video file and runs Javascript objects with the transcript and segmentation data. Examples of the data formats are shown below, and a full example can be found in `helpers/stt-example.js`.

###Transcript

    {
      words: [
        {
          word: "hello",
          punct: "Hello",
          start: 0.05,
          end: 0.78,
          confidence: 0.45
        },
        {
          word: "world",
          punct: "world.",
          start: 1.13,
          end: 1.45,
          confidence: 0.9
        }
      ]
    }

### Segmentation

    {
      segments: [
        {
          start: 0.05,
          duration: 2.34,
          speaker: {
            @id: "Bob",
            gender: "M"
          }
        },
        {
          start: 2.34,
          duration: 4.2,
          speaker: {
            @id: "Alice",
            gender: "F"
          }
        }
      ]
    }

## Usage

Login in with username of 'user' and password 'password'.

## System description

Users can upload media 'assets' and create multiple different 'edits' of their assets.

The front-end is written in HTML/CSS/JS. It uses CKEditor for text editing, HTML5 Video Compositor for audio replay,
Semantic UI as the UI framework, Backbone as the MVC framework and Dropzone for file uploads.  The back-end is written
using Node.js and Express. It uses MongoDB and Monk for data storage/access, Passport.js for authentication
