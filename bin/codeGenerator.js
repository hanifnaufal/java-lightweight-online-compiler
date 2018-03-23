var templateBegin = "public class Main {\n  public static void main(String[] args) {\n  }\n}\n";
var CodeGenerator = {};
CodeGenerator.generate = (input, callback) => {
      callback({
          code: templateBegin
      });
};

module.exports = CodeGenerator;
