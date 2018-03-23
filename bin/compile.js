var sandbox = require('./sandbox');
var crypto = require("crypto");

function random(size) {
    return crypto.randomBytes(size).toString('hex');
}

var Compile = {};
Compile.compile = (code, stdin, args, callback) => {
    var workingDirectory = '/tmp/elcompilo/' + random(10);
    var timeout_value = 20;

    var sandboxType = new sandbox(
      timeout_value,
      workingDirectory,
      code,
      stdin,
      args
    );

    sandboxType.run((output) => {
      callback({
        output:output
      });
    });

};

module.exports = Compile;
