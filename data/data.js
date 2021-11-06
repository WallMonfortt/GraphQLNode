const courses = [//array of courses similar to the database
  {id: '1', name: 'patrones de diseño', language: 'java', date: '01/01/2019', professorId:'2'},
  {id: '2', name: 'introduccion Kotlin', language: 'kotlin', date: '01/01/2019', professorId:'3'},
  {id: '3', name: 'bases javascript', language: 'javascript', date: '01/01/2019', professorId:'5'},
  {id: '4', name: 'expert angular', language: 'javascript', date: '01/01/2019', professorId:'5'},
  {id: '5', name: 'nociones react', language: 'javascript', date: '01/01/2019', professorId:'6'},
  {id: '6', name: 'intro c#', language: 'c#', date: '01/01/2019'},
  {id: '7', name: 'diseño avanzado', language: 'java', date: '01/01/2019'}
]

const professors = [
  {id: '1', name: 'Juan', age: '30', active: true, date: '01/01/2019'},
  {id: '2', name: 'Pedro', age: '40', active: true, date: '01/01/2019'},
  {id: '3', name: 'Rodrigo', age: '34', active: true, date: '01/01/2019'},
  {id: '4', name: 'Carmelo', age: '24', active: true, date: '01/01/2019'},
  {id: '5', name: 'Pancho', age: '50', active: true, date: '01/01/2019'},
  {id: '6', name: 'Toño', age: '55', active: false, date: '01/01/2019'}
]

const users = [
  {id:'1',name:'Damian',age:'22',email:'algo@gmail.com',password:'123',date: '01/01/2019'},
  {id:'2',name:'Jorge',age:'20',email:'algo2@gmail.com',password:'123',date: '01/01/2019'},
  {id:'3',name:'Flabio',age:'25',email:'algo3@gmail.com',password:'123',date: '01/01/2019'},
  {id:'4',name:'Dora',age:'24',email:'algo4@gmail.com',password:'123',date: '01/01/2019'}
]

module.exports = {
  courses,
  professors,
  users
}