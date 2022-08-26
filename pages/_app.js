import App from 'next/app'
import { useState } from 'react';
import firebase, {FirebaseContext} from '../firebase'
import useAutenticacion from '../hooks/useAutenticacion';
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Router, useRouter } from 'next/router';

const MyApp = props =>{
    const usuario = useAutenticacion();
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [cargando, setCargando] = useState(false);
    const router = useRouter()
    const [productos, setProductos] = useState([]);
    const [cargarState, setCargarState] = useState(false)

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
   
    const eliminarComentario = async (dato, id) => {
        if (!usuario) {
          return router.push("/login");
        }
        // filtramos los comentarios para 'sacar' del array el que se va a borrar
        const nuevosComentarios = comentarios.filter(
          (comentario) => comentario.creado !== dato
        );
       
        // actualizo el state
        setProducto({
          ...producto,
          comentarios: nuevosComentarios,
        });
      
        // actualizo la DB
        const docRef = doc(firebase.db, "productos", id);
        await updateDoc(docRef, {
          comentarios: nuevosComentarios,
        });
      };
      
      const editarComentario = async (creado, mensaje, id, nuevoComentario) => {
        if (!usuario) {
          return router.push("/login");
        }
        
        // mapeamos el array para aplicar cambios en un nuevo array
        const nuevosComentarios = comentarios.map(comentario => comentario.creado === creado ? {...comentario, mensaje :nuevoComentario} : comentario)
       
        // Actualizo el state
        setProducto({
          ...producto,
          comentarios: nuevosComentarios
        })
       // Actualizo la base de datos

       const docRef = doc(firebase.db, "productos", id);
       await updateDoc(docRef, {
        comentarios: nuevosComentarios,
       })
      };

      const agregarComentario = async () => {
        if (!usuario) {
          return router.push("/login");
        }
        console.log('vamos a añadir el comentario...')
      }
      const eliminarPublicacion = async (id)=>{
    
        if(!usuario){
         return router.push('/login')
        }
        // borramos de la DB
       await deleteDoc(doc(firebase.db, 'productos', id))
       
       // actualizo el state
   
       const nuevosProductos = productos.map( productoState=>productoState.id!==producto.id )
       setProductos(nuevosProductos)
       setCargarState(true)
     }
   
    const {Component, pageProps} = props;
  
    return(
 <FirebaseContext.Provider
        value={{
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
            agregarComentario,
            eliminarPublicacion,
            productos,
            setProductos,
            cargarState,
            setCargarState
            
        }}
 >
  <Component {...pageProps}/>

 </FirebaseContext.Provider>
    )
}

export default MyApp