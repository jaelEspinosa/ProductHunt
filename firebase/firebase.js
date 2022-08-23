import 'firebase/firestore'
import 'firebase/storage'

import { getFirestore } from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, updateProfile,signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getStorage } from 'firebase/storage';

import firebaseConfig from "./config";





class Firebase{
  constructor(){
    const app = initializeApp(firebaseConfig)
    this.auth = getAuth(app)
    this.db= getFirestore(app)
    this.storage = getStorage(this.app)
  }
  async signUp(nombre, email, password){
    console.log(email)
    // crea el usuario en firebase
      const newUser = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
   // al crearlo solo le pasamos email y password por tanto modificamos el profile añadiendo el nombre
      await updateProfile(this.auth.currentUser,{
        displayName: nombre
      })
    };
  // hacemos login en firebase
    async login (email, password){
     return await signInWithEmailAndPassword(this.auth, email, password)
    }
  // cerramos sesion en firebase

   async logout(){
     await signOut(this.auth)
   }
}

const firebase = new Firebase();


export default firebase


/* const app = initializeApp(firebaseConfig) */


/* const firebase = async ({nombre, email, password}) =>{
  const auth = getAuth(app);
  try {
    const createdUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(createdUser)
    return await createdUser.user.updateProfile.displayName({
      displayName: nombre
    })
  } catch (error) {
     console.log(error.code)
     console.log(error.message)    
  }
}

export default firebase; */



/* class Firebase {
  constructor() {
    initializeApp(firebaseConfig);
    this.auth = getAuth();
  }
  // registra usuario
 async registrar(nombre, email, password){
   const nuevoUsuario = await this.auth.createUserWithemailandPassword(this.auth, email, password)

  return await nuevoUsuario.user.updateProfile(nuevoUsuario.user,{
    displayName: nombre
  })
  }
} */