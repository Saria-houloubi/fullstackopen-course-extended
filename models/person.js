const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
mongoose.set('useUnifiedTopology', true)
console.log(url)
// connect to the database
mongoose.connect(url,{useNewUrlParser : true}).then(reuslt=>{
    console.log("Connected to mongodb")
}).catch(error=>{
    console.log("error connecting to mongodb",error.message)
})

//Creat the schema
const personSchema = new mongoose.Schema({
    name : {
        type:String,
        minlength : 3,
        required : true,
        unique : true
    },
    number : {
        type : String,
        minlength :8,
        required : true
    }
})

//added some method to the schema
personSchema.set('toJSON',{
    
   transform : (document,savedDocument)=>{
    savedDocument.id = savedDocument._id.toString()
    delete savedDocument._id
    delete savedDocument.__v
}})


module.exports = mongoose.model('Person',personSchema)