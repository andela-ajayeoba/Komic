'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	AWS = require ('aws-sdk'),
	errorHandler = require('./errors'),
	Komic = mongoose.model('Komic'),
	Review = mongoose.model('Review'),
	_ = require('lodash');


AWS.config.loadFromPath('./config.json');

//var komic = new Komic();

AWS.config.update({region: 'us-west-2'});

var s3 = new AWS.S3();

// s3.createBucket({Bucket: 'myBucket'}, function() {
// 	var data = {Bucket: 'myBucket', Key: 'myKey', Body: 'Hello!'};
// 	s3.putObject(data, function(err, data) {
// 		if (err) {
// 			console.log('Error uploading data: ', err);
// 		} else {
// 			console.log('Successfully uploaded data to myBucket/myKey');
// 		}
// 	});
// });
// var bucketParams = {
// 	Bucket: 'comicbucket'
// };

// s3.createBucket(bucketParams, function() {

// });

// var s3Bucket = new AWS.S3({ params: bucketParams });

// var data = {
// 	Bucket: 'komicbucket',
// 	Key: 'myBucket',
// 	Body: 'Hello'
// };

// s3.putObject(data, function(err, data) {
// 	if (err) {
// 		console.log('Error uploading data: ', err);
// 	} else {
// 		console.log('Successfully uploaded the image');
// 	}
// });


// var params = {
// 	Bucket: 'komicbucket'
// };

// s3.listObjects(params, function(err, data) {
// 	var bucketContents = data.Contents;
// 	for(var i = 0; i < bucketContents.length; i++) {
// 		var urlParams = {Bucket: 'komicbucket', Key: bucketContents[i].Key};
// 		s3.getSignedUrl('getObject', urlParams, function(err, url) {
// 			console.log('The url of the image is', url);
// 		});
// 	}
// });



/**
 * Create a Komic
 */
exports.create = function(req, res) {
	var komic = new Komic(req.body);
	// var data = {
	// 	Bucket: 'komicbucket',
	// 	Key: komic.images.type,
	// 	Body: komic.images
	// };
	// s3.putObject(data, function(err, data) {
	// 	if (err) {
	// 		console.log('Error uploading data: ', err);
	// 	} else {
	// 		console.log('Successfully uploaded the image');
	// 	}
	// });
	console.log(komic);
	komic.user = req.user;

	komic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komic);
		}
	});
};



/**
 * Create review of Komic
 */
exports.create_rev = function(req, res) {
	var komic = req.komic;
	var review = req.body;
	review.user = req.user;
	review.user.displayName = req.user.displayName;
	komic.reviews.push(review);

	komic.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komic);
		}
	});
};


/**
 * Delete review of Komic
 */
exports.delete_rev = function(req, res) {
	var komic = req.komic;
	var review = req.review;

	review.remove();

	komic.save(function(err) {
		if(err) {
			return res.send(400, {
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komic);
		}
	});
};


/**
 * Show the current Komic
 */
exports.read = function(req, res) {
	res.jsonp(req.komic);
};

exports.readReview = function(req, res) {
	res.jsonp(req.review);
};

/**
 * Update a Komic
 */
exports.update = function(req, res) {
	var komic = req.komic ;

	komic = _.extend(komic , req.body);

	komic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komic);
		}
	});
};

/**
 * Update review of Komic
 */
 exports.update_rev = function (req, res) {
 	var komic = req.komic;
 	var review = req.review;
 	review = _.extend(review, req.body);

 	komic.save(function(err) {
 		if (err) {
 			return res.send(400, {
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(komic);
 		}
 	});
 };

/**
 * Delete an Komic
 */
exports.delete = function(req, res) {
	var komic = req.komic ;

	komic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komic);
		}
	});
};

/**
 * List of Komics
 */
exports.list = function(req, res) { Komic.find().sort('-created').populate('user', 'displayName').exec(function(err, komics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(komics);
		}
	});
};

// exports.lisReview = function(req, res) { Review.find().sort('-created').exec(function(err, reviews) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.jsonp(reviews);
// 		}
// 	});
// };

exports.listReviews = function(req, res) { 
	res.jsonp(req.komic.reviews);
};

/**
 * Komic middleware
 */
exports.komicByID = function(req, res, next, id) { Komic.findById(id).populate('user', 'displayName').populate('komic_user', 'displayName').exec(function(err, komic) {
		if (err) return next(err);
		if (! komic) return next(new Error('Failed to load Komic ' + id));
		req.komic = komic ;
		next();
	});
};

/**
 * Komic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.komic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Review middleware
 */
exports.reviewByID = function(req, res, next, id) { 
		var komic = req.komic;
		req.review = komic.reviews.id(id);
		next();
};

/**
 * Review authorization middleware
 */
exports.hasAuthorization_rev = function(req, res, next) {
	if(req.review.user.toString() !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
