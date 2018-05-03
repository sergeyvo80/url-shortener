const config = require('../config');
const express = require('express');
const router = express.Router();
const shortener = require('../meta/shortener');
const nano = require('nano')(config.dbhost);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Url shortener (Node, CouchDb)'
  });
});

/* short link processing (301 redirect from short to real url) */
router.get('/*', (req, res, next) => {
  let shortUuid = req.url.replace(/\//g, '');
  shortener.getUrlByShort(shortUuid).then((url) => {
    res.redirect(301, url);
  }, (err) => {
    res.send(err.error)
  });
});

/* short link creation */
router.post('/', (req, res, next) => {
  shortener.createShort(req).then((shortKey) => {
      res.send(config.webRoot + '/' + shortKey);
  });
});

module.exports = router;
