//Modulo que permite conectarse a MongoDB
const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost/MicroproyectoDB',{
    //Funcionamiento de la biblioteca
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
    //Si la conexion funcina lo muestra por consola y si no devuelve un error
    .then(db =>console.log('La BD esta conectada'))
    .catch(err => console.error(err));