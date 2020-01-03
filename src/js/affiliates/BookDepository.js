
const request = require("request");
const sizeof = require('object-sizeof');
const lruCache = require("lru-cache")
const parseString = require('xml2js').parseString;
const urlutils = require("../utils/url")();
module.exports = BookPricing;

function BookPricing(clientId, authKey) {

  const cacheOptions = {
    max: 1500000000,
    length: (item, key) => {
      return sizeof(item) + sizeof(key);
    },
    maxAge: 60*60*24*7
  };
  const cache = new lruCache(cacheOptions);

  var prepUrl = function(params) {
    const paramArr = [];
    for (const k in params) {
      paramArr.push(k + '=' + encodeURIComponent(params[k]));
    }
    return 'https://api.bookdepository.com/search/books?' + paramArr.join('&');
  };

  var getKey = (title, author) => {
    return title + ':' + author;
  };

  var getPrices = function(ip, title, author) {

    return new Promise(function(resolve, reject) {
      //
      const cacheKey = getKey(title, author);
      const fromCache = cache.get(cacheKey);
      if (fromCache !== undefined) {
        console.log('resolving from cache for: ' + cacheKey);
        resolve(fromCache);
      } else {
        const url = prepUrl({
          'clientId': clientId,
          'authenticationKey': authKey,
          'IP': ip,
          'title': title,
          'author': author,
          'currencies': 'USD,AUD,CAD,NZD,GBP,EUR,MXN',
          'images': 'small,medium,large'
        });
        // populate the cache
        request.get({
          url : url
        }, (err, resp, body) => {
          //
          // console.log('get with values: ' + body);
          // it works ok
          if (err) {
            reject(err);
          } else {
            // try to parse:
            const data = body; 
            parseString(data, (parseErr, result) => {
              if (parseErr) {
                console.log('failed to parse xml: ' + parseErr);
                reject(parseErr);
              } else {
                // update cahce with the results
                const results = result['result']['items'][0]['item'];

                // Map over results
                const bookPrices = results.map((item) => {

                  if (item['url'] === undefined || item['biblio'] === undefined) {
                    return null;
                  }
                  // TODO: check name and author? maybe
                  const url = item['url'].reduce((acc, itemUrl) => {
                    if (acc === '' && itemUrl['$']['type'] === 'direct') {
                      return itemUrl['_'];
                    }
                    return acc;
                  }, '');

                  const title = item['biblio'].reduce((acc, itemBiblio) => {
                    return itemBiblio['title'];
                  }, '');

                  // images: [{image: [{ _: url, $: {nma,e width, height}}]}]
                  let images;
                  if (item['images'] === undefined) {
                    images = undefined;
                  } else {
                    images = item['images'].reduce((acc, img) => {
                      return img['image'].reduce((acc, image) => {
                        return {...acc, ...{
                          [image['$']['name']]: image['_']
                        }}
                      }, {});

                    }, {});
                  }

                  // Similar to images
                  const pricing = item['pricing'].reduce((acc, prices) => {
                    return prices['price'].reduce((acc, price) => {
                      const aux = {};
                      if (price['retail'] !== undefined) {
                        aux['retail'] = price['retail'].reduce((acc, retail) => retail, '');
                      }
                      if (price['selling'] !== undefined) {
                        aux['sale'] = price['selling'].reduce((acc, sale) => sale, '');
                      }
                      return {...acc, ...{
                        [price['$']['currency']]: aux
                      }};
                    }, {});
                  }, {});

                  return {
                    url: url,
                    title: title,
                    img: images,
                    price: pricing
                  }
                });

                const bookPricing = {
                  last: (new Date()).getTime(),
                  list: bookPrices.filter(item => item !== null)
                };

                console.log('SIZING:' + sizeof(bookPricing));
                // Set in cache
                cache.set(cacheKey, bookPricing);
                // Resolve
                resolve(bookPricing);
              }
            });
          }
        });
      }
    });
  };


  return {
    getPrices
  };
};