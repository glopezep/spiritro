var express = require('express')

var app = express()
var port = 3000 || process.env.PORT

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.json({ guillermo: 'Guillermo Lopez' })
})

app.listen(port, () => console.log(`Server listening on ${port}`))
