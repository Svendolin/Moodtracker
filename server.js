const express = require('express')
const Datastore = require ('nedb') // $ npm i nedb sowie 
// const fetch = require('node-fetch') // $ npm i node-fetch

// Start Express

const app = express()

// Port definieren (Wirmüssen es druch const port dynamisch machen, wenn wir es z.B mit Horoku hochladen möchten)
const port = 3000

app.listen(port, () => {
  console.log(`App is listening at: http://localhost:${port}`)
})

// "public" als Public Ordner definieren (darin wird als erste Instanz index.html geladen, um es im Browser anzeigen zu lassen)
app.use(express.static('public')) // so haben wir einen Server, der statische Dateien anzeigt