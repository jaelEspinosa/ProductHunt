import styled from '@emotion/styled'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FirebaseContext } from '../../firebase';
import {Image} from 'next/image'
import css from 'styled-jsx/css';



const Nav = styled.nav `
  padding-left:2rem;
  display: none;
  @media (min-width: 1064px){
    display:initial
  }

  a{
    font-size: 1.8rem;
    margin-left: 2rem;
    color: var(--gris2);
    font-family:'PT Sans', sans-serif;

    &:last-of-type{
      margin-right: 0;
    }

  }

`;

export const MenuHamb = styled.div`
  width: 25px;
  height: 25px;
  margin: 25px;
  background-image: url('/static/img/menu.png');
  background-size: contain;
@media (min-width: 1064px){
  display: none;
}

`;

const Navegacion = () => {
  const {usuario} = useContext(FirebaseContext)
  
  return (
    <>
    
    <Nav>
        <Link href= '/'>Inicio</Link>
        <Link href= '/populares'>Populares</Link>
      {usuario?.displayName && <Link href= '/nuevoProducto'>Nuevo Producto</Link>}  
    </Nav>
    
         
    </>
  )
}

export default Navegacion