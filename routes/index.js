var app = require('express');
var path = require('path');
var compile = require('../bin/compile')
var codeGenerator = require('../bin/codeGenerator')
var router = app.Router();

router.get('/', function(req, res, next)
{
    // res.sendFile(__dirname + "/views/codepad.html");
    res.sendFile(path.join(__dirname, '../views', 'codepad.html'));
});

router.post('/compile', bruteforce.prevent, function(req, res, next)
{
    compile.compile(
        req.body.code,
        req.body.stdin,
        req.body.args,
        (result) => {
            res.send(result);
        }
    );
});
router.post('/generateCode', bruteforce.prevent, function(req, res, next) {
    codeGenerator.generate(
        req.body.insideCode,
        (result) => {
            res.send(result);
        }
    );
})

module.exports = router;
