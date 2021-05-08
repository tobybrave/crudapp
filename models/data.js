const mongoose = require("mongoose")
const { MONGO_URI } = process.env

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
  name: String,
  email: String,
  country: String
})

datumSchema.set("toJSON", {
  transform: (document, resultObjectId) => {
    resultObjectId.id = resultObjectId._id.toString()

    delete resultObjectId._id
    delete resultObjectId.__v
  }
})
module.exports = mongoose.model("Data", datumSchema)