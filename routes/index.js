var express = require('express');
var router = express.Router();
const multer = require('multer');

const upload = multer();

let subscribers = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/message', upload.none(), function(req, res, next) {  
  console.log(req.body);
  res.send({data: req.body.message});
  
  const failed = new Set();
  for (const s of subscribers) {
    try {
      s.write(`data: ${req.body.message}\n\n`);
    } catch (err) {
      failed.add(s);
    }    
  }
  subscribers = subscribers.filter(s => !failed.has(s));
});

router.get('/events', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  subscribers.push(res);
});

module.exports = router;
