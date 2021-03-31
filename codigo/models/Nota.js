const mongoose = require('mongoose');
const {Schema} = mongoose;

//Esquema que tienen los datos de las notas
const NotaSchema = new Schema({
   title:{type: String, required: true},
   descripcion:{type:String, required:true},
   date: {type:Date,default:Date.now},
   //El numero de user toma el id que tiene el usuario 
   user:{type: String}
   
});

module.exports= mongoose.model('Nota',NotaSchema);