// Wir nutzen P5JS Funktionen (clientseitig hier):

function setup() {

  // P5JS Canvas deaktivieren:
  noCanvas()
  // Video starten:
  const video = createCapture() // Kameraelement erstellen
  video.parent('main-container')
  video.size(320, 240) // Grösse des Videoausschnitts


  // Werte hier überschreiben, sodass sie überall zugänglich sind:
  let lat, lon, city, temperature, description, aqi

  // Testen ob Geolocation verfügbar ist:
  if ('geolocation' in navigator) {
    // console.log(navigator)

    // Dies wird eine art "getfetchrequest" werden...
    navigator.geolocation.getCurrentPosition(async position => {

      // try-catch-method: "Versuche es mit"..."Ansonsten wird der Error eingefangen"
      try {
        // console.log(position)
        // Location des Nutzers anzeigen
        lat = position.coords.latitude
        lon = position.coords.longitude

        // URL für den Weather Endpoint vorbereiten
        const apiURL = `weather/${lat},${lon}`

        // Antwort des Servers kriegen mit AJAX (Asynchron, somit brauchen wir das await und bei 20 das async dazu zur funktion)
        const response = await fetch(apiURL)
        const json = await response.json()

        console.log(json)
        // Siehe Verlauf in der Console 
        city = json.weather.name
        temperature = json.weather.main.temp
        description = json.weather.weather[0].description
        aqi = json.aqi.data.aqi

        // Template String (Im HTML gehts einfacher zum konstruieren)
        const template = `
        <div class="more_info">
          <div>${temperature}</div>
          <div>${description}</div>
          <hr>
          <div>${city}</div>
         <div><span>Lat: ${lat}</span><span>Lon: ${lon}</span></div>
         <div>AQI: ${aqi}</div>
        </div>
        `

        const weatherDiv = document.createElement('div');
        weatherDiv.innerHTML = template
        document.querySelector('main').append(weatherDiv)


      } catch (error) {
        console.error(error)
      }

    })
  } else {
    console.error('Geolocation is not supported')
  }

  // Was passiert wenn der Nutzer "SEND" klickt (clickevent somit), nachdem er seine Laune* eingegeben hat:
  document.querySelector('form button').addEventListener('click', async e => { // Event muss async sein, um await zu benutzen
    e.preventDefault()

    // Messages resetten (Wenn man mehrmals klicken würde)
    // SPECIAL: SHORTHAND IF-STATEMENT
    if(document.querySelector('.success-message')) (document.querySelector('.success-message')).remove()
    if(document.querySelector('.error-message')) (document.querySelector('.error-message')).remove()
    // *Input Text lesen
    const mood = document.querySelector('form input').value   // .value = Wert in Input Feld lesen in Vanilla JS
  
    // Aktuelles Screenshot frame kriegen (Passiert eben über diesen "SEND"-Knopf)
    video.loadPixels()
    const image64 = video.canvas.toDataURL()

    // AQI noch einbauen
    const data = {
      mood,
      city,
      temperature,
      description,
      aqi,
      image64
    }
    
    // WICHTIG. WIE MACHT MAN EIN POST REQUEST? HERE WE GO:
    // Fetch POST-REQUEST (post request hier, da wir es nicht über die URL weitergeben möchten)
    // 1) Objekt definieren (Hier arbeiten wir mit Doppelpunkte : statt = in Objekten)
    const options = {
      // 2) Post um daten weiterzugeben:
      method : 'POST',
      // 3) Header definieren:
      headers: {
        'Content-Type': 'application/json'
      },
      // 4) Inhalt definieren:
      body: JSON.stringify(data) // (JS auf JSON = Stringify wandelt das um)
    }
    const response = await fetch('/api', options)
    const json = await response.json()
    
    // console.log(json)
    if (json.success) {
      const message = document.createElement('span')
      message.classList.add('success-message')
      message.innerHTML = 'Your mood has been successfully added'
      document.querySelector('form').after(message)
    } else {
      const message = document.createElement('span')
      message.classList.add('error-message')
      message.innerHTML = 'There was an error - Please try again.'
      document.querySelector('form').after(message)
    }

  })

}