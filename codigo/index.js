//Modulos que se requieren
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

//Inicializacion
const app = express();
//Requiere la clase database
require('./database');
//Requiere la clase passport de la carpeta config
require('./config/passport');

//Configuracion
app.set('port',process.env.PORT || 27017); //Puerto 27017
app.set('views',path.join(__dirname, 'views')); //Configurando la carpeta views
//Conectar Handlebars a express
app.engine('.hbs', exphbs({
    //Vistas Definidas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname:'.hbs'

}));
app.set('view engine','hbs');

//Funciones ejecutadas preservidor
app.use(express.urlencoded({extended:false}))//Entender los datos enviados en un formulario
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Variables globales
app.use((req,res,next)=>{
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.succes_msg = req.flash('invalid_msg');
    res.locals.error_msg = req.flash('register_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Archivos estaticos
app.use(express.static(path.join(__dirname,'public')));
//Servidor 
//Muestra el puerto que se esta usando
app.listen(app.get('port'), () =>{
    console.log('EL servidor se encuentra en el puerto', app.get('port'));
});