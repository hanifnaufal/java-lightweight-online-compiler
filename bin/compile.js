var sandbox = require('./sandbox');
var crypto = require("crypto");

function random(size) {
    return crypto.randomBytes(size).toString('hex');
}

var Compile = {};
// TODO res
Compile.compile = function(code, stdin, res) {
    var workingDirectory = '/tmp/elcompilo/' + random(10);
    var timeout_value = 20;

    var sandboxType = new sandbox(
      timeout_value,
      workingDirectory,
      code,
      stdin
    );

    sandboxType.run((output) => {
      console.log("Data: "+ output)
      res.send({
        output:output,
        langid: "language",
        code:code,
        errors:"err",
        time:"exec_time"
      });
    });

};

module.exports = Compile;
