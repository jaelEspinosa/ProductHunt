import Link from "next/link";
import React, { useContext, useState } from "react";
import Buscar from "../ui/Buscar";
import Navegacion, { MenuHamb } from "./Navegacion";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Boton from "../ui/Boton";

import { FirebaseContext } from "../../firebase";
const ContenedorHeader = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid white;
  background-color: var(--gris3);
  max-width: 1200px;
  min-width: 580px;
  width: 95%;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  gap: 1rem;
  
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;
const Logo = styled.p`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto slab", serif;
  margin-right: 2rem;
  cursor: pointer;
`;

const Header = () => {
  const {usuario,firebase} = useContext(FirebaseContext)
  const [mostrarMenu, setMostrarMenu]=useState(false)  

  return (
    <header
      css={css`
        
        padding: 1rem 0;
        width: 100vw;
        
      `}
    >
      <ContenedorHeader>
      
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>

          <Buscar />

          <Navegacion />
           <MenuHamb onClick={() => setMostrarMenu(!mostrarMenu
           )} />
          {mostrarMenu && (
            <div 
                 onClick={()=>setMostrarMenu(!mostrarMenu)}
                 css ={css`
                 width: 35rem;
                 border:1px solid gray;
                 background-color: white;
                 padding: 2rem;
                 border-radius: 10px;
                 position:absolute;
                 right:0%;
                 top:1.6rem;
                 margin: 2rem;
                 display: flex;
                 flex-direction: column;
                 font-size: 2rem;
                 text-transform: uppercase;
                 animation-name: menuMostrar;
                 animation-duration: 0.2s;
                 animation-timing-function: ease-in-out;
                 @media (min-width: 620px){
                    right: 10%;
                  }
                   @media (min-width: 720px){
                    right: 1%;
                  } 
                  @media (min-width: 820px){
                    right: 1%;
                  } 
                  @media (min-width: 920px){
                    right: 1%;
                  } 
                 a{
                  margin-bottom: 2rem;
                 }
                 div{
                  margin-bottom: 2rem;
                  border: 1px solid gray;
                  width: 100%;
                  height: 1px;
                 }
                 @keyframes menuMostrar {
                  0%{
                    height: 0;
                    top:-28rem
                  }
                  100%{
                    height: inherit;
                    top:1.6rem
                  }
                 }

            `}>
              <Link href="/">Inicio</Link>
              <div></div>
              <Link href="/populares">Populares</Link>
              <div></div>
              {usuario?.displayName && (
                <>
                <Link href="/nuevoProducto">Nuevo Producto</Link>
                <div></div>
                </>
              )}
            </div>
          )}
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 1rem;
          `}
        >
          {usuario ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
                  font-size: 2.3rem;
                `}
              >
                Hola: {usuario.displayName}
              </p>
              <Boton onClick={() => firebase.logout()} bgColor="true">
                Cerrar Sesión
              </Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor="true">Login</Boton>
              </Link>
              <Link href="/crearCuenta">
                <Boton>Crear Cuenta</Boton>
              </Link>
            </>
          )}
        </div>
        
      </ContenedorHeader>
      </header>
  );
};

export default Header;
