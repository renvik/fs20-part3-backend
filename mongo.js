const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@cluster0.fbtrl.mongodb.net/fs-phonebook?retryWrites=true&w=true`
//  annettu osoite (pl url): `mongodb+srv://fullstack:${password}@cluster0-fbtrl.mongodb.net/test?retryWrites=true`
// mongossa näin: mongodb+srv://fullstack:<password>@cluster0.fbtrl.mongodb.net/<dbname>?retryWrites=true&w=majority
//vaihtoehto: `mongodb+srv://puhelinluettelo:${password}@puhelinluettelo-me0oy.mongodb.net/test?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})