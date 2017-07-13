# Dialogger 

A transcript-based media editor.

### What's included
* User accounts
* Asset management
* Playback and navigation using transcript
* Transcript editing
* Export of edit decision list (EDL)

### What's *not* included
The following features must be added manually for Dialogger to operate fully. Instructions and examples are provided.

* Speech-to-text
* Preview file generation
* File export

## Installation

The following script will install Dialogger on Ubuntu/Debian:

    git clone --recursive https://github.com/bbc/dialogger.git
    sudo apt-get install -y nodejs npm mediainfo mongodb
    sudo npm install -g gulp bower
    cd dialogger
    npm install

During installation, set the Semantic UI path to `public/semantic/`.

## Speech-to-text setup

Dialogger does not come with a speech-to-text system, so you will need to add some code to `helpers/stt.js` that accepts a path to an audio/video file and runs Javascript objects with the transcript and segmentation data. Examples of the data formats are shown below, and a full example can be found in `helpers/stt-example.js`.

###Transcript

```javascript
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
```

### Segmentation

```javascript
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
```

## File export setup

To configure file export, you will need to add some code to `helpers/fileexport.js`. The function should receive options in the following format and return the path of the edited file. In essence, what you want to do is to take the file path (*asset.path*) and the list of edits (*edl*), produce an edited version of the file, then return the path.

### Export options

```javascript
{
  // Information about the original file/asset
  asset: {
    description: "Asset description",
    filename: "AssetFilename.wav",
    path: "/path/to/original/file",
    audio: {
      channels: 2,
      sampleRate: "48000"
    }
  },
  
  // An array of in- and out-points, in seconds
  edl: [
    ["78.38","102.89"],
    ["128.3","135.17"]
  ],
  
  // User-provided options from the exportForm
  //   in public/js/editor.html
  form: {
    audio: {
      ab: "",
      acodec: "pcm_s16le"
    },
    edlformat: "dira",
    exportUnderlined:"true",
    format: "audio",
    id: "",
    include: "true",
    name: "test.wav",
    video: {
      height: "",
      vb: "",
      f: "mp4",
      acodec: "aac",
      ab: "",
      vcodec: "libx264",
      width: ""
    }
  }
}
```



## Usage

Login in with username of 'user' and password 'password'.

## System description

Users can upload media 'assets' and create multiple different 'edits' of their assets.

The front-end is written in HTML/CSS/JS. It uses CKEditor for text editing, HTML5 Video Compositor for audio replay,
Semantic UI as the UI framework, Backbone as the MVC framework and Dropzone for file uploads.  The back-end is written
using Node.js and Express. It uses MongoDB and Monk for data storage/access, Passport.js for authentication
