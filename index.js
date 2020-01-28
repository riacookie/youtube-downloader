const express = require('express');
const path = require('path');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const port = 8000 || process.env.PORT;
// const outputPath = path.join(__dirname + '/videos/video.mp3');

// const __dirname = path.resolve(path.dirname(''));

app.use(express.static(__dirname))
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/readme', (req, res) => {
  res.sendFile(path.join(__dirname+'/readme.html'));
})

app.get('/download', (req, res) => {
  // get the query
  var URL = req.query.URL;
  var videoName = req.query.videoName;
  if (URL) {
    res.header('Content-Disposition', `attachment; filename="${videoName}.mp4"`);
	  ytdl(URL, {
		  format: 'mp4',
      quality: 'highest',
	  }).pipe(res);
  } else {
    res.send(`something went wrong or you didnt provide the url<br><a href='/'>return</a>`)
  }
});

app.get('/downloadAudio', (req,res) => {
  // get the query
  var URL = req.query.URL;
  var videoName = req.query.videoName;
  if (URL) {
    // res.header('Content-Disposition', 'attachment;');
	  var video = ytdl(URL, {
		  format: 'mp3',
      quality: 'highestaudio',
      filter: 'audioonly'
	  });

    video.pipe(fs.createWriteStream(path.join(__dirname + `/videos/${videoName}.mp3`)));

    video.on('progress', (chunkLength, downloaded, total) => {
      console.log(downloaded / total)
    });

    video.on('end', () => {
      res.download(path.join(__dirname + `/videos/${videoName}.mp3`));
    });

  } else {
    res.send(`something went wrong or you didnt provide the url<br><a href='/'>return</a>`)
  }
});

app.listen(port, () => {
  console.log('server is on!');
  console.log('port', port);
})