const express = require('express')
const md = require('markdown-it')()
const fs = require('fs/promises')
const _ = require('lodash')
const tg = require('./tg')
const router = express.Router()

const { logaccess, lenguaje, fecha, hora } = require('./middle')

const redis = require("./redisclient")






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
  let md_escuelita = await fs.readFile(`public/md/${lang}/la_escuelita.md`, 'utf8')
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
