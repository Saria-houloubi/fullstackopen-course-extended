const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("Please provied password using argumants")
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://fullstack:${password}@project0-tdcig.mongodb.net/Phonebook?retryWrites=true&w=majority`;


mongoose.connect(url,{useNewUrlParser : true})

const personModel = new mongoose.Schema({
    name : String,
    number : String
})

const Person = mongoose.model('Person',personModel)


if(process.argv.length === 5){
    const person = new Person({
        name : process.argv[3],
        number : process.argv[4]
    })

    person.save().then(result=>{
        console.log(result)
        closeConnection()
    })
}else{
    Person.find({}).then(result=>{
        console.log("phonebook:")
        result.forEach(element => {
            console.log(element.name,element.number) 
        });
        closeConnection()
    })
}

const closeConnection = ()=>{
    mongoose.connection.close()
}