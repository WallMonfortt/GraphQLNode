const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const auth = {
  login: async(email, password, secretKey) => {
    const user = await User.findOne({ email: email }); // encontrar usuario por email
    if (!user) return { error: 'Usuario o contraseña incorrectos' };
    const validPassword = await bcrypt.compare(password, user.password); // comparar contraseña
    if (!validPassword) return { error: 'Usuario o contraseña incorrectos' }; // si no es correcto

    const token = await jwt.sign({ // generar token
       _id: user._id,
       name: user.name,
      date: user.date}, secretKey)

    return {message: 'login correcto', token: token};
  },
  checkToken: (request, response, next) => {
    const token = request.header('Authorization') // obtener token
    if(!token){
      request.user = {auth: false};
      return next();
    }
    const jwToken = token.split(' ')[1]// separar token

    if(jwToken){//si hay token
      try {
        const payload = jwt.verify(jwToken, process.env.SECRET_KEY); // verificar token
        request.user = payload // agregar usuario a request
        request.user.auth = true  // agregar autenticacion a request
        return next()
      } catch (error) { // si hay error
        request.user = {auth: false} // autenticacion falso
        return next()
      }
    }else{
      request.user = {auth: false} // autenticacion falso
      return next()
    }
  }
}

module.exports = auth;