var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({},function(e,docs){
    res.json(docs);
  });
});

/*
 * POST searchuser.
 */
router.post('/searchuser', function(req, res) { //console.log(req.body);
    var db = req.db;
    var fld = req.body.fieldName;
    var fldv = req.body.fieldValue;
    var cnd = req.body.condition;
    switch (cnd) {
        case '>':
            var collection = db.get('userlist');
            collection.find({
                [fld] : {$gt: fldv}
            },function(e,docs){
                res.send((e === null) ? { msg: '', data: docs } : { msg:'error: ' + e });
                //res.json(docs);
            });

            break;
        case '<':
            var collection = db.get('userlist');
            collection.find({
                [fld] : {$lt: fldv}
            },function(e,docs){
                res.send((e === null) ? { msg: '', data: docs } : { msg:'error: ' + e });
                //res.json(docs);
            });
            break;
        default:
            var collection = db.get('userlist');
            collection.find({
                [fld] : fldv
            },function(e,docs){
                res.send((e === null) ? { msg: '', data: docs } : { msg:'error: ' + e });
                //res.json(docs);
            });
            break;
    }

});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * EDIT to user.
 */
router.get('/edituser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    var userToEdit = req.params.id;

    collection.findOne({
        '_id' : userToEdit
    },function(e,doc){
        res.send((e === null) ? { msg: '', data: doc } : { msg:'error: ' + e });
    });

});

/*
 * DELETE a property for user.
 */
router.post('/deleteproperty', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToEdit = req.body.id;
    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(userToEdit);
    var name =  req.body.field;
    var query = {};
    query[name] = 1;
    //console.log(query + '  '+ o_id);
    collection.update({'_id':o_id},
        {$unset: query}, function (e, doc) {
            res.send((e === null) ? { msg: '', data: doc } : { msg:'error: ' + e });
        });

});

/*
 * DELETE a property for table all records.
 */
router.post('/deletepropertyfortable', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var mongo = require('mongodb');
    var name =  req.body.field;
    var query = {};
    query[name] = 1;
    //console.log(query);
    collection.update({},
        {$unset: query}, {multi: true}, function (e, doc) {
            res.send((e === null) ? { msg: '', data: doc } : { msg:'error: ' + e });
        });

});

/*
 * ADD a property for table all records.
 */
router.post('/addpropertyfortable', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var mongo = require('mongodb');
    var name =  req.body.field;
    var value =  req.body.fieldValue; // default value for all
    var query = {};
    query[name] = value;
    //console.log(query);
    collection.update({},
        {$set: query}, {multi: true}, function (e, doc) {
            res.send((e === null) ? { msg: '', data: doc } : { msg:'error: ' + e });
        });

});

/*
 * DELETE a property for user.
 */
router.post('/addproperty', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToEdit = req.body.id;
    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(userToEdit);
    var name =  req.body.field;
    var fieldValue = req.body.fieldValue;
    var query = {};
    query[name] = fieldValue;
    //console.log(query + '  '+ o_id);
    collection.update({'_id':o_id},
        {$set: query}, function (e, doc) {
            res.send((e === null) ? { msg: '', data: doc } : { msg:'error: ' + e });
        });

});

module.exports = router;
