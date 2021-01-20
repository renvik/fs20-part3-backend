// needed deployments: git + github + heroku
// in progress: 3.13
const mongoose = require('mongoose')
// implements uniqueValidator
const uniqueValidator = require('mongoose-unique-validator')

if (process.argv.length < 3) {
  console.log('please give a password as an argument')
  process.exit(1)
}
// first available argument is [2] because 0 and 1 are taken by node and file name etc
const passwd = process.argv[2]

const url = `mongodb+srv://fullstack:${passwd}@cluster0.fbtrl.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// schema ie. person object's attributes
// requires unique name and number
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { String, required: true, unique: true }
})
// applies uniquevalidator-plugin to personSchema
personSchema.plugin(uniqueValidator)
// defining model: mongoose stores person objects to collection Person (collection name is persons)
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  // a constructor (aka model) that creates person objects:
  // param numbers are in square brackets[]
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  // save-method to save the person object in database
//   kommentoitu 6.1.
    person.save().then(() => {
    console.log('a new person saved!')
    // close database connection:
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('names on the phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}



