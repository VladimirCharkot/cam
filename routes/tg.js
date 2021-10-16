const express = require('express')
let router = express.Router()

const { logaccess, lenguaje, fecha, hora } = require('./middle')

// Redis
const redis = require("./redisclient")

// Telegram
const fs = require('fs')
const token = fs.readFileSync('.tg_token', 'utf8')

const id_grupo_chat = -694519257
const { Telegraf } = require('telegraf')
const bot = new Telegraf(token)
const debounce = 30


router.get('/:lang?/contacto', [logaccess, lenguaje, async (req, res) => {
  let titulos = {
    es: 'CAM22 — Contacto',
    en: 'AJC22 — Contact us',
    fr: 'CAJ22 — Nous contacter',
    pt: 'CAM22 — Contate-nos'
  }

  res.render('contacto', {
    titulo: titulos[req.params.lang],
    lang: req.params.lang,
    celu: req.useragent.isMobile,
  })
}])



router.post('/contacto', async (req, res) => {

  let msg = req.body
  console.log(msg)

  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(`Cliente ${ip} intentando contacto...`)

  if(await redis.exists(`tg_cache_${ip}`)) return res.json({ok: false, reason: `Aguantá un toque ${ip}`})

  await redis.set(`tg_cache_${ip}`,  1, 'EX', debounce)

  bot.telegram.sendMessage(id_grupo_chat, `_${msg.nombre}_ pidió que le contacten por _${msg.medio}_ a _${msg.direccion}_\n\nEscribió:\n${msg.texto}`, { parse_mode: 'Markdown' })

  res.json({ok: true})

})

bot.start((ctx) => {
  console.log(`${ctx.update.message.from} (cid ${ctx.update.message.chat}) dice: ${ctx.startPayload}`)
  ctx.reply('Om nom nom gracias')
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


console.info('Bot listo!')

module.exports = router
