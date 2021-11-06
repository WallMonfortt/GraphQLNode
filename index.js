const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const auth = require('./utils/auth');
require("dotenv").config();

mongoose.connect('mongodb://localhost:27017/graphql-demo',//conectar a la base de datos en caso de que no exista se crea
{useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err));


const app = express();

app.use(
  auth.checkToken
)

app.use('/graphql', graphqlHTTP((request) => {
  return{
    schema,
    graphiql: true,
    context: {
      user: request.user //se agrega el usuario para que se pueda usar en el schema
    }
  }
    //schema,//schema es el objeto que contiene todas las definiciones de los tipos de datos
    //graphiql: true //para que se vea el query en la pagina
}));

app.listen(4000, () => {
  console.log('Server started on port 4000');
});