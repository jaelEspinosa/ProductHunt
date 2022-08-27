import styled from "@emotion/styled";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import DetallesProducto from "../components/layout/DetallesProducto";
import Layout from "../components/layout/Layout";
import Spinner from "../components/layout/Spinner";
import { FirebaseContext } from "../firebase";

const Titulo = styled.h2`
  margin-left: 3rem;
  font-style: normal;
  font-weight: 400;
  span{
    font-weight: bold;
    font-style: italic;
  }
  
`;

const Buscar = () => {
  const [cargando, setCargando]= useState(false)
  const [resultado, setResultado] = useState([])
  const { firebase, productos, setProductos} = useContext(FirebaseContext);
  const router = useRouter()
  
  const {query:{q}}=router  // con destructuring

  //const buscar = router.query.q // sin destructuring 

  // q y buscar son lo mismo

  //console.log('esto es buscar ', buscar,' y esto es q ',q)


  
  
  useEffect(()=>{
   const obtenerProductos =async ()=>{
    setCargando(true)
    const querySnapShot = await getDocs(collection(firebase.db, 'productos'));
        
   const productosDB = querySnapShot.docs.map((doc) => {
      
       return  {
         id: doc.id,
         ...doc.data()
       }
                
     });   
            
      setProductos(productosDB)
      setCargando(false)
      
  };
    obtenerProductos()
    
  },[setProductos,firebase.db])

 useEffect(()=>{
  const busqueda = q.toLowerCase();

  const productosFiltrados = productos.filter(producto =>{
     return(
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
     )

  });
  setResultado(productosFiltrados)

 },[q, productos])

  
  return (
    <div>
      <Layout >
      {cargando ? (
        <Spinner />
      ):(
        <>
        <Titulo>Resultados que contienen: <span>{q}</span></Titulo>
        <div className='listado-productos'>
          <div className='contenedor'>
           <ul className='bg-white'>

           {resultado.map ((producto, i) =>(
             <DetallesProducto key={producto.id} producto = {producto}/>
           ))}

           </ul>

          </div>
        </div>
        </>
      )}
        
      
      
      </Layout>
    </div>
  );
};

export default Buscar;
