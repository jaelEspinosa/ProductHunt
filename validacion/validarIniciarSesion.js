export default function validarIniciarSesion(valores){


    let errores={};

// validar todos los campos del formulario

    if(!valores.email){
        errores.email = 'El Email es obligatorio'
    }else if( !/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i.test(valores.email) ){
        errores.email = 'Email no válido'
    }

    if(!valores.password){
        errores.password = 'El password es obligatorio'
    }else if(valores.password.length < 6){
        errores.password = 'El password debe tener al menos 6 caracteres'
    }

    return errores
}