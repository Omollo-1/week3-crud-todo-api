require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const validateTodo = require('./middlewares/validator');
const logRequest = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./databases/db');
const Todo = require('./models/todo.models');

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(logRequest);


const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin

};
app.use(cors(corsOptions));
app.use(logRequest);

// GET All – Read
app.get('/todos', async (req, res) => {
  const todos =  await Todo.find({});
  res.status(200).json(todos); // Send array as JSON
});

app.get('/todos/completed', async (req, res, next) => {
  try{
    const completed =  await Todo.find({completed: true});
    res.json(completed);
  } catch (error){
       next(error);
  };
});

//GET single-read
app.get('/todos/:id',  async (req, res, next) => {
  try{
   const todo =  await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Not Found' });
  }

  res.status(200).json(todo);
  } catch (error) {
    next(error);
   }; // Pass error to the error-handling middleware
});

// POST New – Create
app.post('/todos',validateTodo, async (req, res, next) => {
  const { task, completed } = req.body;
  
  const newTodo = new Todo({ 
    task ,
    completed,
  });

  await newTodo.save()
  newTodo.save();
 try {
  
  res.status(201).json(newTodo);
 } catch (error) {
  next(error); // Pass error to the error-handling middleware
 }
});


// PATCH Update – Partial
app.patch('/todos/:id',  async (req, res, next) => {
  try{
    const todo = await Todo.FindByIdAndUpdate(req.params.id, req.body, {
      new : true
    });
    if (!todo) {
    return res.status(404).json({ error: 'Not Found' });
  }
    res.status(200).json(todo);
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
  try {
    
    
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
    return res.status(404).json({ error: 'Not Found' });
  }
    res.status(200).json({message :  `Todo ${req.params.id} Deleted`});
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
});

app.get('/todos/completed', (req, res, next) => {
  try{
    const completed = todos.filter((t) => t.completed);
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
});

app.use(errorHandler); // Error-handling middleware

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
