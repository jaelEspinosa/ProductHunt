import Link from "next/link";
import React, { useContext, useState } from "react";
import Buscar from "../ui/Buscar";
import Navegacion, { MenuHamb } from "./Navegacion";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Boton from "../ui/Boton";

import { FirebaseContext } from "../../firebase";
const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;
const Logo = styled.p`
  color: var(--naranja);
  font-size: 3rem;
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
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContenedorHeader>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>

          <Buscar />

          <Navegacion />
          {!mostrarMenu && <MenuHamb onClick={() => setMostrarMenu(true)} />}
          {mostrarMenu && (
            <div css ={css`
                 margin: 2rem;
                 display: flex;
                 flex-direction: column;
            `}>
              <Link href="/">Inicio</Link>
              <Link href="/populares">Populares</Link>
              {usuario?.displayName && (
                <Link href="/nuevoProducto">Nuevo Producto</Link>
              )}
            </div>
          )}
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 2rem;
          `}
        >
          {usuario ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
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
