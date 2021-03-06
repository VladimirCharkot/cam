const express = require('express')
const md = require('markdown-it')({html: true})
const emoji = require('markdown-it-emoji');
const attrs = require('markdown-it-attrs');
const fs = require('fs/promises')
const _ = require('lodash')
const tg = require('./tg')
const router = express.Router()

md.use(emoji)
md.use(attrs)

const { logaccess, lenguaje } = require('./middle')

const redis = require("./redisclient")



router.get('/:lang/seminarios', [logaccess, async (req, res) => {
  res.render('seminarios')
}])

router.get('/:lang/talleres', [logaccess, async (req, res) => {
  res.render('talleres',{
    titulo: 'Talleres',
    lang: req.params.lang,
    celu: req.useragent.isMobile
  })
}])

router.get('/:lang/inscripciones', [logaccess, async (req, res) => {
  let titulos = {
    es: 'CAM22 — Inscripciones',
    en: 'AJC22 — Registrations',
    fr: 'CAJ22 — Inscriptions',
    pt: 'CAM22 — Inscrições',
  }

  let lang = req.params.lang
  let inscripciones = await fs.readFile(`public/md/${lang}/inscripciones.md`, 'utf8')

  res.render('inscripciones', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile,
    articulos: [
      {id: 'inscripciones', contenido: md.render(inscripciones)}
    ]
  })
}])

router.get('/:lang/postulaciones', [logaccess, async (req, res) => {
  let titulos = {
    es: 'CAM22 — Postulaciones',
    en: 'AJC22 — Applications',
    fr: 'CAJ22 — Postulation',
    pt: 'CAM22 — Postulação',
  }

  let lang = req.params.lang
  let postulaciones = await fs.readFile(`public/md/${lang}/postulaciones.md`, 'utf8')

  res.render('inscripciones', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile,
    articulos: [
      {id: 'postulaciones', contenido: md.render(postulaciones)}
    ]
  })
}])

router.get('/:lang?/galeria', [logaccess, lenguaje, async (req, res) => {
  let titulos = {
    es: 'CAM22 — Galería',
    en: 'AJC22 — Galery',
    fr: 'CAJ22 — Galery',
    pt: 'CAM22 — Galery'
  }

  let lang = req.params.lang

  res.render('galeria', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile,
    galeria: _.chunk(_.range(212), 213/3)
  })

}])

router.get('/:lang?/historia', [logaccess, lenguaje, async (req, res) => {

  let titulos = {
    es: 'CAM22 — Historia',
    en: 'AJC22 — History',
    fr: 'CAJ22 — Histoire',
    pt: 'CAM22 — História'
  }

  let lang = req.params.lang

  let md_2016 = await fs.readFile(`public/md/${lang}/2016.md`, 'utf8')
  let md_2017 = await fs.readFile(`public/md/${lang}/2017.md`, 'utf8')
  let md_2019 = await fs.readFile(`public/md/${lang}/2019.md`, 'utf8')

  res.render('historia', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile,
    textos: [md.render(md_2016), md.render(md_2017), md.render(md_2019)],
    galeria: _.chunk(_.range(72), 72/3)
  })

}])


router.get('/:lang?/orga', [logaccess, lenguaje, (req, res) => {

  let titulos = {
    es: 'CAM22 — Organización',
    en: 'AJC22 — Organization',
    fr: 'CAJ22 — Organisation',
    pt: 'CAM22 — Organização'
  }

  let lang = req.params.lang

  res.render('orga', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile
  })
}])


router.get('/:lang?/', [logaccess, lenguaje, async (req, res) => {

  let titulos = {
    es: 'Convención Argentina de Malabares',
    en: 'Argentinian Juggling Convention',
    fr: 'Convention Argentine de Jonglerie',
    pt: 'Convenção Argentina de Malabarismo'
  }

  let lang = req.params.lang

  let md_cam22 = await fs.readFile(`public/md/${lang}/cam22.md`, 'utf8')
  let md_escuelita = await fs.readFile(`public/md/${lang}/don_osvaldo.md`, 'utf8')
  let md_miramar = await fs.readFile(`public/md/${lang}/miramar.md`, 'utf8')

  res.render('index', {
    titulo: titulos[lang],
    lang: lang,
    celu: req.useragent.isMobile,
    articulos: [
      {id: 'cam22', contenido: md.render(md_cam22)},
      {id: 'escuelita', contenido: md.render(md_escuelita)},
      {id: 'miramar', contenido: md.render(md_miramar)}
    ]}
  )

}])


module.exports = router
