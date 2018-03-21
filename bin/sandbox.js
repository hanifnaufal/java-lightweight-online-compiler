/**
  * @Constructor
  * @variable Sandbox
  * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
  * @param {Number} timeout_value: The Time_out limit for code execution in Docker
  * @param {String} path: The current working directory where the current folder is kept
  * @param {String} folderName: The name of the folder that would be mounted/shared with Docker container, this will be concatenated with path
  * @param {String} code: The actual code
*/
var Sandbox = function(
  timeout_value,
  path,
  folderName,
  code,
  stdin_data
){

  this.path = path;
  this.folderName = folderName;
  this.timeout_value = timeout_value;
  this.code = code;
  this.stdin_data = stdin_data;

  this.file_name = "Main.java";
  this.vm_name = "frolvlad/alpine-oraclejdk8:slim";
  this.workingDirectory = this.path + this.folderName;
  this.codeAbsolutePath = this.workingDirectory + "/" + this.file_name;
  this.stdinAbsolutePath = this.workingDirectory + "/inputFile";
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
Sandbox.prototype.prepare = function(success) {
  var exec = require('child_process').exec;
  var fs = require('fs');
  var sandbox = this;
  var commands =
    "mkdir -p " + sandbox.workingDirectory + " && "
    "chmod 777 " + sandbox.workingDirectory;

  exec(commands, function(st) {
    fs.writeFile(sandbox.codeAbsolutePath, sandbox.code, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("file was saved!");
          //TODO verify
          // exec("chmod 777 \'" + fileAbsolutePath +"\'")
          exec("chmod 777 " + sandbox.codeAbsolutePath);

          fs.writeFile(sandbox.stdinAbsolutePath, sandbox.stdin_data, function(err) {
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
 * @param {Function pointer} success
*/

Sandbox.prototype.execute = function(success) {
  var exec = require('child_process').exec;
  var fs = require('fs');
  var timeoutCounter = 0;
  var sandbox = this;

  var dockerCommand = "docker run --rm -v " + sandbox.workingDirectory + ":/mnt --workdir /mnt " + vm_name + " sh -c 'javac " + sandbox.file_name + " && java Main < stdinFile'";
  console.log(dockerCommand);
  //This is done ASYNCHRONOUSLY. TODO ??????
  // exec(st);

  console.log("------------------------------")
  //Check For File named "completed" after every 1 second

  // var intid = setInterval(function()
  //     {
  //         //Displaying the checking message after 1 second interval, testing purposes only
  //         //console.log("Checking " + sandbox.path+sandbox.folder + ": for completion: " + timeoutCounter);
  //
  //         timeoutCounter = timeoutCounter + 1;
  //
  //         fs.readFile(sandbox.path + sandbox.folder + '/completed', 'utf8', function(err, data) {
  //
  //         //if file is not available yet and the file interval is not yet up carry on
  //         if (err && timeoutCounter < sandbox.timeout_value)
  //         {
  //             //console.log(err);
  //             return;
  //         }
  //         //if file is found simply display a message and proceed
  //         else if (timeoutCounter < sandbox.timeout_value)
  //         {
  //             console.log("DONE")
  //             //check for possible errors
  //             fs.readFile(sandbox.path + sandbox.folder + '/errors', 'utf8', function(err2, data2)
  //             {
  //             	if(!data2) data2=""
  //              		console.log("Error file: ")
  //              		console.log(data2)
  //
  //              		console.log("Main File")
  //              		console.log(data)
  //
  //             		var lines = data.toString().split('*-COMPILEBOX::ENDOFOUTPUT-*')
  //             		data=lines[0]
  //             		var time=lines[1]
  //
  //             		console.log("Time: ")
  //             		console.log(time)
  //
  //
  //    	           	success(data,time,data2)
  //             });
  //
  //             //return the data to the calling functoin
  //
  //         }
  //         //if time is up. Save an error message to the data variable
  //         else
  //         {
  //         	//Since the time is up, we take the partial output and return it.
  //         	fs.readFile(sandbox.path + sandbox.folder + '/logfile.txt', 'utf8', function(err, data){
  //         		if (!data) data = "";
  //                 data += "\nExecution Timed Out";
  //                 console.log("Timed Out: "+sandbox.folder+" "+sandbox.langName)
  //                 fs.readFile(sandbox.path + sandbox.folder + '/errors', 'utf8', function(err2, data2)
  //               {
  //               	if(!data2) data2=""
  //
  //             			var lines = data.toString().split('*---*')
  //             			data=lines[0]
  //             			var time=lines[1]
  //
  //             			console.log("Time: ")
  //             			console.log(time)
  //
  //                  	success(data,data2)
  //               });
  //         	});
  //
  //         }
  //
  //         //now remove the temporary directory
  //         console.log("ATTEMPTING TO REMOVE: " + sandbox.folder);
  //         console.log("------------------------------")
  //         exec("rm -r " + sandbox.folder);
  //
  //         clearInterval(intid);
  //     });
  // }, 1000);
}


module.exports = Sandbox;
