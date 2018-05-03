const config = require('../config');
const nano = require('nano')(config.dbhost);
const fs = require('fs');
let linksDb;
let couchDesign = require('../couch-design/links.json');

nano.db.create(config.dbname, function (err, body) {
  if (!err) {
    console.log('db ceated');
    linksDb = nano.db.use(config.dbname);
    linksDb.insert(couchDesign, null, function (err, body) {
      if (!err) {
        console.log('design document created');
      } else {
        console.log(err);
      }
    });
  } else {
    console.log(err.reason);
  }
});
linksDb = nano.db.use(config.dbname);


/**
 * Links model
 */
class Links {

  /**
   * post url doc to db
   *
   * @param urlDoc
   * @param createShortUuid
   * @returns {Promise<any>}
   */
  post(urlDoc, createShortUuid) {
    return new Promise(function (resolve, reject) {

      nano.uuids(2, (_, uuids) => {

        let linkUuid = createShortUuid(uuids.uuids[0]);
        let linkUuid2 = createShortUuid(uuids.uuids[1]);

        urlDoc._id = linkUuid;
        linksDb.insert(urlDoc, null, (err, body) => {
          if (!err) {
            console.log(body);
            resolve(body);
          } else {
            urlDoc._id = linkUuid2;
            linksDb.insert(urlDoc, null, (err, body) => {
              if (!err) {
                resolve(body);
              } else {
                reject(err);
              }
            });
          }
        });

      });
    });
  }

  /**
   * Get short link key by real url
   *
   * @param url
   * @returns {Promise<any>}
   */
  getByUrl(url) {
    let promise = new Promise((resolve, reject) => {
      linksDb.view('links', 'byurl', {
        'key': url
      }, function(err, body) {
        if (!err) {
          let link = body.rows[0] || false;
          resolve(link);
        } else {
          reject(err);
        }
      });
    });
    return promise;
  }

  /**
   * Get link by short key
   *
   * @param url
   * @returns {Promise<any>}
   */
  getByShortKey(shortUuid) {
    let promise = new Promise((resolve, reject) => {
      linksDb.get(shortUuid, function(err, body) {
        if (!err) {
          resolve(body);
        } else {
          reject(err);
        }
      });
    });
    return promise;
  }

}

module.exports = new Links();
