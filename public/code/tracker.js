// Dinge vom Server lesen

fetchData()
async function fetchData() {

  // Fetch benutzen um data von der API zu kriegen
  const response = await fetch('/api')
  const data = await response.json()

  console.log(data)

  // Template generieren für data (Wir werden mehrere Einträge "entry" kriegen...Somit interieren)
  data.forEach( entry => {
    const container = document.createElement('div')

    // Template string ``
    container.innerHTML = `
    <div>${entry.mood}</div>
    <div>${entry.aqi}</div>
    
    `
    document.querySelector('section').append(container)
  });
}