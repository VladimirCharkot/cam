const express = require("express")
const router = express.Router()

const fs = require('fs/promises')
const md = require('markdown-it')()

const _ = require("lodash")

const redis = require("./redisclient")
const { fecha, hora } = require('./middle')


router.get("/design", async (req, res) => {
  let md_cam22 = await fs.readFile(`public/md/es/cam22.md`, 'utf8')
  let md_escuelita = await fs.readFile(`public/md/es/la_escuelita.md`, 'utf8')
  let md_miramar = await fs.readFile(`public/md/es/miramar.md`, 'utf8')

  res.render('design', {
    titulo: 'Convención Argentina de Malabares',
    lang: 'es',
    celu: req.useragent.isMobile,
    articulos: [
      {id: 'cam22', contenido: md.render(md_cam22)},
      {id: 'escuelita', contenido: md.render(md_escuelita)},
      {id: 'miramar', contenido: md.render(md_miramar)}
    ]}
  )
})


router.get("/status", async (req, res) => {
  // "goaccess /var/log/nginx/access.log -o public/reporte.html --log-format=COMBINED"

  let hoy = fecha()

  let v = await redis.get('visitas')
  res.render('visitas', {titulo: "Visitas al sitio"})
})


let objetificar = (linea) => {
  let [t, ip, path] = linea.split('|')
  return {t, ip, path}
}

router.get("/hora", async (req, res) => {
  let t = Date.now()

  let hoy = await redis.lrange(`cam|${fecha()}`, 0, -1)
  let ayer = await redis.lrange(`cam|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar))

  let dos_horas_antes = t - 1000 * 60 * 60 * 2
  let ultimas_dos_horas = entradas.filter(e => e.t > dos_horas_antes)

  res.json(ultimas_dos_horas)
})

router.get("/dia", async (req, res) => {
  let hoy = await redis.lrange(`cam|${fecha()}`, 0, -1)
  let ayer = await redis.lrange(`cam|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar).filter(e => e.t > Date.now() - 24 * 60 * 60 * 1000))

  res.json(entradas)
})

router.get("/semana", async (req, res) => {
  let fechas = _.range(7)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await redis.lrange(`cam|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
})

router.get("/mes", async (req, res) => {
  let fechas = _.range(30)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await redis.lrange(`cam|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
})

// router.get("/semestre", async (req, res) => {
//
// })

module.exports = router
