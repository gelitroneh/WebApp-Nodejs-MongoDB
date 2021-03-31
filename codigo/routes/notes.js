//Permite crear rutas del servidor
const express = require('express');
const router = express.Router();
//Modulos requeridos
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars);

//Ruta para agregar notas
const Nota = require('../models/Nota')
const { isAuthenticated} = require('../helpers/verificacion');
router.get('/notes/agregar',isAuthenticated,(req,res)=>{
    res.render('notes/nuevasNotas');
});

//Ruta para recibir la informacion
router.post('/notes/nuevasNotas',isAuthenticated,async (req,res)=>{
   const {title ,descripcion}=req.body;
   //Validar informacion
   const errors = [];
   if(!title){
       errors.push({text: 'Por favor introduzca un titulo'});
   }
   if(!descripcion){
    errors.push({text: 'Por favor introduzca una descripcion'});
    }
    //Si ha ocurrido un error le volvemos a mostrar los campos introducidos
    if(errors.length>0){
        res.render('notes/nuevasNotas',{
            errors,
            title,
            descripcion
        });
    }else{
        //Si todo va OK procedemos a almacenarlo en la BD
        const newNota =new Nota({title,descripcion});
        newNota.user= req.user.id;
        await newNota.save();
        req.flash('succes_msg', 'Nota creada');
        //Redirecciona a la ruta notes
       res.redirect('/notes');
    }
   
});

//Ruta que devuelve todas las notas de la bd
router.get('/notes',isAuthenticated,async (req,res)=>{
    //Indica el orden en el que se colocan las notas
  const notes= await Nota.find({user:req.user.id}).sort({date: 'desc'});
  res.render('notes/todoNotas',{notes});
});

//Ruta para editar una nota
router.get('/notes/edit/:id',isAuthenticated,async (req,res)=>{
    //Consulta a la base de datos para obtener el id de la nota
    const nota=await Nota.findById(req.params.id);
    res.render('notes/editar',{nota});
});

router.put('/notes/editar/:id',isAuthenticated,async (req,res)=>{
    const {title,descripcion} = req.body;
    //Consulta a la base de  datos que actualiza los datos
    await Nota.findByIdAndUpdate(req.params.id,{title,descripcion});
    req.flash('succes_msg', 'Nota editada');
    //Redirecciona a la pagina de notas
    res.redirect('/notes');
});

//Ruta de eliminacion
router.delete('/notes/delete/:id',isAuthenticated,async (req,res)=>{
    req.flash('error_msg', 'Nota eliminada');
    //Eliminarlo de la base de datos
    await Nota.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});

module.exports=router;