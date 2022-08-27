import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import { FirebaseContext } from "../firebase";


const ImagenMiniatura = styled.img`
  max-width: 200px;
`;

import {
  Campo,
  Error,
  Exito,
  Formulario,
  Inputsubmit,
  Progress,
  Progress1,

} from "../components/ui/Formulario";



import {  doc, getDoc, updateDoc} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import Error404 from "../components/layout/404";
import styled from "@emotion/styled";
import Spinner from "../components/layout/Spinner";
import { BotonMini } from "../components/ui/Boton";

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

const [cambiarImagen, setCambiarImagen] = useState(false)
const [URLImage, setURLImage] = useState("");
const [progreso, setProgreso] = useState(null)
// hook de routing para redireccionar y obtener query
const router = useRouter();
const {query:{q}}=router;



const [errores, setErrores]=useState({})

//obtener el producto a editar 
    useEffect(()=>{
       
       const obtenerProducto = async ()=>{
        if(!productoEditar.nombre){
            try {
                const docRef = doc(firebase.db, 'productos', q)
                const docSnap = await getDoc(docRef)
                setProductoEditar(docSnap.data()) 
            } catch (error) {
                console.error(error)
            }
           
        }
           return
       }


     obtenerProducto()
    
    },[q, productoEditar])
  
const handleSubmit = e =>{
    e.preventDefault()
    setErrores({})
  //validar formulario
  console.log(productoEditar)
  if (productoEditar.nombre.trim() === '' || productoEditar.nombre.length < 3){
    setErrores({
        ...errores,
        nombre : 'El nombre es obligatorio'
    })
    return
  }
  if (productoEditar.empresa.trim() === '' || productoEditar.empresa.length < 3){
    setErrores({
        ...errores,
        empresa : 'El nombre de la empresa es obligatorio'
    })
    return
  }
  if (!/^(ftp|http|https):\/\/[^ "]+$/.test(productoEditar.url)){
    setErrores({
        ...errores,
        url : 'URL no válida'
    })
    return
  }
  if (productoEditar.descripcion.trim() === '' || productoEditar.descripcion.length < 10){
    setErrores({
        ...errores,
        empresa : 'El nombre de la empresa es obligatorio'
    })
    return
}
  console.log('Estos son los errores',errores)
  
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

  const handleImageUpload = e => {
    setCambiarImagen(false)
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = ref(firebase.storage, 'products/' + file.name);

    // Se inicia la subida
    setUploading(true);
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
        // Muestra progreso de la subida
        snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Subiendo imagen: ${progress}% terminado`);
            setProgreso(progress)
        },
        // En caso de error
        error => {
            setUploading(false);
            
        },
        // Subida finalizada correctamente
        () => {
            setUploading(false);
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                
                setProductoEditar({
                    ...productoEditar,
                    URLImage :url
                })
            });
        }
    );
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

             {!productoEditar.URLImage ? <Spinner></Spinner>:<ImagenMiniatura src={productoEditar.URLImage} alt={`imagen de ${productoEditar.nombre}`}/>}
             

             {uploading && (progreso < 100 ? <Progress1>subiendo....{progreso}..%</Progress1>:
             progreso > 10 ? <Progress>Terminado {progreso}..%</Progress> : null
             )}
            </Campo>
            <BotonMini onClick={()=>setCambiarImagen(true)}>Cambiar Imagen</BotonMini>
            {cambiarImagen && <input
                                  css={css`
                                  margin-left: 2rem;
                                  `}
                                  accept="image/*" 
                                  type='file' 
                                  value={URLImage} 
                                  onChange={handleImageUpload}/>}
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