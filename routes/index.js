const express = require('express'),
	router = express.Router()

// home page, let's user choose environemnt
router.get('/', (req, res, next) => {
	res.render('directory')
})

// BPG list page to initialize our app
// note: from here on, the app uses frontend routing
router.get('/BPG', (req, res, next) => {
	if (!req.session.env) res.redirect('/')
	res.render('index', { env: req.session.env })
})

// save env into session
router.get('/env/:env', (req, res, next) => {
	req.params.env = req.params.env.toUpperCase()
	if ([ 'TST', 'SIT2', 'OAT', 'CSIT','SIT3' ].indexOf(req.params.env) === -1)
		return next(new Error('Env Not Found'))
	req.session.env = req.params.env
	res.redirect('/BPG')
})

// if user lands on any other route, redirect back to home page
router.get('*', (req, res) => {
	res.redirect('/')
})

module.exports = router
