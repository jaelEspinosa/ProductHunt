import styled from "@emotion/styled";
import React, { useContext, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { deleteDoc, doc } from "firebase/firestore";



const Imagen = styled.img`
  width: 300px;
  min-width: 250px;
  max-width: 350px;
`;

const Producto = styled.li`
  position:relative;
  padding: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
`;
const EliminarPubli = styled.div`
position: absolute;
top: 20px;
right: 20px;
font: 3rem;
:hover{
  cursor: pointer;
}
`
const DescripcionProducto = styled.div`
  flex: 0 1 1000px;
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 3fr;
    column-gap: 2rem;
  }
`;
const Comentarios = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    border: 1px solid #e1e1e1;
    padding: 0.3rem 1rem;
    margin-right: 2rem;
  }
  img {
    width: 2rem;
    margin-right: 2rem;
  }
  p {
    font-size: 2rem;
    margin-right: 1rem;
    font-weight: 700;
    &:last-of-type {
      margin: 0;
    }
  }
`;
const Votos = styled.div`
  margin-left: 1rem;
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #e1e1e1;
  padding: 0.5rem 3rem;
  div {
    font-size: 1.8rem;
  }
  p {
    
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
`;

const Titulo = styled.a`
  font-size: 2.5rem;
  font-weight: bold;
  :hover {
    cursor: pointer;
  }
`;
const TextoDescripcion = styled.p`
  font-size: 2.5rem;
  margin: 0;
  color: #888;
`;

const ModalEliminarPubli = styled.div`
  text-align: center;
  background-color: white;
  width: 460px;
  height: 200px;
  border: 1px solid var(--gris3);
  border-radius: 5px;
  box-shadow: 8px 8px 10px var(--gris2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  animation-name: mostrar;
  animation-duration: 0.1s;
  animation-timing-function: ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
   div{
    display: flex;
    justify-content: space-around;
    align-items: center;
   }
   button{
    font-size: 2.5rem;
    background-color: white;
   }
  @keyframes mostrar {
    0%{
      background-color: transparent;
      color: transparent;
      width: 0;
      height: 0;
    }
    100%{
      background-color: white;
      color: initial;
      width: 460px;
      height: 200px;
    }
  }
`

const DetallesProducto = ({ producto }) => {
  const {
    id,
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    URLImage,
    votos,
    creador
  } = producto;
  const {usuario, eliminarPublicacion} = useContext(FirebaseContext)
  const [mostrarModalEliminarPubli, setMostrarModalEliminarPubli] = useState(false)
  const router = useRouter()


  return (
    <Producto>
      {creador?.id === usuario?.uid && <EliminarPubli onClick={()=>setMostrarModalEliminarPubli(true)}>Eliminar</EliminarPubli>}
      {mostrarModalEliminarPubli && <ModalEliminarPubli>

         <h2>Esto eliminará la publicación</h2>

         <div>
          <button
              onClick={()=>{
                setMostrarModalEliminarPubli(false)
                eliminarPublicacion(producto.id)
              }}
                 >Eliminar</button>
          <button onClick={()=>setMostrarModalEliminarPubli(false)}>cancelar</button>
         </div>

      </ModalEliminarPubli>}
      <DescripcionProducto>
        <div>
          <Imagen src={URLImage} alt="imagen" />
        </div>
        <div>
          <Link href="/productos/[id]" as={`/productos/${id}`}>
            <Titulo>{nombre}</Titulo>
          </Link>
          <TextoDescripcion>{descripcion}</TextoDescripcion>

          <div>
            <Comentarios>
              <img src="/static/img/comentario.png" alt="logo" />
              {comentarios?.length === 1 ? (
                <p>{comentarios?.length} Comentario</p>
              ) : (
                <p>{comentarios?.length} comentarios</p>
              )}

              <Votos>
                <p> {' '} Recomendaciones: {'  '}</p>
                <p css={css`padding-left:10px;`}>
                  {votos}
                  {" 👍"}
                </p>
              </Votos>
            </Comentarios>
          </div>
         {creado && <p>
            publicado hace :{" "}
            {formatDistanceToNow(new Date(creado), { locale: es })}
          </p>}
        </div>
      </DescripcionProducto>
    </Producto>
  );
};

export default DetallesProducto;
