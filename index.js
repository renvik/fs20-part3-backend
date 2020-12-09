
// Puhelinluettelon BACK-END
// VAIHE: tehtävä 3.7: valmis
// importoidaan noden web server -moduuli:
const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
// otetaan middlewaret käyttöön (cors, json-parseri) 
app.use(cors())
app.use(express.json())

// otetaan lokitukseen morgan-middleware käyttöön 'tiny'-formatissa
app.use(morgan('tiny'))
app.get('/', function (req, res) {
  response.send('hello world!')
})

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-64223122"
  }
]
// tehtävä 3.1: valmis
app.get('/api/persons', (request, response) => {
  response.send(persons)
})

// tehtävä 3.2: valmis
app.get('/info', (request, response) => {
    let today = new Date()
    response.send(
      `<p>Phonebook has info for ${persons.length} people  </p>` + today)
  })

// tehtävä 3.3: id:llä hakeminen, valmis
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
// tehtävä 3.4: poistaminen tietyllä id:llä, valmis
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// 3.5 ja 3.6 alkaa: henkilön lisääminen ja virheenkäsittely (puuttuu nimi tai numero tai nimi on jo taulukossa)
app.post('/api/persons', (request, response) => {
  const body = request.body
  const existingDouble = persons.find(person => person.name === body.name)  
  
 
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'name or number missing'
      })}

    if (existingDouble) {
      return response.status(400).json({
        error: 'name already exists'
    })}

// 3.5 ja 3.6 jatkuu: luodaan henkilö jos henkilön tiedot pyynnön mukana ->
  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

// middleware, jolla saadaan virheilmoitus routejen käsittelemättömistä virhetilanteista json-muodossa
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}
// otetaan middleware käyttöön
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})