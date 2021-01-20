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
// Routes below. Get-operation works.
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// info-route, does not work
app.get('/info', (request, response) => {
  Person.count({}, function (err, count) {
    response.send(
      `<div>
    <p>Phonebook has info for ${count} people  </p> 
    <p>${Date(Date.now).toString()}</p>
    </div>`
    )
  })
})
// Find by ID, next-function is for error handling
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
        // jos haettua id:tä ei löydy niin palautetaan status 404
      } else {
        response.status(404).end()
      }
    })
    // jos metodin palauttama promise päätyy rejected -tilaan niin palautetaan status 500 ja tulostetaan konsoliin tieto virheestä
    .catch(error => next(error))
})

//delete by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// henkilön lisääminen (tuplat ja virheenkäsittely kommentoitu ulos!)
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // creates a person
  const person = new Person({
   // id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number
  })

  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

// 3.17 number update, ensin pitäisi tutkia onko saman nimistä henkilöä kokoelmassa ja jos löytyy niin päivittää puhelinnumero
// käytännössä siis find by name ja sitten put
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person)
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})


// middleware, jolla saadaan virheilmoitus routejen käsittelemättömistä virhetilanteista json-muodossa
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// otetaan ko. middleware käyttöön
app.use(unknownEndpoint)

// middleware for error handle
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})