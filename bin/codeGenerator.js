var templateBegin = "public class Main {\n\tpublic static void main(String[] args) {\n\t\t";
var templateEnd = "\n\t}\n}\n";
var CodeGenerator = {};
CodeGenerator.generate = (input, callback) => {
  var formattedInput = reformat(input);
  var code = templateBegin + formattedInput + templateEnd;
  callback({
    code: code
  });
};

function reformat(input) {
  return input.replace(new RegExp("\n", 'g'), "\n\t\t");
}

module.exports = CodeGenerator;
