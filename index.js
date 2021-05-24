const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync('index.html', 'utf-8');

const replaceFunction = (tempVal, origVal) =>{
    let temperature = tempVal.replace('{%temp%}', origVal.main.temp);
    temperature = temperature.replace('{%location%}', origVal.name);
    temperature = temperature.replace('{%country%}', origVal.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=61369a1deede38bc966cb288dc354ad0')
.on('data', (chunk) => {
    const objdata = JSON.parse(chunk);
    const arrdata = [objdata];
  //console.log(arrdata);

  const realTimeData = arrdata
        .map((val) => replaceFunction(homeFile, val))
        .join("");

        res.write(realTimeData);
})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
 
  console.log('end');
});
    }
});

server.listen(8000, "127.0.0.1");