/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/404";
import Spinner from "../../components/layout/Spinner";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Layout from "../../components/layout/Layout";

import Boton from "../../components/ui/Boton";
import Comentario from "../../components/layout/Comentario";



// styled components

//******************************************/
const ContenedorProducto = styled.div`
 
  /* @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  } */
`;


const Producto = () => {

  
  const [mostrarModalComentario, setMostrarModalComentario] = useState(false)
  const { 
    firebase,
    usuario,
    producto,
    setProducto,
    error,
    setError,
    cargando, 
    setCargando,
    
    
   } = useContext(FirebaseContext);

  const router = useRouter();
  
  const {
    nombre,
    descripcion,
    URLImage,
    url,
    comentarios,
    creado,
    empresa,
    votos,
    creador,
    haVotado,
  } = producto;
  const [comentario, setComentario] = useState({});
  const id = router.query.id;

  useEffect(() => {
    const obtenerProducto = async () => {
      setCargando(true);
      if (id) {
        const docRef = doc(firebase.db, "productos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducto(docSnap.data());
          setCargando(false);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setError(true);
          setCargando(false);
        }
      }
    };
    obtenerProducto();
  }, [id]);

  // Administrar y validar los votos

  const votarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    // Obtener y sumar un nuevo voto

    const nuevoTotal = votos + 1;
    // verificar que el usuario actual ha votado este producto

    if (haVotado.includes(usuario.uid)) {
      return;
    }

    // guardar el ID del usuario que ha votado

    const nuevoHaVotado = [...haVotado, usuario.uid];

    // Actualizar en la DB
    const docRef = doc(firebase.db, "productos", id);
    await updateDoc(docRef, {
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });

    // Actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });
  };
  // funciones para agregar comentarios

  const handleChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };
  const agregarComentario = async (e) => {
    
    if (!usuario) {
      return router.push("/login");
    }
    // informacion extra al comentario

    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    comentario.creado = Date.now();
    // hacer copia de comentarios y agregarlos al array

    const nuevosComentarios = [...comentarios, comentario];

    // Actualizar BD
    const docRef = doc(firebase.db, "productos", id);
    await updateDoc(docRef, {
      comentarios: nuevosComentarios,
    });

    // Actualizar State

    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setComentario({})
  };

 

  return (
    <Layout>
      {cargando ? (
        <Spinner />
      ) : error ? (
        <Error404 />
      ) : (
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
            <div css = {css `
             position:relative;
             border: 1px solid var(--gris3);
             padding: 15px;
             margin-bottom: 25px;
            `}>
            {mostrarModalComentario && (
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 1px solid lightgray;
            width: 500px;
            height: 350px;
            text-align: center;
            padding: 2rem;
            background-color: white;
            box-shadow: 5px 5px 7px gray;
            animation-name: mostrarModal;
            animation-duration: 0.1s;
            animation-timing-function: ease-in-out;

            @keyframes mostrarModal {
              0% {
                width: 0;
                height: 0;
                background-color: transparent;
                color: transparent;
                box-shadow: 5px 5px 7px transparent;
              }
              100% {
                width: 500px;
                height: 350px;
                background-color: white;
                color: gray;
                box-shadow: 5px 5px 7px lightgray;
              }
            }
          `}
        >
          <h1>Escribe tu Comentario</h1>
          <textarea
            css={css`
              padding: 15px;
              font-size: 2rem;
              width: 450px;
              height: 170px;
              font-size: 2.8rem;
            `}
            value={comentario.mensaje}
            onChange={handleChange}
            name='mensaje'
          ></textarea>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-around;
              button {
                padding: 5px 10px;
                margin-top: 25px;
                background-color: white;
                font-size: 2.8rem;
              }
            `}
          >
            <button
              onClick={() => {
                setMostrarModalComentario(false);
                agregarComentario()
              }}
            >
              Publicar
            </button>
            <button onClick={() => setMostrarModalComentario(false)}>
              Cancelar
            </button>
          </div>
        </div>
                )} 
            <div css={css`
             flex-direction: column;
               @media(min-width: 768px){
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: space-around;
               gap: 2rem;
               }
            `}>
              <div css={css`
             
              `}>
              {creado && (
                <p css ={css`
                font-size: 2.2rem;
                `}>
                  <strong>Publicado por: </strong> {creador?.nombre}, hace{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
              )}
              

              <img
                css={css`
                  width: 450px;
                  min-width: 450px;
                `}
                src={URLImage}
                alt={`imagen ${nombre}`}
              />
              </div>  
              <div css = {css`
               display: flex;
               flex-direction: column;
               justify-content: space-evenly;
              `}>
              <p
               css={css`
               font-size: 2.4rem;
               color: var(--gris2);
               `}
              >Descripción: {descripcion}</p>
              <p css = {css`
                 color:var(--gris2);
                 font-size: 2rem;
                 /* @media(min-width:768px){
                  display: none;
                 } */
              
              `}>Recomendaciones: {votos}{' '}👍</p> 
              </div>           
              </div>
              </div>
              {usuario && (
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-around;
                  gap:10rem
             
                `}
              >
                  <h3 css = {css`
                  font-size: 2.5rem;
                  width: 25rem;
                  text-align: center;
                  border-radius: 8px;
                  background-color: var(--gris3);
                      :hover{
                       cursor: pointer;
                       
                      }
                    `}
                    onClick={()=>setMostrarModalComentario(true)}
                    ><span
                     css ={css`
                       font-size: 2.5rem;
                       font-weight: bolder;
                     `}
                    >+</span>{' '} Nuevo Comentario</h3>
          
                  {/* <form onSubmit={agregarComentario}>
                    <Campo>
                      <input
                        onChange={comentarioChange}
                        type="text"
                        name="mensaje"
                      />
                    </Campo>
                    <Inputsubmit type="submit" value="Agrega tu comentario" />
                  </form> */}
                  {usuario && <h3
                  css = {css`
                  font-size: 2.5rem;
                  width: 25rem;
                  text-align: center;
                  border-radius: 8px;
                  background-color: var(--gris3);
                      :hover{
                       cursor: pointer;
                       
                      }
                /*   @media(min-width:768px){
                    display:none;
                  }  */   
                    `}
                   onClick={votarProducto}>Votar</h3>}
                </div>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios:
              </h2>
              {!comentarios?.length ? (
                <p>Aún no hay comentarios</p>
              ) : (
                <ul
                  css={css`
                    p {
                      margin-bottom: 15px;
                    }
                    li {
                      position:relative;
                      border:1px solid lightgray;
                      margin: 2rem 0.2rem;
                      padding: 2rem;
                      
                    }
                  `}
                >
                  {comentarios?.map((comentario, i) => (
                    <Comentario key = {comentario.usuarioId+i} comentario={comentario} id={id} />
                  ))}
                </ul>
              )}
            </div>
            {/* <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p>{votos} Votos</p>
                <p 
                css={css`

                   font-size: 5rem;
                   @media(max-width:768px){
                    display: none;
                   }
                   `}
                >{votos} 👍</p>
                {usuario && <Boton 
                   css={css`
                   @media(max-width:768px){
                    display: none;
                   }
                   `}
                onClick={votarProducto}>Votar</Boton>}
              </div>
            </aside> */}
          </ContenedorProducto>
        </div>
      )}
    </Layout>
  );
};

export default Producto;
