// ref: https://fullstackopen.com/en/part3/saving_data_to_mongo_db
// const Note = require("./models/note");
require('dotenv').config() // Loads .env file contents into process.env by default

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
// const password = process.argv[2]; // command: node mongo.js yourpassword

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI // MONGODB_URI="mongodb+srv://fullstack:password@db.gwcmebp.mongodb.net/?retryWrites=true&w=majority&appName=db"
console.log('connecting to', url)
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Person = mongoose.model('Person', personSchema) // name of the collection is 'notes' (from 'Note' model)
// In the Note model definition, the first "Note" parameter is the singular name of the model.
// The name of the collection will be the lowercase plural notes, because the Mongoose convention
// is to automatically name collections as the plural (e.g. notes)
// when the schema refers to them in the singular (e.g. Note).

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((each) => {
      console.log(`${each.name} ${each.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid queries, either have 3 or 5 arguments')
}
