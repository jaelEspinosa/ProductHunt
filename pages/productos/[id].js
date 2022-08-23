/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Spinner from '../../components/layout/Spinner';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Layout from '../../components/layout/Layout';
import { Campo, Inputsubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';


// styled components

const ContenedorProducto = styled.div`
  @media(min-width: 768px){
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }

`;

const Producto = () => {
    const {usuario, firebase}=useContext(FirebaseContext)
    const [producto, setProducto] = useState({})
    const [error, setError] = useState(false)
    const [cargando, setCargando] = useState(false) 
    const router = useRouter();
    const{nombre, descripcion, URLImage, url, comentarios, creado, empresa, votos, creador,haVotado}=producto
    const [comentario, setComentario] = useState({})
    const id = router.query.id

useEffect(()=>{
    const obtenerProducto = async ()=>{
        setCargando(true)
    if(id){
        const docRef = doc(firebase.db, "productos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProducto(docSnap.data());
            setCargando(false)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setError(true)
            setCargando(false)
          }
          
    }
    
   }
obtenerProducto()

},[id])


// Administrar y validar los votos

const votarProducto = async  ()=>{
 if(!usuario){
  return router.push('/login')
 }
// Obtener y sumar un nuevo voto

const nuevoTotal = votos + 1
// verificar que el usuario actual ha votado este producto

if(haVotado.includes(usuario.uid)){
  return;
}

// guardar el ID del usuario que ha votado

const nuevoHaVotado = [...haVotado, usuario.uid]

// Actualizar en la DB
const docRef = doc(firebase.db, 'productos', id)
await updateDoc(docRef, {
  votos: nuevoTotal,
  haVotado: nuevoHaVotado
})

// Actualizar el state
setProducto({
  ...producto,
  votos:nuevoTotal,
  haVotado:nuevoHaVotado
})
}

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
              {creado && (
                <p>
                <strong>Publicado por: </strong>  {creador?.nombre} hace{' '}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                
              )}
              <p></p>
              
              <img
                css={css`
                  width: 450px;
                `}
                src={URLImage}
                alt={`imagen ${nombre}`}
              />
              <p>{descripcion}</p>
             
             {usuario &&
             <>
              <h2>Agrega tu comentario</h2>
              <form>
                <Campo>
                  <input type="text" name="mensaje" />
                </Campo>
                <Inputsubmit type="submit" value="Agrega tu comentario" />
              </form>
              </>
             
             } 
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>
              {comentarios?.map((comentario) => (
                <li key={comentario.id}>
                  <p>{comentario.nombre}</p>
                  <p>Escrito por: {comentario.usuarioNombre}</p>
                </li>
              ))}
            </div>
            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Boton>
              
              <div css = {css`
                 margin-top: 5rem;
              `}>
                <p>{votos} Votos</p>
                {usuario && <Boton
                   onClick={votarProducto}
                   >Votar</Boton>}
              </div>
            </aside>
          </ContenedorProducto>
        </div>
      )}
    </Layout>
  );
}

export default Producto