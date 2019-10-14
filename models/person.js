const mongoose = require('mongoose')
console.log(process.env.MONGODB_URI)
// connect to the database
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser : true}).then(reuslt=>{
    console.log("Connected to mongodb")
}).catch(error=>{
    console.log("error connecting to mongodb",error.message)
})

//Creat the schema
const personSchema = new mongoose.Schema({
    name : String,
    number : String
})

//added some method to the schema
personSchema.set('toJSON',{
    
   transform : (document,savedDocument)=>{
    savedDocument.id = savedDocument._id.toString()
    delete savedDocument._id
    delete savedDocument.__v
}})


module.exports = mongoose.model('Person',personSchema)