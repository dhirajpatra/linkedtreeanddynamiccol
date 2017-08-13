var express = require('express');
var router = express.Router();


function getChildreRecursive(parentId, callback) {
    var stack = [];

    collection.find({parent: parseInt(parentId)}).then(function (children) {
        console.log(children);
        stack.push(children);
        getChildreRecursive(children.id, callback);
    });

    callback(stack);
}

/**
 * get node list
 */
router.get('/nodelist', function(req, res) {
    var db = req.db;
    var collection = db.get('trees');
    var stack = [];

    collection.find({},function(e,docs){

        docs.forEach(function (doc) {

            //console.log(doc.id);
            collection.find({parent: parseInt(doc.id)}).then(function (children) {
                console.log(children);
                stack.push(children);
            });

        });



    });


    /*collection.find({},function(e,docs){
        //console.log(docs);
        var descendants = [];
        var stack = [];
        collection.findOne({id:1}).then(function (item) {
            stack.push(item);
            while (stack.length > 0){
                var currentnode = stack.pop();
                console.log(currentnode);
                collection.find({parent:currentnode.id}).then(function (children) {
                    children.forEach(function (child) {
                        //console.log(child);
                        descendants.push(child.id);
                        stack.push(child);
                        console.log(stack.length);
                    });

                });
            }
            descendants.join(",");
           // console.log(descendants);
        });
        //res.send((e === null) ? { msg: '', data: docs } : { msg:'error: ' + e });
        res.json(descendants);
    });*/
});

/**
 * add a node to tree and reindex
 */
router.post('/addnode', function(req, res) {
    var db = req.db;
    var collection = db.get('trees');
    var parent =  parseInt(req.body.parentId); //console.log(parent);
    // check parent is exist or not
    var query = {id: parent};

    // check parent id exists or not
    collection.findOne(query, function(e, doc) {
        //res.send((e === null) ? { msg: '', data: docs } : { msg:'error: ' + e });
        if(doc == null || typeof(doc) == "undefined" || doc.length == 0){
            res.json({'msg':''});
        }
    });

    var options = { "sort": [['id','desc']] };
    collection.findOne({}, options , function(err, doc) {
        var newId = parseInt(doc.id) + 1;
        //console.log(newId);

        collection.insert({
            id: newId,
            parent: parent
        }, function(err, result){
            // re index
            collection.createIndex( { parent: 1, order:1 }, { unique:true});

            res.send(
                (err === null) ? { msg: 'Added' } : { msg: err }
            );
        });
    });
});

module.exports = router;
