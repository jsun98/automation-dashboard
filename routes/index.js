const express = require('express'),
	router = express.Router()

/* GET home page. */

router.get('/', (req, res, next) => {
	res.render('directory')
})

router.get('/BPG', (req, res, next) => {
	if (!req.session.env) res.redirect('/')
	res.render('index', { env: req.session.env })
})

router.get('/env/:env', (req, res, next) => {
	req.params.env = req.params.env.toUpperCase()
	if ([ 'TST', 'SIT2', 'OAT' ].indexOf(req.params.env) === -1)
		return next(new Error('Env Not Found'))
	req.session.env = req.params.env
	res.redirect('/BPG')
})

router.get('*', (req, res) => {
	res.redirect('/')
})

module.exports = router
