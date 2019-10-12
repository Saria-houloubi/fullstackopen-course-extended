const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
morgan.token('body', (req) =>{
return JSON.stringify(req.body)
})
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

let persons = [
	{
		name : "Arto Hellas",
		number: "040-123456",
		id :1
	},
	{
		name : "Arto Hellas",
		number: "040-123456",
		id :2
	},
	{
		name : "Arto Hellas",
		number: "040-123456",
		id :3
	},
	{
		name : "Arto Hellas",
		number: "040-123456",
		id :4
	}
]

app.get("/api/persons", (req,res) =>{
	res.json(persons)
})

app.get("/api/info", (req,res)=>{
res.send(`<p>phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(req,res)=>{
	const id = Number(req.params.id)
	const person = persons.find(p=>p.id === id)

	if(!person){
		return res.status(404).end()
	}else{
		return res.json(person)
	}
})

app.delete('/api/persons/:id',(req,res)=>{
	const id = Number(req.params.id)
	
	persons = persons.filter(p=>p.id !== id)

	res.status(204).end()

})
const maxId = 1000;
const getRandomInt= (max) => Math.floor(Math.random() * Math.floor(max));
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
app.post("/api/persons", (req,res)=>{
	const body = req.body

	if(!body.name || !body.number){
		return res.status(400).send({
			error: "Missing content"
		})
	}
	if(persons.find(p=> p.name === body.name))
	{
		return res.status(400).send({
			error: "name must be unique"
		})
	}
	const person ={
		name : body.name,
		number : body.number,
		id :genrateID()
	}

	persons = persons.concat(person)

	return res.json(person)

})
const port = process.env.PORT || 3001
app.listen(port ,()=>{
	console.log("running")
})
	
	