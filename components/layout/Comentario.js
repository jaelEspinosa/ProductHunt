import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../firebase";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { useRouter } from "next/router";

import Boton from "../ui/Boton";

//Styled componets
const MenuComentarios = styled.div`
  
  height: 16rem;
  width: 20rem;
  border: 1px solid gray;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  position: absolute;
  right: 0%;
  top: 1rem;
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  font-size: 2.3rem;
  text-transform: uppercase;
  animation-name: menuMostrar;
  animation-duration: 0.2s;
  animation-timing-function: ease-in-out;
  color: gray;
  p {
    margin: 0.6rem;
  }
  p:hover {
    cursor: pointer;
  }
  @keyframes menuMostrar {
    0% {
      height: 0rem;
      top: 0rem;
      border: 1px solid transparent;
      color: transparent;
      background-color: transparent;
    }
    100% {
      height: 12rem;
      background-color: white;
      border: 1px solid gray;
      top: 1rem;
      color: gray;
    }
  }
`;

const Span = styled.span`
  font-weight: bolder;
`;
const ComentarioMensaje = styled.p`
  font-size: 2.5rem;
 @media(min-width: 768px){
  font-size:1.8rem
 }
`;
const DatosComentario = styled.p`
  font-size: 1.8rem;
  @media(min-width: 768px){
  font-size:1.6rem
 }
`;

const Comentario = ({ comentario, id }) => {
  
  const [mostrarMenuComentario, setMostrarMenuComentario] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdComentarios, setMostrarModalEdComentarios] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState(comentario.mensaje);
  const {
    firebase,
    usuario,
    producto,
    setProducto,
    error,
    setError,
    cargando,
    setCargando,
    eliminarComentario,
    editarComentario,
  } = useContext(FirebaseContext);
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
  // Funciones del menu de comentarios
  const handlehange = (e) => {
    setNuevoComentario(e.target.value);
  };
  return (
    <li>
      {mostrarModal && (
        <div
          css={css`
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 1px solid lightgray;
            width: 450px;
            height: 250px;
            text-align: center;
            font-size: 3rem;
            padding: 2rem;
            background-color: white;
            box-shadow: 5px 5px 7px gray;
            animation-name: mostrarModal;
            animation-duration: 0.3s;
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
                width: 450px;
                height: 250px;
                background-color: white;
                color: gray;
                box-shadow: 5px 5px 7px lightgray;
              }
            }
          `}
        >
          <p>¡Esto borrará el comentario!</p>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-around;
              button {
                padding: 5px 10px;
                margin-top: 25px;
                background-color: white;
                font-size: 3rem;
              }
            `}
          >
            <button
              onClick={() => {
                setMostrarModal(false);
                eliminarComentario(comentario.creado, id);
              }}
            >
              Confirmar
            </button>
            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {mostrarModalEdComentarios && (
        <div
          css={css`
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 1px solid lightgray;
            width: 500px;
            height: 300px;
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
                height: 300px;
                background-color: white;
                color: gray;
                box-shadow: 5px 5px 7px lightgray;
              }
            }
          `}
        >
          <h2>Editar Comentario</h2>
          <textarea
            css={css`
              padding: 5px;
              font-size: 2.3rem;
              width: 450px;
              height: 140px;
              resize: none;
              
            `}
            value={nuevoComentario}
            onChange={handlehange}
          ></textarea>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-around;
              button {
                padding: 5px 5px;
                margin-top: 25px;
                background-color: white;
                font-size: 2.3rem;
              }
            `}
          >
            <button
              onClick={() => {
                setMostrarModalEdComentarios(false);
                editarComentario(comentario.creado, comentario.mensaje, id, nuevoComentario);
              }}
            >
              Guardar Cambios
            </button>
            <button onClick={() => setMostrarModalEdComentarios(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {usuario?.uid === comentario.usuarioId && (
        <div>
          <div
            onClick={() => {
              setMostrarMenuComentario(true);
            }}
            css={css`
              position: absolute;
              width: 25px;
              height: 25px;
              background-image: url("/static/img/menuPuntos.png");
              background-size: contain;
              top: 10px;
              right: 10px;
            `}
          ></div>
          {mostrarMenuComentario && (
            <MenuComentarios>
              <p
                onClick={() => {
                  setMostrarMenuComentario(false);
                  setMostrarModalEdComentarios(true);
                  //editarComentario(comentario.creado, id);
                }}
              >
                👉 Editar
              </p>
              <p
                onClick={() => {
                  setMostrarModal(true);
                  //eliminarComentario(comentario.creado, id);
                  setMostrarMenuComentario(false);
                }}
              >
                🆑 Eliminar
              </p>
              <p onClick={() => setMostrarMenuComentario(false)}>❌ Cancelar</p>
            </MenuComentarios>
          )}
        </div>
      )}

      <ComentarioMensaje>{comentario.mensaje}</ComentarioMensaje>
      <div
        css={css`
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        `}
      >
        <div>
          <DatosComentario>
            Escrito por:
            <Span> {comentario.usuarioNombre}</Span>
          </DatosComentario>

          {comentario.usuarioId === creador.id ? (
            <div
              css={css`
                margin: 0.5rem 0.1rem;
                display: inline-block;
                background-color: green;
                font-size: 11px;
                padding: 0.1rem 0.5rem;
                border-radius: 5px;
                color: white;
                text-align: center;
                text-transform: uppercase;
              `}
            >
              Autor
            </div>
          ) : null}
        </div>
        <DatosComentario>
          Hace...{" "}
          <Span>
            {formatDistanceToNow(new Date(comentario.creado), {
              locale: es,
            })}
          </Span>
        </DatosComentario>
      </div>
    </li>
  );
};

export default Comentario;
