require("dotenv").config()
const express = require("express")
const { body, validationResult } = require("express-validator")
const Data = require("./models/data")

const app = express()
const { PORT } = process.env

app.use(express.json())

app.get("/", (request, response) => {
  response.send(
    `
    <body style="text-align: center;">
      <h3>CRUD APP</h3>
      <h4>This is the homepage</h4>
      <p>GET /data => gets all data in database</p>
      <p>POST /data => creates a new datum</p>
      <p>GET /data/:id => gets a datum from the database</p>
      <p>PUT /data/:id => modifies an existing datum</p>
      <p>DELETE /data/:id => removes a datum from the database</p>
    </body>
    `
  )
})

app.get("/data", async (request, response) => {
  try {
    const data = await Data.find({})

    response.json({
      data,
      message: "success"
    })
  } catch (error) {
    response.status(500).json({
      message: "failed",
      error: "error occurred while trying to retrieve data"
    })
  }
})

app.post(
  "/data",
  body("email").isEmail(),
  async (request, response) => {
    const { name, email, country } = request.body
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
      return response.status(400).json({
        error: "provide a valid email address"
      })
    }

    if (!(name && email && country)) {
      return response.status(400).json({
        message: "failed",
        error: "name, email and country are required"
      })
    }

    const datum = {
      email,
      name,
      country
    }
    try {
      const data = new Data(datum)
      const savedData = await data.save()

      response.status(201).json({
        message: "success",
        data: savedData
      })
    } catch (error) {
      response.status(400).json({
        message: "failed",
        error: error.message
      })
    }

  })

app.get("/data/:id", async (request, response, next) => {
  const { id } = request.params
  try {
    const datum = await Data.findById(id)

    if (!datum) {
      return response.status(404).json({
        message: "failed",
        error: "not found"
      })
    }
    response.json({
      message: "success",
      data: datum
    })
  } catch (error) {
    next(error)
  }
})

app.put("/data/:id", async (request, response) => {
  const { id } = request.params
  const { name, email, country } = request.body

  try {
    const datum = await Data.findById(id)

    if (!datum) {
      return response.status(404).json({
        message: "failed",
        error: "data with specified ID does not exist"
      })
    }

    const updateDatum = {}

    if (name) {
      updateDatum.name = name
    } if (email) {
      updateDatum.email = email
    } if (country) {
      updateDatum.country = country
    }

    const updatedDatum = await Data.findByIdAndUpdate(id, updateDatum, { new: true, runValidators: true, context: "query" })

    response.json({
      message: "success",
      data: updatedDatum
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({
      message: "failed",
      error: error.message
    })
  }

})

app.delete("/data/:id", async (request, response, next) => {
  const { id } = request.params

  try {
    const datum = await Data.findByIdAndRemove(id)
    if (!datum) {
      return response.status(404).json({
        message: "failed",
        error: "data with the specified ID does not exist"
      })
    }
    response.status(204).end()

  } catch (error) {
    next(error)
  }
})

const invalidEndpoint = (request, response) => {
  response.status(404).end()
}
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({
      message: "failed",
      error: "invalid id"
    })
  } if (error.name === "MongooseError") {
    return response.status(500).end()
  }

  next(error)
}

app.use(invalidEndpoint)
app.use(errorHandler)

app.listen(PORT, () => console.log(`server is running at ${PORT}`))
