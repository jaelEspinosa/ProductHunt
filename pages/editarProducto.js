import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import { FirebaseContext } from "../firebase";


import {
  Campo,
  Error,
  Exito,
  Formulario,
  Inputsubmit,

} from "../components/ui/Formulario";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Error404 from "../components/layout/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};


const EditarProducto = () => {
// States para la subida de la imagen
const [uploading, setUploading] = useState(false);
const [productoEditar, setProductoEditar] = useState({})
const [errores, setErrores]=useState(false)

// hook de routing para redireccionar y obtener query
const router = useRouter();
const {query:{q}}=router;


//obtener el producto a editar 
    useEffect(()=>{
       
       const obtenerProducto = async ()=>{
        if(!productoEditar.nombre){
            const docRef = doc (firebase.db, 'productos', q)
            const docSnap = await getDoc(docRef)
            setProductoEditar(docSnap.data())
        }
           return
       }


     obtenerProducto()
     console.log('el producto a editar es',productoEditar)
    },[q, productoEditar])
  
const handleSubmit = e =>{
    e.preventDefault()
    console.log('vamos a actualizar el registro')
    actualizarProducto()
}  

const handleChange = e=>{
    setProductoEditar({
        ...productoEditar,
      [e.target.name]:e.target.value
    })
}
const handleKeyDown = e=>{
    setProductoEditar({
        ...productoEditar,
      [e.target.name]:e.target.value
    })
}
 
  
  // context con las operaciones crud de firebase

  const { usuario, firebase } = useContext(FirebaseContext);

  /*  const [errorCorreo, setErrorCorreo] = useState('') */
  const [exito, setExito] = useState("");

  const actualizarProducto = async () => {
    // si el usuario no está autenticado llevo al login

    if (!usuario) {
      return router.push("/login");
    }
    

  
    // insertarlo en la base de datos

    try {
      const docRef = doc(firebase.db, 'productos', q)

      await updateDoc(docRef,productoEditar);
      setExito("Cambios Guardados");
      setTimeout(() => {
        setExito("");
        Router.push("/");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Layout>
      {usuario && <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Editar Producto
        </h1>}  

        <Formulario onSubmit={handleSubmit} noValidate>
          {exito && <Exito>{exito}</Exito>}

        {!usuario ? (
          <Error404 />
        ):(
          <>
          <fieldset>
            <legend>Información General</legend>

            <Campo>
              <label htmlFor="nombre">Nombre</label>

              <input
                type="text"
                id="nombre"
                placeholder="Nombre del Producto"
                name="nombre"
                value={productoEditar.nombre}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="empresa">Nombre Empresa</label>

              <input
                type="text"
                id="empresa"
                placeholder="Nombre Empresa"
                name="empresa"
                value={productoEditar.empresa}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.empresa && <Error>{errores.empresa}</Error>}
            <Campo>
              <label htmlFor="imagen">Imagen</label>

             <img src={productoEditar.URLImage} alt={`imagen de ${productoEditar.nombre}`}/>
             

       
            </Campo>
            {productoEditar.URLImage && <p css = {css`text-align:center; color:red;`}>Imagen No Editable</p>}
            {errores?.url && <Error>{errores.url}</Error>}
            <Campo>
              <label htmlFor="url">Url</label>

              <input
                type="url"
                id="url"
                placeholder="URL del producto"
                name="url"
                value={productoEditar.url}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.url && <Error>{errores.url}</Error>}
          </fieldset>
          <fieldset>
            <legend>Sobre tu Producto</legend>
            <Campo>
              <label htmlFor="descripcion">Descripción</label>

              <textarea
                id="descripcion"
                placeholder="Descripcion"
                name="descripcion"
                value={productoEditar.descripcion}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.descripcion && <Error>{errores.descripcion}</Error>}
          </fieldset>
          <Inputsubmit type="submit" value="Guardar Cambios" />
          </>
        ) }  
          

         
        </Formulario>
      </Layout>
    </div>
  );
};

export default EditarProducto;