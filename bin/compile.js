// var sandBox = require('./DockerSandbox');
var crypto = require("crypto");

function random(size) {
    return crypto.randomBytes(size).toString('hex');
}

var Compile = {};
// TODO res
Compile.compile = function(language, code, stdin, res) {
    var folder= '/tmp/elcompilo/' + random(10);
    var path=__dirname+"/";
    var vm_name='virtual_machine';
    var timeout_value=20;

    res.send({
      output:"hi, it is working lho",
      langid: language,
      code:code,
      errors:stdin,
      time:timeout_value
    });

    // var sandboxType = new sandBox(timeout_value,path,folder,vm_name,arr.compilerArray[language][0],arr.compilerArray[language][1],code,arr.compilerArray[language][2],arr.compilerArray[language][3],arr.compilerArray[language][4],stdin);

    // sandboxType.run(function(data,exec_time,err)
    // {
    //     //console.log("Data: received: "+ data)
    //   res.send({
    //     output:data,
    //     langid: language,
    //     code:code,
    //     errors:err,
    //     time:exec_time
    //   });
    // });

};

module.exports = Compile;
