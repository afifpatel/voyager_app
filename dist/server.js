'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//To let Node.js report line numbers by using source maps, we need to install thesource-map-support module, and also call the library in the application once
//ES2015 
//ES2015 
// const express =  require('express');
// const bodyParser= require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const Issue = require('./issue.js');


_sourceMapSupport2.default.install(); //ES2015 
//ES2015 

//deployment changes
const path = require("path");

const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

//deployment change
// app.use(express.static(path.join(__dirname, "client", "build")))

//deployment change
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve('static/index.html'));
// });

//deployment change

const PORT = process.env.PORT || 3000;
let db;
_mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost').then(client => {
    db = client.db('s3');
    app.listen(PORT, () => {
        console.log('App startedddddd on port 3000');
    });
}).catch(error => {
    console.log('ERROR:', error);
});

app.get('/api/moments', (req, res) => {
    var filter = [];

    if (req.query.start && req.query.end) {
        var start_date = req.query.start + "+02:00";
        var end_date = req.query.end + "+02:00";
        filter = [{ $project: { "data.user.moment_history": 1 } }, { $project: { _id: 0, "moments": { $filter: { input: "$data.user.moment_history",
                        as: "moment",
                        cond: { $and: [{ $gte: ["$$moment.start", start_date] }, { $lte: ["$$moment.end", end_date] }]
                        }
                    }
                } } }];
    } else if (req.query.start) {
        var start_date = req.query.start + "+02:00";
        filter = [{ $project: { "data.user.moment_history": 1 } }, { $project: { _id: 0, "moments": { $filter: { input: "$data.user.moment_history",
                        as: "moment",
                        cond: { $and: [{ $gte: ["$$moment.start", start_date] }]
                        }
                    }
                } } }];
    } else if (req.query.end) {
        var end_date = req.query.end + "+02:00";
        filter = [{ $project: { "data.user.moment_history": 1 } }, { $project: { _id: 0, "moments": { $filter: { input: "$data.user.moment_history",
                        as: "moment",
                        cond: { $and: [{ $lte: ["$$moment.end", end_date] }]
                        }
                    }
                } } }];
    } else {
        filter = [{ $project: { "data.user.moment_history": 1 } }, { $project: { _id: 0, moments: "$data.user.moment_history" } }];
    }
    // if (req.query.start) {
    //     var start_date = req.query.start + "+02:00"
    //     // var start_date = new Date(req.query.start).toISOString()
    // filter = [
    //     {  $project : { "data.user.moment_history" : 1}}, 
    //     { $unwind : "$data.user.moment_history"},
    //     { $match : {  "data.user.moment_history.start" :  start_date}}
    // ]
    // }
    // else {
    //     filter = [
    //         {  $project : { "data.user.moment_history" : 1}}, 
    //         { $unwind : "$data.user.moment_history"},  
    //     ]
    // }

    // console.log("filter", filter)

    db.collection('sentiance').aggregate(filter).toArray().then(list => {
        const metadata = { total_count: list.length };
        // console.log("List received", list)
        res.json({ _metadata: metadata, records: list });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.get('/api/events', (req, res) => {
    var filter = [];

    if (req.query.start && req.query.end) {
        var start_date = req.query.start + "+02:00";
        var end_date = req.query.end + "+02:00";
        filter = [{ $project: { "data.user.event_history": 1 } }, { $project: { _id: 0, "events": { $filter: { input: "$data.user.event_history",
                        as: "event",
                        cond: { $and: [{ $gte: ["$$event.start", start_date] }, { $lte: ["$$event.end", end_date] }]
                        }
                    }
                } } }];
    } else if (req.query.start) {
        var start_date = req.query.start + "+02:00";
        filter = [{ $project: { "data.user.event_history": 1 } }, { $project: { _id: 0, "events": { $filter: { input: "$data.user.event_history",
                        as: "event",
                        cond: { $and: [{ $gte: ["$$event.start", start_date] }]
                        }
                    }
                } } }];
    } else if (req.query.end) {
        var end_date = req.query.end + "+02:00";
        filter = [{ $project: { "data.user.event_history": 1 } }, { $project: { _id: 0, "events": { $filter: { input: "$data.user.event_history",
                        as: "event",
                        cond: { $and: [{ $lte: ["$$event.end", end_date] }]
                        }
                    }
                } } }];
    } else {
        filter = [{ $project: { "data.user.event_history": 1 } }, { $project: { _id: 0, events: "$data.user.event_history" } }];
    }
    // if (req.query.start) {
    // filter = [
    //     {  $project : { "data.user.event_history" : 1}}, 
    //     { $unwind : "$data.user.event_history"},
    //     { $match : {  "data.user.event_history.start" :  req.query.start}}
    // ]
    // }
    // else {
    //     filter = [
    //         {  $project : { "data.user.event_history" : 1}}, 
    //         { $unwind : "$data.user.event_history"},  
    //     ]
    // }


    // console.log("filter", filter)

    db.collection('sentiance').aggregate(filter).toArray().then(list => {
        const metadata = { total_count: list.length };
        // console.log("List received", list)
        res.json({ _metadata: metadata, records: list });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.get('/api/dashboard', (req, res) => {
    const filter = [{ $project: { "data.user.event_history": 1 } }, { $unwind: "$data.user.event_history" }];

    db.collection('sentiance').aggregate(filter).toArray().then(list => {
        const metadata = { total_count: list.length };
        // console.log("List received", list)
        res.json({ _metadata: metadata, records: list });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.post('/api/moment', (req, res) => {
    const newMoment = req.body;
    newMoment.date = newMoment.start + "+02:00";
    newMoment.end = newMoment.end + "+02:00";
    console.log(JSON.stringify(newMoment));

    db.collection('sentiance').updateOne({}, { $push: { "data.user.moment_history": newMoment } }).then(result => console.log(result)).catch(err => {
        console.log(err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});

app.post('/api/event', (req, res) => {
    const newEvent = req.body;
    newEvent.date = newEvent.start + "+02:00";
    newEvent.end = newEvent.end + "+02:00";
    console.log(JSON.stringify(newEvent));

    db.collection('sentiance').updateOne({}, { $push: { "data.user.event_history": newEvent } }).then(result => console.log("Added evnt")).catch(err => {
        console.log(err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/public/index.html'));
});
//# sourceMappingURL=server.js.map