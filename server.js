require("dotenv").config()
const {PORT =4000, MONGODB_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

mongoose.connect(MONGODB_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection
    .on("open",() => console.log("You are connected to mongoose"))
    .on("close",() => console.log("You are disconnected from mongoose"))
    .on("error", (error) =>console.log(error))

const MountainSchema = new mongoose.Schema({
    name: String,
    image: String,
    Location: String,
    Difficulty: String
});

const Mountain = mongoose.model("Mountain", MountainSchema)

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//  TEST ROUTE
app.get("/", (req,res) => {
    res.send("hello mountains")
})

// INDEX
app.get("/mountain", async (req,res) =>{
    try {
        res.json(await Mountain.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// CREATE
app.post("/mountain", async (req,res) =>{
    try {
        res.json(await Mountain.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// DELETE
app.delete("/mountain/:id", async (req,res) =>{
    try {
        res.json(await Mountain.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// UPDATE
app.put("/mountain/:id", async (req,res) =>{
    try{
        res.json(await Mountain.findByIdAndUpdate(req.params.id, req.body,{new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`hiking on ${PORT}`))