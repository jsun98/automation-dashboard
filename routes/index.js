const express = require('express'),
	router = express.Router()

/* GET home page. */

router.get('/', (req, res, next) => {
	res.render('directory', { title: 'Automation Dashboard' })
})

router.get('/:env', (req, res, next) => {
	req.params.env = req.params.env.toUpperCase()
	if ([ 'TST', 'SIT2', 'OAT' ].indexOf(req.params.env) === -1)
		next(new Error('Env Not Found'))
	req.session.env = req.params.env
	res.render('index', {
		title: 'Jenkins Dashboard',
		env: req.session.env,
	})
})

module.exports = router
