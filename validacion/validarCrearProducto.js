export default function validarCrearCuenta(valores){


    let errores={};

// validar todos los campos del formulario

    if(!valores.nombre){
        errores.nombre = 'El Nombre es obligatorio'
    }

 // validar empresa
 
 if(!valores.empresa){
    errores.empresa = 'El Nombre de empresa es obligatorio'
}


// validar url
if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
    errores.url = 'La URL no es válida'
}

// validar descripcion

if(!valores.descripcion){
    errores.descripcion = 'Agrega una descripción del producto'
}


    return errores
}