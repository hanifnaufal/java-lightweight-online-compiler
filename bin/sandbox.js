const errorMessage = "Site System Error. Sorry for the inconvenience.";

/**
  * @Constructor
  * @variable Sandbox
  * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
  * @param {Number} timeout_value: The Time_out limit for code execution in Docker
  * @param {String} workingDirectory: The name of the folder that would be mounted/shared with Docker container, this will be concatenated with path
  * @param {String} code: The actual code
*/
var Sandbox = function(
  timeout_value,
  workingDirectory,
  code,
  stdin_data,
  args
){
  this.timeout_value = timeout_value;
  this.code = code;
  this.stdin_data = stdin_data;
  this.args = args;
  this.workingDirectory = workingDirectory;

  this.file_name = "Main.java";
  this.vm_name = "frolvlad/alpine-oraclejdk8:slim";

  this.codeAbsolutePath = this.workingDirectory + "/" + this.file_name;
  this.stdinAbsolutePath = this.workingDirectory + "/inputFile";
}

/**
 * @function
 * @name Sandbox.run
 * @description Function that first prepares the Docker environment and then executes the Docker sandbox
 * @param {Function pointer} callback
*/
Sandbox.prototype.run = function(callback)
{
  var sandbox = this;
  this.prepare(function() {
      sandbox.execute(callback);
  });
}

/**
 * @function
 * @name Sandbox.prepare
 * @description Function that creates a directory with the folder name already provided through constructor
 * and then copies contents of folder named Payload to the created folder, this newly created folder will be mounted
 * on the Docker Container. A file with the name specified in file_name variable of this class is created and all the
 * code written in 'code' variable of this class is copied into this file.
 * Summary: This function produces a folder that contains the source file and 2 scripts, this folder is mounted to our
 * Docker container when we run it.
 * @param {Function pointer} callback
*/
Sandbox.prototype.prepare = function(callback) {
  var exec = require('child_process').exec;
  var fs = require('fs');
  var sandbox = this;
  var commands =
    "mkdir -p " + sandbox.workingDirectory + " && " +
    "chmod 777 " + sandbox.workingDirectory;

  exec(commands, function(st) {
    fs.writeFile(sandbox.codeAbsolutePath, sandbox.code, function(err) {
      if (err) {
        console.log(err);
      } else {
        exec("chmod 777 " + sandbox.codeAbsolutePath);

        fs.writeFile(sandbox.stdinAbsolutePath, sandbox.stdin_data, function(err) {
          if (err) {
            console.log(err);
          } else {
            callback();
          }
        });
      }
    });
  });
}


/**
 * @function
 * @name Sandbox.execute
 * @precondition: DockerSandbox.prepare() has successfully completed
 * @description: This function takes the newly created folder prepared by DockerSandbox.prepare() and spawns a Docker container
 * with the folder mounted inside the container with the name '/usercode/' and calls the script.sh file present in that folder
 * to carry out the compilation. The Sandbox is spawned ASYNCHRONOUSLY and is supervised for a timeout limit specified in timeout_limit
 * variable in this class. This function keeps checking for the file "Completed" until the file is created by script.sh or the timeout occurs
 * In case of timeout an error message is returned back, otherwise the contents of the file (which could be the program output or log of
 * compilation error) is returned. In the end the function deletes the temporary folder and exits
 *
 * Summary: Run the Docker container and execute script.sh inside it. Return the output generated and delete the mounted folder
 *
 * @param {Function pointer} callback
*/

Sandbox.prototype.execute = function(callback) {
  var exec = require('child_process').exec;
  var fs = require('fs');
  var timeoutCounter = 0;
  var sandbox = this;

  var dockerCommand;
  if (env == 'prod') {
    dockerCommand = "docker run --rm"
                    + " --cidfile " + sandbox.workingDirectory + "/docker.cid"
                    + " -v " + sandbox.workingDirectory + ":/mnt --workdir /mnt " + sandbox.vm_name
                    + " sh -c 'javac " + sandbox.file_name + " && java Main " + sandbox.args + " < inputFile'"
                    + " && rm -r " + sandbox.workingDirectory;
  } else {
    dockerCommand = " javac " + sandbox.workingDirectory + "/" +  sandbox.file_name + " && java -classpath " + sandbox.workingDirectory + "/ Main " + sandbox.args + " < " + sandbox.workingDirectory + "/inputFile"
                    + " && rm -r " + sandbox.workingDirectory;
  }

  var execOption = {
    timeout: sandbox.timeout_value
  };

  var dockerExec = exec(dockerCommand, execOption, (error, stdout, stderr) => {
    // console.log(error + "/" + stdout + "/" + stderr);
    if (error) {
      if (error.signal != "SIGTERM") {
        callback(stderr);
      }
    } else {
      console.log("b");
      callback(stdout);
    }
  });
  //TODO rm not working with this 
  dockerExec.on('exit', function (code, signal) {
    // console.log(code + "/" + signal);
    if (signal == "SIGTERM") {
      callback("Timeout");
    }
  });
}


module.exports = Sandbox;
