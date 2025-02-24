const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const server = express()
const Note = require('./models/notes.model.js').Note
const User = require('./models/notes.model.js').User
const bcrypt = require('bcrypt')
const env = require('dotenv').config()

mongoose.connect(`mongodb+srv://akmalmorsyy:${process.env.MONGO_PASSWORD}@cluster0.cgltk.mongodb.net/toDoList?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('connected to database.')
    //server.listen(5000, ()=>{console.log('server is running on port 5000')})
})
.catch((err)=>{console.error(err)})

server.use(express.json())
server.use(
    cors({
        origin: "https://akmalkimo.github.io/nicetodolist",
    })
)

// Get all notes

server.get("/api/notes/:id", async (req,res)=>{
    try{
        const notes = await Note.find({indexPass: `${req.params.id}`})
        res.status(200).json(notes)
    }
    catch(error){
        res.status(500)
    }
})

// Create a note

server.post("/api/notes", async (req,res)=>{
    const note = new Note({
        id: req.body.id,
        text : req.body.text,
        checked: req.body.checked,
        indexPass: req.body.indexPass
    })
    try{
        const newNotes = await note.save()
        res.status(201).json(newNotes)
    } catch(error){
        console.error(error)
        res.status(500)
    }
})

// Update a note

server.put("/api/notes/:id", async (req,res)=>{
    try{
        const {id} = req.params
        const note = await Note.findByIdAndUpdate(id, req.body)

    if(!note){
        return res.status(404)
    }

        const updatedNote = await Note.findById(id)
        res.status(200).json(updatedNote)
    } catch(error){
        res.status(500)
    }
})

// Delete a note

server.delete("/api/notes/:id", async (req,res)=>{
    try{
    const {id} = req.params

    const deletedNote = await Note.findByIdAndDelete(id)

    if(!deletedNote){
        return res.status(404)
    }

    res.status(200)
    } catch(error){
        res.status(500)
    }
})

// user sign-up & authentication

server.post("/sign-up", async (req,res)=>{
    try{
        if(req.body.password === '' || null) return res.status(400).end("invalid password")
        if(req.body.email === '' || null) return res.status(400).end("invalid email")
        if(req.body.email.includes("@")) return res.status(400).end("invalid emails")

        const password = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: password
        })
        if(await User.findOne({email: `${req.body.email}`}) === null){
            await user.save()
            res.status(201).end()
        } else{
            res.status(409).end()
        }
    } catch(err){
        res.status(500).end(err)
    }
})

server.post("/login", async (req,res)=>{
    try{
        if(req.body.password === '' || null) return res.status(400).end("invalid password")
        if(req.body.email === '' || null) return res.status(400).end("invalid email")
        if(req.body.email.includes("@") === false) return res.status(400).end("invalid emails")

        const user = await User.findOne({email: `${req.body.email}`})
        if(user === null) return res.status(401).end()

        if(await bcrypt.compare(req.body.password, user.password)){
            res.status(200).end()
        } else{
            res.status(401).end()
        }
    } catch(err){
        res.status(500).end()
    }
})

module.exports = server