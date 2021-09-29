let express = require('express')
let router = express.Router()


router.get('/', (req, res, next) => res.render('index', { title: 'CAM22', celu: req.useragent.isMobile }))
router.get('/historia', (req, res, next) => res.render('historia', { title: 'CAM22 — Historia' }))
router.get('/orga', (req, res, next) => res.render('orga', { title: 'CAM22 — Organización' }))

module.exports = router
