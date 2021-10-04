let express = require('express')
let _ = require('lodash')
let router = express.Router()


router.get('/', (req, res, next) => res.render('index', { title: 'CAM22', celu: req.useragent.isMobile }))
router.get('/historia', async (req, res, next) => res.render('historia', { title: 'CAM22 — Historia', galeria: _.chunk(_.range(72), 72/3)}))
router.get('/orga', (req, res, next) => res.render('orga', { title: 'CAM22 — Organización' }))

module.exports = router
