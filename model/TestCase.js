'use strict'
const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	TestCaseSchema = new Schema({
		name: {
			type: String,
			required: true,
			lowercase: true,
			set: name => name.toUpperCase(),
		},
		created_date: {
			type: Date,
			default: Date.now,
			required: true,
		},
		last_run_date: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: [ 'pass', 'fail', 'skip' ],
			required: true,
			lowercase: true,
			set: name => name.toUpperCase(),
		},
		env: {
			type: String,
			enum: [ 'TST', 'SIT2', 'OAT' ],
			uppercase: true,
			required: true,
			default: 'SIT2',
			set: name => name.toUpperCase(),
		},
		BP: {
			type: String,
			required: true,
			lowercase: true,
			set: name => name.toUpperCase(),
			/* validate: {
				validator (v) {
					return /^bp[0-9]+(?:_[a-z0-9]+)+$/.test(v) && v.length > 5 && v.length <= 255
				},
				message: '{VALUE} does not follow the correct BP name convention or is of invalid length!'
				+ ' The correct format is of RegExp (^bp[0-9]+(?:_[a-zA-Z0-9]+)+$). Example: bp011_divestment_test.'
				+ ' The acceptable length is between 5 and 255 characters.',
			}, */
		},
		BPG: {
			type: String,
			required: true,
			lowercase: true,
			set: name => name.toUpperCase(),
			enum: {
				message: '{VALUE} is not one of the accepted BPG names, which should be one of bpg1, bpg2, bpg3, bpg4, bpg5, bpg6',
				values: [ 'bpg1',
					'bpg2',
					'bpg3',
					'bpg4',
					'bpg5',
					'bpg6' ],
			},
		},
		userComment: [ {
			author: String,
			text: String,
			time: {
				type: Date,
				default: Date(),
			},
		} ],
		autoComment: [ {
			author: String,
			text: String,
			time: {
				type: Date,
				default: Date(),
			},
		} ],
		job: {
			type: String,
			required: true,
		},
		error: String,
		screenshot: String,
	})

/* TestCaseSchema.pre('save', function (next) {
	this.constructor.findOne({
		name: this.name,
		BP: { $ne: this.BP },
	}).exec()
		.then(testCase => {
			if (testCase)
				return next(new Error('test case "' + this.name + '" already exists in BPG "' + testCase.BPG + '" and so cannot be added to BPG "' + this.BPG + '"'))
			return 	this.constructor.findOne({
				BP: this.BP,
				BPG: { $ne: this.BPG },
			}).exec()
		})
		.then(testCase => {
			if (!testCase) next()
			else next(new Error('Business process "' + this.BP + '" already exists in BPG "' + testCase.BPG + '" and so cannot be a part of BPG "' + this.BPG + '"'))
		})
		.catch(err => {
			next(err)
		})

}) */

module.exports = mongoose.model('TC', TestCaseSchema)
