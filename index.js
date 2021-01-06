
// Status: 3.12 kesken, jäin index.js routejen määrittelyyn, seur. ks. URI ja ID:n luonti
// otetaan person-moduuli käyttöön -> Person-muuttuja saa arvokseen saman olion, jonka moduuli määrittelee
const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')
// otetaan middlewaret käyttöön (cors, json-parseri): 
app.use(cors())
app.use(express.json())
// expressin middleware static, jota tarvitaan staattisen sisällön näyttämiseen kuten index.html 
app.use(express.static('build'))
// otetaan lokitukseen morgan-middleware käyttöön 'tiny'-formatissa
app.use(morgan('tiny'))

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
    name: "Separate Backend",
    number: "39-23-64223122"
  }
]
// Routes below. tehtävä 3.1: valmis
app.get('/api/persons', (request, response) => {
  response.send(persons)
})

// tehtävä 3.2: valmis
app.get('/info', (request, response) => {
    let today = new Date()
    response.send(
      `<p>Phonebook has info for ${persons.length} people  </p>` + today)
  })

// id:llä hakeminen, virheenkäsittely kommentoitu ulos
app.get('/api/persons/:id', (request, response) => {
  Persons.findById(request.params.id).then(note => {
    response.json(person)
  })
})
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }

// tehtävä 3.4: poistaminen tietyllä id:llä, valmis
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// henkilön lisääminen (tuplat ja virheenkäsittely kommentoitu ulos!)
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (body.name || body.number === undefined) {
    return response.status(400).json({ error: 'is this showing here?'})
  }d
  //const existingDouble = persons.find(person => person.name === body.name)  
  
 
    // if (!body.name || !body.number) {
    //   return response.status(400).json({
    //     error: 'name or number missing'
    //   })}

    // if (existingDouble) {
    //   return response.status(400).json({
    //     error: 'name already exists'
    // })}

// luodaan henkilö jos henkilön tiedot pyynnön mukana
  const person = new Person( {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
// middleware, jolla saadaan virheilmoitus routejen käsittelemättömistä virhetilanteista json-muodossa
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}
// otetaan ko. middleware käyttöön
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})