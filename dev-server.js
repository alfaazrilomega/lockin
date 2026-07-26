const { createServer } = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const app = next({ dev: true, dir: __dirname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> LockIn PM2 Dev Server Ready on http://localhost:${port}`)
  })
}).catch((err) => {
  console.error('Server preparation error:', err)
})
