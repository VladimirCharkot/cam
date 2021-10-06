let express = require('express')
let _ = require('lodash')
let router = express.Router()


router.get('/', (req, res, next) => res.render('index', {
  title: 'CAM22', celu: req.useragent.isMobile
}))
router.get('/historia', async (req, res, next) => res.render('historia', {
  title: 'CAM22 — Historia',
  galeria: _.chunk(_.range(72), 72/3)
}))
router.get('/orga', (req, res, next) => res.render('orga', {
  title: 'CAM22 — Organización'
}))


router.get('/en/', (req, res, next) => res.render('en/index', {
  title: 'CAM22', celu: req.useragent.isMobile,
  lang: 'en'
}))
router.get('/en/history', async (req, res, next) => res.render('en/history', {
  title: 'CAM22 — History',
  galeria: _.chunk(_.range(72), 72/3),
  lang: 'en'
}))
router.get('/en/orga', (req, res, next) => res.render('en/orga', {
  title: 'Organization',
  lang: 'en'
}))


router.get('/fr/', (req, res, next) => res.render('fr/index', {
  title: 'CAM22', celu: req.useragent.isMobile,
  lang: 'fr'
}))
router.get('/fr/histoire', async (req, res, next) => res.render('fr/histoire', {
  title: 'CAM22 — Histoire',
  galeria: _.chunk(_.range(72), 72/3),
  lang: 'fr'
}))
router.get('/fr/orga', (req, res, next) => res.render('fr/orga', {
  title: 'CAM22 - Organisation',
  lang: 'fr'
}))

module.exports = router
