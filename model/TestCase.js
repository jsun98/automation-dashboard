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
			enum: [ 'TST', 'SIT2', 'OAT', 'OAT2', 'SIT3', 'CSIT' ],
			uppercase: true,
			required: true,
			default: 'SIT3',
			set: name => name.toUpperCase(),
		},
		BP: {
			type: String,
			required: true,
			lowercase: false,
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
			lowercase: false,
			set: name => name.toUpperCase(),
			enum: {
				message: '{VALUE} is not one of the accepted BPG names, which should be one of BPG1, BPG2, BPG3, BPG4, BPG5, BPG6, SMOKETEST',
				values: [ 'BPG1',
					'BPG2',
					'BPG3',
					'BPG4',
					'BPG5',
					'BPG6',
                    'SMOKETEST'],
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
    Comments: [ {
        author: String,
        text: String,
        time: {
            type: Date,
            default: Date(),
        },
    } ],
		bugId: String,
		job: String,
		error: String,
		screenshot: String,
	})

TestCaseSchema.pre('save', function (next) {
	this.constructor.findOne({
		name: this.name,
		BP: { $ne: this.BP },
	}).exec()
		.then(testCase => {
			if (testCase)
				return next(new Error('Test case "' + this.name + '" already exists in BP "' + testCase.BP + '" and so cannot be saved to BP "' + this.BP + '"'))
			return 	this.constructor.findOne({
				name: this.name,
				BPG: { $ne: this.BPG },
			}).exec()
		})
		.then(testCase => {
			if (testCase)
				return next(new Error('Test case "' + this.name + '" already exists in BPG "' + testCase.BPG + '" and so cannot be added to BPG "' + this.BPG + '"'))
/*			return this.constructor.findOne({
				BP: this.BP,
				BPG: { $ne: this.BPG },
			}).exec()*/
			next()
		})
/*		.then(testCase => {
			if (testCase)
				return next(new Error('Business process "' + this.BP + '" already exists in BPG "' + testCase.BPG + '" and so cannot be a part of BPG "' + this.BPG + '"'))
			next()
		})*/
		.catch(err => {
			next(err)
		})

})

module.exports = mongoose.model('TC', TestCaseSchema)
