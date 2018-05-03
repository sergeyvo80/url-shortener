const links = require('../models/links');

/**
 * Shortener
 */
class Shortener {

  /**
   * Create short link
   *
   * @param req
   * @returns {Promise<any>}
   */
  createShort(req) {
    let me = this;
    let url = req.body.url;
    let urlDoc = {
      type: 'link',
      url: url,
      startTime: req._startTime,
      remoteAddress: req._remoteAddress
    };
    let retProm = new Promise((resolve, reject) => {
      links.getByUrl(url).then(
        (link) => {
          if (link) {
            resolve(link.id);
          } else {
            links.post(urlDoc, me.createShortUuid).then((link) => {
              resolve(link.id);
            }, reject);
          }
        }
      , reject);
    });
    return retProm;
  }

  /**
   * Get real url by short url
   *
   * @param shortUuid
   * @returns {Promise<any>}
   */
  getUrlByShort(shortUuid) {
    return new Promise((resolve, reject) => {
      links.getByShortKey(shortUuid).then(
        (link) => {
          if (link) {
            resolve(link.url);
          } else {
            reject();
          }
        }
        , reject);
    });
  }

  /**
   * Create short uuid from couch db uuid
   *
   * @param uuid - hex string
   * @returns {string}
   */
  createShortUuid(uuid) {
    //let shortUuidHex = uuid.substring(0, 2) + uuid.substring(25);
    let shortUuidHex = uuid.substring(29, 32) + uuid.substring(0, 2) + uuid.substring(26, 29);
    const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    const base = alphabet.length; // base is the length of the alphabet (58 in this case)
    let encoded = '';
    let num = parseInt(shortUuidHex, 16);
    while (num) {
      let remainder = num % base;
      num = Math.floor(num / base);
      encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
  }

}

module.exports = new Shortener();
