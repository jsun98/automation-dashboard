const
	express = require('express'),
	router = express.Router(),
	TC = require('../model/TestCase')

// fetches all BPGs, used for BPGList page
router.route('/BPG')
	.get((req, res, next) => {
		TC.aggregate([
			{ $match: { env: req.session.env } },
			{ $sort: { last_run_date: -1 } },
			{
				$group: {
					_id: '$name',
					last_run_date: { $first: '$last_run_date' },
					status: { $first: '$status' },
					BPG: { $first: '$BPG' },
				},
			},
			{
				$group: {
					_id: '$BPG',
					last_run_date: { $max: '$last_run_date' },
					pass: { $sum: { $cond: [ { $eq: [ '$status', 'pass' ] }, 1, 0 ] } },
					fail: { $sum: { $cond: [ { $eq: [ '$status', 'fail' ] }, 1, 0 ] } },
					skip: { $sum: { $cond: [ { $eq: [ '$status', 'skip' ] }, 1, 0 ] } },
				},
			}, { $sort: { last_run_date: -1 } },
		])
			.then(BPG => {
				res.status(200).send(BPG)
			})
			.catch(err => {
				next(err)
			})
	})

// fetches the details of a single BPG by name, used for BPG page
router.route('/BPGByName/:name')
	.get((req, res, next) => {
		const BPGName = req.params.name

		// we need to perform a aggregation (basically calculate the total number of pass, fail, skip, which is not directly stored in database)
		TC.aggregate([
			{
				$match: {
					env: req.session.env,
					BPG: BPGName,
				},
			},
			{ $sort: { last_run_date: -1 } },
			{
				$group: {
					_id: '$name',
					last_run_date: { $first: '$last_run_date' },
					status: { $first: '$status' },
					BP: { $first: '$BP' },
				},
			},
			{
				$group: {
					_id: '$BP',
					last_run_date: { $max: '$last_run_date' },
					pass: { $sum: { $cond: [ { $eq: [ '$status', 'pass' ] }, 1, 0 ] } },
					fail: { $sum: { $cond: [ { $eq: [ '$status', 'fail' ] }, 1, 0 ] } },
					skip: { $sum: { $cond: [ { $eq: [ '$status', 'skip' ] }, 1, 0 ] } },
				},
			}, { $sort: { last_run_date: -1 } },
		])
			.then(BP => {
				res.status(200).send(BP)
			})
			.catch(err => {
				next(err)
			})
	})

// fetches details of a single BP by name, used for BP page
router.route('/BPByName/:name')
	.get((req, res, next) => {
		const BPName = req.params.name

		// we need to perform a aggregation (basically calculate the total number of pass, fail, skip, which is not directly stored in database)
		TC.aggregate([
			{
				$match: {
					env: req.session.env,
					BP: BPName,
				},
			},
			{ $sort: { last_run_date: -1 } },
			{
				$group: {
					_id: '$name',
					last_run_date: { $first: '$last_run_date' },
					status: { $first: '$status' },
					job: { $first: '$job' },
				},
			}, { $sort: { last_run_date: -1 } },
		])
			.then(TCs => {
				if (!TCs) return res.status(400).send()
				res.status(200).send(TCs)
			})
			.catch(err => {
				next(err)
			})
	})

// fetches all details of a Testcase by name, used for TC page
router.route('/TCByName/:name')
	.get((req, res, next) => {
		TC.find({
			name: req.params.name,
			env: req.session.env,
		}, 'last_run_date status screenshot error', // this means we only select these fields to be returned
		{ sort: { last_run_date: -1 } })
			.then(testCases => {
				res.status(200).send(testCases)
			})
			.catch(err => {
				next(err)
			})
	})

// endpoint for fetching/adding new user comments
router.route('/userComment/:id')
	.get((req, res, next) => { // fetch
		TC.findById(req.params.id, 'userComment')
			.then(testCase => {
				if (!testCase) return res.status(404).send()
				testCase.userComment.sort((a, b) => {
					var keyA = new Date(a.time),
						keyB = new Date(b.time)
					if (keyA < keyB) return -1
					if (keyA > keyB) return 1
					return 0
				})
				res.status(200).send(testCase.userComment)
			})
			.catch(err => {
				next(err)
			})
	})
	.put((req, res, next) => { // add
		if (!req.body.author || !req.body.text) return res.status(400).end()
		TC.findByIdAndUpdate(req.params.id, { $push: { userComment: req.body } })
			.then(testCase => {
				if (!testCase) res.status(404).send('test case not found')
				res.status(200).send()
			})
			.catch(err => {
				next(err)
			})
	})

// same as above, but for automation comments
router.route('/autoComment/:id')
	.get((req, res, next) => {
		TC.findById(req.params.id, 'autoComment')
			.then(testCase => {
				if (!testCase) return res.status(404).send('test case not found')
				testCase.autoComment.sort((a, b) => {
					var keyA = new Date(a.time),
						keyB = new Date(b.time)
					if (keyA < keyB) return -1
					if (keyA > keyB) return 1
					return 0
				})
				res.status(200).send(testCase.autoComment)
			})
			.catch(err => {
				next(err)
			})
	})
	.put((req, res, next) => {
		if (!req.body.author || !req.body.text) return res.status(400).end()
		TC.findByIdAndUpdate(req.params.id, { $push: { autoComment: req.body } })
			.then(testCase => {
				if (!testCase) res.status(404).send('test case not found')
				res.status(200).send()
			})
			.catch(err => {
				next(err)
			})
	})

// CRUD operation on database entries by id
router.route('/TC/:id')
	.get((req, res, next) => { // fetch a testcase by id
		TC.findById(req.params.id)
			.then(testCase => {
				if (!testCase) return res.status(404).send()
				res.status(200).send(testCase)
			})
			.catch(err => {
				next(err)
			})
	})
	.put((req, res, next) => { // update a testcase by id
		if (req.body.job && !req.body.job.includes('http'))
			req.body.job = 'http://' + req.body.job
		TC.findByIdAndUpdate(req.params.id, res.body)
			.then(testCase => {
				if (!testCase) return res.status(404).send()
				res.status(200).send(testCase)
			})
			.catch(err => {
				next(err)
			})
	})
	.delete((req, res, next) => { // delete a testcase by id
		TC.findByIdAndRemove(req.params.id)
			.then(tc => {
				if (!tc) return res.status(404).send()
				res.status(200).send(tc)
			})
			.catch(err => {
				next(err)
			})
	})

// creating a new testcase, returns id
router.route('/TC')
	.post((req, res, next) => {
		// append 'http' in front of link to open a new tab when link is clicked
		if (req.body.screenshot && !req.body.screenshot.includes('http'))
			req.body.screenshot = 'http://' + req.body.screenshot
		if (req.body.job && !req.body.job.includes('http'))
			req.body.job = 'http://' + req.body.job
		const newTestCase = new TC(req.body)

		newTestCase.save()
			.then(testCase => {
				res.status(200).send(testCase._id)
			})
			.catch(err => {
				next(err)
			})
	})

router.route('/updatejenkinsjobbyname/:name')
	.put((req, res, next) => {
		if (req.body.job && !req.body.job.includes('http'))
			req.body.job = 'http://' + req.body.job
		TC.update({ name: req.params.name }, { $set: { job: req.body.job } }, { multi: true }, (err, testCases) => {
			if (err) return next(err)
			res.status(200).send(testCases)
		})
	})

router.route('/getjenkinsjobbyname/:name')
	.get((req, res, next) => {
		TC.findOne({ name: req.params.name }, (err, testCase) => {
			if (err) return next(err)
			if (!testCase) return res.status(404).send('testcase not found')
			res.status(200).send(testCase.job)
		})
	})


module.exports = router
