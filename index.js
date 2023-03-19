const http = require('http');
const https = require('https');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Welcome to my server!</h1><img src="https://dummyimage.com/600x400/000/fff" />');
    res.end();
  } else if (path === '/list') {
    https.get('https://swapi.dev/api/people', (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        const people = JSON.parse(data).results;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<table>');
        res.write('<tr><th>Name</th><th>Height</th><th>Mass</th><th>Gender</th></tr>');
        people.forEach((person) => {
          res.write(`<tr><td>${person.name}</td><td>${person.height}</td><td>${person.mass}</td><td>${person.gender}</td></tr>`);
        });
        res.write('</table>');
        res.end();
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>Page Not Found</h1>');
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
