import React, { useEffect, useState } from 'react'

const useValidacion = (stateInicial, validar, fn) => {
  const[valores, setValores]=useState(stateInicial)
  const[errores, setErrores]=useState({})
  const[submitForm, setSubmitForm]=useState(false)
  const[submit, setSubmit]= useState(false)
  
  useEffect(()=>{
if(submitForm){
    const noErrores = Object.keys(errores).length === 0;

    if(noErrores){
        fn() // fn = Función que se ejecuta en el componente
    }
    setSubmitForm(false)
}


  },[errores])

  // función que se ejecuta conforme escribe algo

  const handleChange = e =>{
    setValores({
        ...valores,
        [e.target.name] : e.target.value
    })
  }

  // función que se ejecuta cuando el usuario hace submit

  const handleSubmit = e =>{
     e.preventDefault();
     setSubmit(true)
     const erroresValidacion = validar(valores);
     setErrores(erroresValidacion);
     setSubmitForm(true)
  }

  // se ejecuta cuando se sale del input

  const handleKeyDown = ()=>{
    if (submit){
        const erroresValidacion= validar(valores);
        setErrores(erroresValidacion);
    }
    
  }
    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleKeyDown
        
    };
}

export default useValidacion