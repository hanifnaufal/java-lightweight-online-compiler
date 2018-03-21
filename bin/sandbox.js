/**
  * @Constructor
  * @variable Sandbox
  * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
  * @param {Number} timeout_value: The Time_out limit for code execution in Docker
  * @param {String} path: The current working directory where the current folder is kept
  * @param {String} folderName: The name of the folder that would be mounted/shared with Docker container, this will be concatenated with path
  * @param {String} vm_name: The TAG of the Docker VM that we wish to execute
  * @param {String} compiler_name: The compiler/interpretor to use for carrying out the translation
  * @param {String} file_name: The file_name to which source code will be written
  * @param {String} code: The actual code
  * @param {String} output_command: Used in case of compilers only, to execute the object code, send " " in case of interpretors
*/
var Sandbox = function(
  timeout_value,
  path,
  folderName,
  vm_name,
  compiler_name,
  file_name,
  code,
  output_command,
  languageName,
  e_arguments,
  stdin_data)
{

    this.timeout_value = timeout_value;
    this.path = path;
    this.folderName = folderName;
    this.vm_name = vm_name;
    this.compiler_name = compiler_name;
    this.file_name = file_name;
    this.code = code;
    this.output_command = output_command;
    this.langName = languageName;
    this.extra_arguments = e_arguments;
    this.stdin_data = stdin_data;
}

/**
 * @function
 * @name Sandbox.run
 * @description Function that first prepares the Docker environment and then executes the Docker sandbox
 * @param {Function pointer} success
*/
Sandbox.prototype.run = function(success)
{
    var sandbox = this;
    this.prepare(function() {
        sandbox.execute(success);
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
 * @param {Function pointer} success ?????
*/
DockerSandbox.prototype.prepare = function(success)
{
  var exec = require('child_process').exec;
  var fs = require('fs');
  var sandbox = this;
  var folderAbsolutePath = sandbox.path + sandbox.folderName;
  var commands =
    "mkdir -p " + folderAbsolutePath + " && "
    // TODO verify
    // "cp "+ this.path + "/Payload/* "+ folderAbsolutePath +" && " +
    "chmod 777 " + folderAbsolutePath;

  exec(commands, function(st) {
    var fileAbsolutePath = folderAbsolutePath + "/" + sandbox.file_name;
    var content = sandbox.code;
    fs.writeFile(fileAbsolutePath, content, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("file was saved!");
          //TODO verify
          // exec("chmod 777 \'" + fileAbsolutePath +"\'")
          exec("chmod 777 " + fileAbsolutePath);

          var stdinPath = folderAbsolutePath + "/inputFile";
          fs.writeFile(stdinPath, sandbox.stdin_data, function(err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log("Input file was saved!");
                  success();
              }
          });
        }
    });
  });
}
