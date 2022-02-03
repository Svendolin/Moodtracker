const express = require('express')
const Datastore = require('nedb') // $ npm i nedb sowie (Datastore Variable wird unser Datenbankspeicher)
// const axios = require('axios') // $ npm i axios > $ npm uninstall axios
const fetch = require('node-fetch') // $ npm i node-fetch = version 3 => BAD at the moment (require geht nicht) //  LÖSUNG: $ npm i node-fetch@2 = Version 2

require('dotenv').config()
// Start Express

const app = express()

// Port definieren (Wirmüssen es druch const port dynamisch machen, wenn wir es z.B mit Horoku hochladen möchten)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is listening at: http://localhost:${port}`)
})

// Server zum laufen kriegen:
// "public" als Public Ordner definieren (darin wird als erste Instanz index.html geladen, um es im Browser anzeigen zu lassen)
app.use(express.static('public')) // so haben wir einen Server, der statische Dateien anzeigt
app.use(express.json({
  limit: '300mb' // JSON BENUTZEN? DATEN LIMITIEREN, WICHTIG! (Abstürze vermeiden)
}))

// Datenbank definieren und laden:
const database = new Datastore('database/database.db') // new = neue Instanz zu erstellen (Datenbank) innerhalb unseres database Ordners
database.loadDatabase() // Datenbank laden


// Verwantwortlich für WETTER, API DATA zu kriegen und diese an den Kunden zu senden
app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',') //split wandelt string '' in eine Array [] um (Sehen wir im Serverterminal)
  // console.log(latlon)

  // API Keys
  const weatherApiKey = process.env.API_KEY_WEATHER
  const aqiApiKey = process.env.API_KEY_AQI

  // API Requests

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latlon[0]}&lon=${latlon[1]}&appid=${weatherApiKey}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherData = await weatherResponse.json()

  //Requerst für AQI
  const aqiUrl = `https://api.waqi.info/feed/geo:${latlon[0]};${latlon[1]}/?token=${aqiApiKey}`
  const aqiResponse = await fetch(aqiUrl)
  const aqiData = await aqiResponse.json()
  const data = {
    weather: weatherData,
    aqi: aqiData // air quality index = Zweite API
  }

  res.json(data)

})

app.post('/api', (req, res) => {
  const data = req.body
  //console.log(data)
  data.timestamp = Date.now()

  database.insert(data)
  data.success = true
  res.json(data)
})

// Verwantwortlich für DATABASE API (Post / Insert data in die Database, welche vorher erstellt und geladen wurde)
app.get('/api', (req, res) => {
  // Die Information von der Database zum Client senden

  // Callback funktion:
  database.find({}, (err, data) => {
    if (err) {
      console.error(err)
      res.end()
    } else {
      console.log('Server is sending data to the client')
      res.json(data)
    }
  })
})