var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var cors = require('cors');



var app = express();


app.use(bodyParser.json());
app.use(cors());



var db = mongojs('birds', ['sightings']);
db.on('error', function(err) {
	console.log('DB not connected :', err)
})
db.on('ready', function() {
	console.log('Connected to db at')
})


app.get('/', function(req, res) {
	res.send('hello');
})


app.post('/api/sighting', function(req, res) {
   db.sightings.save(req.body, function(err, sighting) {

   	if (!err)  {
   		console.log(sighting);
   		return res.status(200).json(sighting);
   	} else {
   		return res.status(500).json(err);
   	} 
   });
});

app.get('/api/sighting', function(req, res) {
	console.log(req.query);
	var query = {}
	if(req.query.name) query.name = req.query.name;
	if(req.query.location) query.location = req.query.location;
	if(req.query.id) query._id = mongo.js.ObjectId(req.query.id);
	db.sightings.find(query, function(err, sightings) {
		if(!err) {
		 if (sightings[0]) return res.status(200).json(sightings);
		 else return res.status(200).send('No Results');
		} else {
			res.send(500).json(err);
		}
	})

})

app.put('/api/sighting', function(req, res) {
	if(!req.query,id) res.status(400).send('No UID Sent');

	db.sightings.findAndModify({
		query: { _id: mongojs.ObjectId(req.query) },
		update: { $set: { location: req.query.location} },
		new: true
	}, function(err, updateDoc) {
		if(!err) res.status(200).json(updateDoc)
	})
}) // ends put

app.delete('/api/sighting', function(req, res) { 
	db.sightings.remove({
		_id: mongojs.ObjectId(req.query.id)
	}, function(err, remove) {
		if(!err && removed.n > 0) {
			res.status(200).json(removed)
		} else {
			return res.status(500).send(err)
		}
	})
})

app.listen(9000);

