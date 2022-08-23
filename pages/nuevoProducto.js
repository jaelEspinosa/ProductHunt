import { css } from "@emotion/react";
import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import { FirebaseContext } from "../firebase";

import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import {
  Campo,
  Error,
  Exito,
  Formulario,
  Inputsubmit,
  Progress,
  Progress1,
} from "../components/ui/Formulario";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import { addDoc, collection } from "firebase/firestore";
import Error404 from "../components/layout/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};

const NuevoProducto = () => {
  // States para la subida de la imagen
  const [uploading, setUploading] = useState(false);
  const [URLImage, setURLImage] = useState("");
  const [progreso, setProgreso] = useState(null)
  // hook de routing para redireccionar

  const router = useRouter();

  // context con las operaciones crud de firebase

  const { usuario, firebase } = useContext(FirebaseContext);

  /*  const [errorCorreo, setErrorCorreo] = useState('') */
  const [exito, setExito] = useState("");

  const crearProducto = async () => {
    // si el usuario no está autenticado llevo al login

    if (!usuario) {
      return router.push("/login");
    }
    //crear objeto de nuevo producto

    const producto = {
      nombre,
      empresa,
      url,
      URLImage,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado:[]
    };
    // insertarlo en la base de datos

    try {
      await addDoc(collection(firebase.db, "productos"), producto);
      setExito("Producto Guardado");
      setTimeout(() => {
        setExito("");
        Router.push("/");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleOnblur,
    handleKeyDown,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;
  const handleImageUpload = e => {
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
            console.error(error);
        },
        // Subida finalizada correctamente
        () => {
            setUploading(false);
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                console.log('Imagen disponible en:', url);
                setURLImage(url);
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
          Nuevo Producto
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
                value={nombre}
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
                value={empresa}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.empresa && <Error>{errores.empresa}</Error>}
            <Campo>
              <label htmlFor="imagen">Nombre Imagen</label>

            {!progreso ? (
              <input
                accept="image/*"
                type='file'
                id="imagen"
                name="imagen"
                value={URLImage}
                onChange={handleImageUpload}
              
              />
            ): progreso < 100 ? (<Progress1>Subiendo....{progreso} %</Progress1>):
            (
              <Progress>terminado {progreso} %</Progress>  
            )}  

            </Campo>
            {errores?.url && <Error>{errores.url}</Error>}
            <Campo>
              <label htmlFor="url">Url</label>

              <input
                type="url"
                id="url"
                placeholder="URL del producto"
                name="url"
                value={url}
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
                placeholder="Nombre descripcion"
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Campo>
            {errores?.descripcion && <Error>{errores.descripcion}</Error>}
          </fieldset>
          <Inputsubmit type="submit" value="Crear Producto" />
          </>
        ) }  
          

         
        </Formulario>
      </Layout>
    </div>
  );
};

export default NuevoProducto;
