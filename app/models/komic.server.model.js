'use strict';

/**
 * Module dependencies.
 */


var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**********************

Rating Schema
**********************/	
var RatingSchema = new Schema({
	rating: {
		type: String,
		default: '',
		required: 'Please select a Rating'
	},
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rating', RatingSchema);


/**********************

Review Schema
**********************/	
var ReviewSchema = new Schema({
	review: {
		type: String,
		default: '',
		trim: true,
		required: 'Review field cannot be blank'
	},
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	rating: [RatingSchema]
});

mongoose.model('Review', ReviewSchema);

/**
 * Komic Schema
 */
var KomicSchema = new Schema({
	genres:{
		type: String,
		default:'',
		required: 'please fill in the genre'
	},
	description: {
		type: String,
		default: '',
		trim: true,
		required: 'Description cannot be blank'
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Please fill Komic title'
	},
	images: {
		type: Array,
		default: []
		//required: 'Select a file to upload'
	},
	reviews: [ReviewSchema],
	ratings: [RatingSchema],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Komic', KomicSchema);