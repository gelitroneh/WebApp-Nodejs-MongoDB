const helpers ={};

//Verifica a un usuario
helpers.isAuthenticated =(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    //Muestra mensaje de no autorizado
    req.flash('error_msg','No autorizado');
    //Redirige al signin
    res.redirect('/users/signin');
};
module.exports=helpers;