require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person.js')
morgan.token('body', (req) =>{
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.put('/api/persons/:id',(req,res)=>{
    const person = req.body

    if(!person.name || !person.number){
        return res.status(400).send({
            error: 'Missing content'
        })
    }

    const per = {
        name : person.name,
        number : person.number
    }
    Person.findByIdAndUpdate(req.params.id,per,{new:true}).then((result)=>{
        console.log(result)

        res.json(result.toJSON())
    })

})
app.get('/api/persons', (req,res,next) =>{
    Person.find({}).then(pp=>{
        res.json(pp.map(p=>p.toJSON()))
    }).catch(error=>{
        next(error)
    })
})

app.get('/api/info', (req,res)=>{
    res.send(`<p>phonebook has info for ${3} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(req,res)=>{
    Person.findById(req.params.id).then(person=>{
        if(!person){
            return res.status(404).end()
        }else{
            console.log(person)
            return res.json(person.toJSON())
        }
		
    })
})

app.delete('/api/persons/:id',(req,res)=>{

    Person.findByIdAndRemove(req.params.id).then(result=>{
        res.status(204).end()
    })
})
//#region not used
const maxId = 1000
const getRandomInt= (max) => Math.floor(Math.random() * Math.floor(max))
const genrateID = ()=>{
    //Generate the id
    const id = getRandomInt(maxId)
    //Make sure the id is not used before
    while(persons.find(p=> p.id === id)){
        id =  getRandomInt(maxId)
    }
    //return the new id
    return id
}
//#endregion
app.post('/api/persons', (req,res,next)=>{
    const body = req.body
    console.log(body)
    const person =new Person({
        name : body.name,
        number : body.number,
    })
    person.save()
        .then(result=>{
            return res.json(result.toJSON())

        })
        .catch(error=>{
            next(error)
        })

})

const errorHandeler = (error,req,res,next)=>{
    console.log(error)
    if(error.name ==='CastError' && error.kind ==='ObjectId'){
        return res.status(400).send({error:'malformated id'})
    }else if(error.name ==='MongoError'||error.name === 'ValidationError'){

        return res.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandeler)

const port = process.env.PORT 
app.listen(port ,()=>{
    console.log('running')
})
	
