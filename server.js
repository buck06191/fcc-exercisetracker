const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

/* Needs to include the following things:
  - User supplies a POST with unique username. If unique, provide the _id back to the user. User is saved to MongoDB.
  - The _id from previous step can be used with information to log exercise via POST. This information is saved to MongoDB.
  - User can GET all records for their username, with optional from, to and limit.

  Log requirements
  ----------------

  - Each user has an _id and username on creation. 
  - We create an empty log and initialise count at 0.
  - When adding exercise we append the Object with description etc. to the log
    ~ If no date is provided, use today's date. 

  Example log:
  {
    "_id":"r15utrTvQ",
    "username":"jonnybgoode2",
    "count":1,
    "log":[
      {
        "description":"running",
        "duration":7,
        "date":"Wed Sep 05 2018"
      }
    ]
  }
  */
