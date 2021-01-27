const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')
// deploying middlewares (cors, json-parseri): 
app.use(cors())
app.use(express.json())
// express' middleware static, in order to show static content eg. index.html
app.use(express.static('build'))
// otetaan lokitukseen morgan-middleware käyttöön 'tiny'-formatissa
app.use(morgan('tiny'))

// Routes below. Get-operation, fetches all documents.
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// info-route, shows number of documents, uses model.count -function
app.get('/api/info', (request, response) => {
  Person.count({}, function (err, count) {
    response.send(
      `<div>
    <p>Phonebook has info for ${count} people  </p> 
    <p>${Date(Date.now).toString()}</p>
    </div>`
    )
  })
})
// Find by ID -route, next-function is for error handling
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
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

// adds a person 
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// 3.17 number update
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


// middleware for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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