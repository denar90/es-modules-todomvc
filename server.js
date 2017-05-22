const spdy = require('spdy');
const fs = require('fs');

const options = {
  key: fs.readFileSync(__dirname + '/secret/server.key'),
  cert:  fs.readFileSync(__dirname + '/secret/server.crt')
};

spdy.createServer(options, function(req, res) {
  Promise.all([
    fs.readFileSync('docs/index.html'),
    fs.readFileSync('docs/app.css'),
    fs.readFileSync('docs/todoapp.css'),
    fs.readFileSync('docs/bootstrap.js'),
    fs.readFileSync('docs/helpers.js'),
    fs.readFileSync('docs/app.js')
  ]).then(files => {

    // Does the browser support push?
    if (res.push) {
      // >>>>>>>>>>>
      // CSS stuff

      const appCssStream = res.push('/app.css', {
        req: {'accept': '**/*'},
        res: {'content-type': 'text/css'}
      });

      appCssStream.on('error', err => {
        console.log(err);
      });

      appCssStream.end(files[1]);


      const todoappCssStream = res.push('/todoapp.css', {
        req: {'accept': '**/*'},
        res: {'content-type': 'text/css'}
      });

      todoappCssStream.on('error', err => {
        console.log(err);
      });

      todoappCssStream.end(files[2]);


      // >>>>>>>>>>>>
      // The JS files
      var bootstrapStream = res.push('/bootstrap.js', {
        req: {'accept': '**/*'},
        res: {'content-type': 'application/javascript'}
      });

      bootstrapStream.on('error', err => {
        console.log(err);
      });

      bootstrapStream.end(files[3]);

      var helpersStream = res.push('/helpers.js', {
        req: {'accept': '**/*'},
        res: {'content-type': 'application/javascript'}
      });

      helpersStream.on('error', err => {
        console.log(err);
      });

      helpersStream.end(files[4]);

      var appStream = res.push('/app.js', {
        req: {'accept': '**/*'},
        res: {'content-type': 'application/javascript'}
      });

      appStream.on('error', err => {
        console.log(err);
      });

      appStream.end(files[5]);
    }

    res.writeHead(200);
    res.end(files[0]);
  }).catch(error => res.status(500).send(error.toString()));
}).listen(3000);