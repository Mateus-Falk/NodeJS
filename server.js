const express = require('express')
const app = express()
const rotas = require('./rotas')

app.use(express.json())
app.use(rotas)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})