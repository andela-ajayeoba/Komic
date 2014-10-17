'use strict';

/**
 * Module dependencies.
 */


var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**********************

Review Schema
**********************/	
var ReviewSchema = new Schema({
	rating: {
		type: String,
		default: ''
		//required: 'Please select a rating'
	},
	review: {
		type: String,
		default: '',
		trim: true,
		//required: 'Review field cannot be blank'
	},
	name: {
		type: String,
		default: ''
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

mongoose.model('Review', ReviewSchema);

/**
 * Komic Schema
 */
var KomicSchema = new Schema({
	genre:{
		type: String,
		default:'',
		//required: 'please fill in the genre'
	},
	description: {
		type: String,
		default: '',
		trim: true,
		//required: 'Description cannot be blank'
	},
	title: {
		type: String,
		default: '',
		trim: true,
		//required: 'Please fill Komic title'
	},
	images: {
		type: Array,
		default: ''
	},
	reviews: [ReviewSchema],
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