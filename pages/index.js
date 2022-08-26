
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import {collection, getDocs} from 'firebase/firestore'
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';
import Spinner from '../components/layout/Spinner';


export default function Home() {
  /* const [productos, setProductos] = useState([]); */
  const [cargando, setCargando]= useState(false)
  const { firebase, productos, setProductos, cargarState,setCargarState } = useContext(FirebaseContext);
 
  let orderedArray= []
  
  useEffect(()=>{
   const obtenerProductos =async ()=>{
    setCargando(true)
    const querySnapShot = await getDocs(collection(firebase.db, 'productos'));
        
   const productos = querySnapShot.docs.map((doc) => {
      
       return  {
         id: doc.id,
         ...doc.data()
       }
                
     });   
     
     // eslint-disable-next-line react-hooks/exhaustive-deps
     orderedArray = productos.sort((a, b)=>{
      if(a.creado > b.creado){
        return -1;
      }
      if(a.creado < b.creado){
        return 1;
      }
   })    
      setProductos(orderedArray)
      setCargando(false)
      setCargarState(false)
  };
    obtenerProductos()
    
  },[cargarState])


 
 

  return (
    <div>
      <Layout >
      {cargando ? (
        <Spinner />
      ):(
        <div className='listado-productos'>
          <div className='contenedor'>
           <ul className='bg-white'>

           {productos.map ((producto, i) =>(
             <DetallesProducto key={producto.id} producto = {producto}/>
           ))}

           </ul>

          </div>
        </div>
      )}
        
      
      
      </Layout>
    </div>
  )
}
