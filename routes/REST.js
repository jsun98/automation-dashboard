const
	express = require('express'),
	router = express.Router(),
	TC = require('../model/TestCase')

// Endpoint for CRUD operations on all BPG, BP, and TestCase
router.route('/BPG')
	.get((req, res, next) => {
		TC.aggregate([
			{ $match: { env: req.session.env } },
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

// Endpoint for CRUD operations on Single BPGs
router.route('/BPGByName/:name')
	.get((req, res, next) => {
		const BPGName = req.params.name
		TC.aggregate([
			{
				$match: {
					env: req.session.env,
					BPG: BPGName,
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


router.route('/BPByName/:name')
	.get((req, res, next) => {
		const BPName = req.params.name
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

router.route('/TCByName/:name')
	.get((req, res, next) => {
		TC.find({
			name: req.params.name,
			env: req.session.env,
		}, 'last_run_date status screenshot error job',
		{ sort: { last_run_date: -1 } })
			.limit(25)
			.then(testCases => {
				res.status(200).send(testCases)
			})
			.catch(err => {
				next(err)
			})
	})

// post: hostname:port/db/TC/
router.route('/TC')
	.post((req, res, next) => {
		if (!req.body.screenshot.includes('http'))
			req.body.screenshot = 'http://' + req.body.screenshot
		if (!req.body.job.includes('http'))
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

router.route('/userComment/:id')
	.get((req, res, next) => {
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
	.put((req, res, next) => {
		if (!req.body.author || !req.body.text) return res.status(400).end()
		TC.findByIdAndUpdate(req.params.id, { $push: { userComment: req.body } })
			.then(testCase => {
				res.status(200).send()
			})
			.catch(err => {
				next(err)
			})
	})

router.route('/autoComment/:id')
	.get((req, res, next) => {
		TC.findById(req.params.id, 'autoComment')
			.then(testCase => {
				if (!testCase) return res.status(404).send()
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
				res.status(200).send()
			})
			.catch(err => {
				next(err)
			})
	})

router.route('/TC/:id')
	.get((req, res, next) => {
		TC.findById(req.params.id)
			.then(testCase => {
				if (!testCase) return res.status(404).send()
				res.status(200).send(testCase)
			})
			.catch(err => {
				next(err)
			})
	})
	.put((req, res, next) => {
		TC.findByIdAndUpdate(req.params.id, res.body)
			.then(testCase => {
				if (!testCase) return res.status(404).send()
				res.status(200).send(testCase)
			})
			.catch(err => {
				next(err)
			})
	})
	.delete((req, res, next) => {
		TC.findByIdAndRemove(req.params.id)
			.then(tc => {
				if (!tc) return res.status(404).send()
				res.status(200).send(tc)
			})
			.catch(err => {
				next(err)
			})
	})


module.exports = router
