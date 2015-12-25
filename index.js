"use strict";

var through = require('through2');

/*
 * Convenience method for turning a through2 stream
 * into a full string. Otherwise we may just get chunks,
 * because Node buffers are chunked based on file size.
 */
function streamToString(callback) {
  var str = '';

  return through(
    function (chunk, enc, next) {
      str += chunk.toString('utf8');
      next();
    },
    function (next) { // flush function
      callback.bind(this)(str, next);
    }
  );
}

function versionify(filename) {

  if (!/\b(?:package.json)$/.test(filename)) {
    return through();
  }
  return streamToString(function (contents, next) {
    var json = JSON.parse(contents);
    this.push("{\"version\":\"" + json.version + "\"}");
    next();
  });
}

module.exports = versionify;