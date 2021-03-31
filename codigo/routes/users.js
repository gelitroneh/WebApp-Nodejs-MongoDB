//Permite crear rutas del servidor
const express = require('express');
const router = express.Router();
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars);

const User = require('../models/User');
const passport = require('passport');

//Ruta de sign
router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
});
router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

//Ruta de registrar usuario
router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
});

//Validacion
router.post('/users/signup',async (req,res)=>{
    const { name,email,password,confirmpassword } = req.body;
    const errors =[];
    console.log(req.body)
    if(name.length <= 0){
        errors.push({text: 'Por favor introduzca su nombre'});
    }
    if(password != confirmpassword){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length<4){
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});
    }
    if(errors.length>0){
        res.render('users/signup',{errors,name,email,password,confirmpassword});
    }else{
        //Error
        
        //Comprueba si el email esta repetido en la base de datos
        const emailUser = await User.findOne({email:email});
        if(emailUser){
            req.flash('invalid_msg','El email ya esta registrado');
            res.redirect('/users/signup');
        }
        const newUser= new User({name,email,password});
        //Guarda la contraseña cifrada
        newUser.password=  await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('register_msg','Registro completado');

        //Redirige al login  
        res.redirect('/notes');
    }
});

router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});
module.exports=router;