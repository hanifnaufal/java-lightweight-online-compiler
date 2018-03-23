var app = require('express');
var compile = require('../bin/compile')
var router = app.Router();

router.get('/', function(req, res, next)
{
    res.sendfile("./views/codepad.html");
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

})

module.exports = router;
