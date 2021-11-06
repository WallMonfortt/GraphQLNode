const graphql = require('graphql');
const Course = require('../models/course');
const Professor = require('../models/professor');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../utils/auth');
const {courses, professors, users} = require('../data/data'); // import data simulate data base

const {GraphQLObjectType,GraphQLID,GraphQLInt,GraphQLBoolean,GraphQLList, GraphQLString, GraphQLSchema} = graphql; // funciones de graphql


const CourseType = new GraphQLObjectType({//Definicion del tipo de dato
  name: 'Course',//Nombre del tipo de dato
  fields: () => ({//Campos del tipo de dato
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    language: {type: GraphQLString},
    date: {type: GraphQLString},
    professor:{
      type: ProfessorType,
      resolve(parent, args){
        // return professors.find(professor => professor.id === parent.professorId)
        return Professor.findById(parent.professorId)
      }
    }
  })
});

const ProfessorType = new GraphQLObjectType({//Definicion del tipo de dato
  name: 'Professor',//Nombre del tipo de dato
  fields: () => ({//Campos del tipo de dato
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    active: {type: GraphQLBoolean},
    date: {type: GraphQLString},
    courses:{
      type: new GraphQLList(CourseType),
      resolve(parent, args){
        // return courses.filter(course => course.professorId === parent.id)
        return Course.find({professorId: parent.id})
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    date: {type: GraphQLString},
  })
});

const MessageType = new GraphQLObjectType({ //Mensaje cuando se crea el usuario
  name: 'Message',
  fields: () => ({
    message: {type: GraphQLString},
    token: {type: GraphQLString},
    error: {type: GraphQLString}
  })
});

const RootQuery = new GraphQLObjectType({//Definicion de la consulta
  name: 'RootQueryType',//Nombre de la consulta
  fields: {//Campos de la consulta

    course: {// consulta de un curso
      type: CourseType,
      args: {id: {type: GraphQLString}},
      resolve(parent, args, context) {//Funcion que se ejecuta cuando se ejecuta la consulta
        if(!context.user.auth){
          throw new Error('No autorizado');
        }
        return Course.findById(args.id);
      }
  },

  courses:{ // consulta de todos los cursos
    type: new GraphQLList(CourseType),
    resolve(parent, args){
      // return courses;
      return Course.find({});
    }
  },

  professor: { // consulta de un profesor
    type: ProfessorType,
    args: {name: {type: GraphQLString}},
    resolve(parent, args) {//Funcion que se ejecuta cuando se ejecuta la consulta
      // return professors.find(professor => professor.name === args.name); //devolver el profesor que coincida con el id
      return Professor.findOne({name: args.name});
    }
  },

  professors:{ // consulta de todos los profesores
    type: new GraphQLList(ProfessorType),
    resolve(parent, args){
      // return professors;
      return Professor.find();
    }
  },

  users:{ // consulta de todos los usuarios
    type: UserType,
    args: {email: {type: GraphQLString}},
    resolve(parent, args) {
      return User.find(user => user.email === args.email);
    }
  }
}
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCourse: {
      type: CourseType,
      args: {
        name: {type: GraphQLString},
        language: {type: GraphQLString},
        date: {type: GraphQLString},
        professorId: {type: GraphQLID}
      },
      resolve(parent, args){
        let course = new Course({
          name: args.name,
          language: args.language,
          date: args.date,
          professorId: args.professorId
        });
        return course.save();
      }
    },
    updateCourse: {
      type: CourseType,
      args: { //Campos a actualizar
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        language: {type: GraphQLString},
        date: {type: GraphQLString},
        professorId: {type: GraphQLID},
      },
      resolve(parent, args){
        return Course.findByIdAndUpdate(args.id, {
          name: args.name,
          language: args.language,
          date: args.date,
          professorId: args.professorId
        },
        {new: true});//Retorna el objeto actualizado, sin este parametro retorna el objeto antes de actualizar
      }
    },
    deleteCourse: {
      type: CourseType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Course.findByIdAndDelete(args.id);
      }
    },
    deleteAllCourses: {
      type: CourseType,
      resolve(parent, args){
        return Course.deleteMany({});
      }
    },

    addProfessor: {
      type: ProfessorType,
      args: {
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        active: {type: GraphQLBoolean},
        date: {type: GraphQLString}
      },
      resolve(parent, args){
        return Professor(args).save();
      }
    },

    updateProfessor: {
      type: ProfessorType,
      args:{
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        active: {type: GraphQLBoolean},
        date: {type: GraphQLString}
      },
      resolve(parent, args){
        return Professor.findByIdAndUpdate(args.id, {
          name: args.name,
          age: args.age,
          active: args.active,
          date: args.date
        },
        {new: true});
      }
    },

    deleteProfessor: {
      type: ProfessorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Professor.findByIdAndDelete(args.id);
      }
    },

    addUser: {
      type: MessageType,
      args: {
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        date: {type: GraphQLString}
      },
      async resolve(parent, args){
        let user = await User.findOne({email: args.email});// Busca si el usuario ya existe
        if (user)return {error: 'El usuario ya existe'}; //Si el usuario ya existe retorna un mensaje de error
        const salt = await bcrypt.genSalt(10); //Genera una clave de encriptacion
        const hashPassword = await bcrypt.hash(args.password, salt); //Encripta la clave
        user = new User({ //Crea un nuevo usuario
          name: args.name,
          age: args.age,
          email: args.email,
          password: hashPassword,
          date: args.date
        }
        );
        user.save();
        return {message: 'Usuario creado'};
      }
    },

    updateUser: {
      type: MessageType,
      args: {//Campos a actualizar
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      async resolve(parent, args,context){
        if(!context.user.auth){
          throw new Error('No autorizado para realizar esta operación');
        }
        if(args.id === context.user._id){
          return User.findByIdAndUpdate(args.id, {
            name: args.name,
            age: args.age,
        },
        {new: true});
        }else{
          throw new Error('No puedes modificar otro usuario');
        }
      }
    },

    login: {// Funcion para iniciar sesion
      type: MessageType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      async resolve(parent, args){
        const result = await auth.login(args.email, args.password,process.env.SECRET_KEY);
        return {
          message: result.message,
          error: result.error,
          token: result.token
        }
      }
    }
  }

});

module.exports = new GraphQLSchema({//Exportar el esquema
  query: RootQuery,
  mutation: Mutation
});





