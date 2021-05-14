const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const { MONGO_URI } = process.env

mongoose.plugin(uniqueValidator)
console.log("connecting to database...")
mongoose.connect(MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("connected to database"))
  .catch((error) => console.error("could not connect to database", error.message))

const datumSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 256,
    required: true
  },
  email: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    required: true
  },
  country: {
    type: String,
    minlength: 4,
    maxlength: 56,
    required: true
  }
})

datumSchema.set("toJSON", {
  transform: (document, resultObjectId) => {
    resultObjectId.id = resultObjectId._id.toString()

    delete resultObjectId._id
    delete resultObjectId.__v
  }
})
module.exports = mongoose.model("Data", datumSchema)
