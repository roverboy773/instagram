import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';



//material ui modal
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes = useStyles();//from material ui
  const [modalStyle] = useState(getModalStyle);//material ui
// useState
const [posts, setPosts] = useState([]);
const [open, setOpen] = useState(false);
const [username, setUsername] = useState("");
const [openSignIn, setOpenSignIn] = useState(false);
const [email, setEmail] =useState("");
const [password, setPassword] = useState("");
const [user, setUser] = useState(null);
// useEffect

useEffect(()=>{
  const unsub=  auth.onAuthStateChanged((authUser)=>{ 
     if(authUser){
      //logged in
      console.log(authUser);
      setUser(authUser);
    }
     else{
       //logged out
       setUser(null);
     }
   })

   return()=>{
     //clean up
     unsub();
   } 
},[user,username]);



useEffect(()=>{
   db.collection("posts").orderBy('timestamp','desc').onSnapshot(snapshot=>{
     setPosts(snapshot.docs.map(doc=>({
       id:doc.id,
       post:doc.data()
     })));
   })
},[]);

   const signup=(event)=>{
       event.preventDefault();
       auth.createUserWithEmailAndPassword(email,password)
       .then((authUser)=>{
        return   authUser.user.updateProfile({
           displayName:username
         }) 
       }) 
       .catch((error)=>alert(error.message));
       setOpen(false);

   }

   const signIn=(Event)=>{
      Event.preventDefault();

      auth.signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message))

      setOpenSignIn(false);

   }

  return (
    <div className="App">
        
    <Modal
    open={open}
    onClose={()=>setOpen(false)}
    >
     <div style={modalStyle} className={classes.paper}>
        <form action="submit" className="app_signup">
         <center>
           <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
         </center>  
         <Input type="text" placeholder = "Username" value={username} onChange={(e)=>setUsername(e.target.value)} required></Input>
         <Input type="email" placeholder = "Email" value={email} onChange={(e)=>setEmail(e.target.value)} required></Input>
         <Input type="password" placeholder = "Password" value={password} onChange={(e)=>setPassword(e.target.value)} required></Input>
         <Button type="submit" onClick={signup}> SignUp</Button>
       </form> 
     </div>
    </Modal>

    <Modal
    open={openSignIn}
    onClose={()=>setOpenSignIn(false)}
    >
     <div style={modalStyle} className={classes.paper}>
        <form action="submit" className="app_signup">
         <center>
           <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
         </center>  
         
         <Input type="email" placeholder = "Email" value={email} onChange={(e)=>setEmail(e.target.value)} required></Input>
         <Input type="password" placeholder = "Password" value={password} onChange={(e)=>setPassword(e.target.value)} required></Input>
         <Button type="submit" onClick={signIn}>Login</Button>
       </form>
     </div>
    </Modal>

     {/*header */}

        <div className="app_header">
          <img className="app_header_img" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"/>
          {user ? (
                    <Button onClick={()=>auth.signOut()}>LogOut</Button>
                  ):
                (
                 <div className="app_loginContainer">
                 <Button onClick={()=>setOpenSignIn(true)}>Login</Button> 
                 <Button onClick={()=>setOpen(true)}>Sign Up</Button> 
                 </div>
               )
          }   
        </div>
   <div className="warning">
   {
     user?(<p></p>)
     :(<h3>You need to Login to Upload and Comment</h3>)
   }
   </div>

     {/** posts*/}
  <div className="app_post">
       <div className="app_post_left">
       {
         posts.map(({id,post})=>(
         <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl } />
           ))
         }
       </div>
       <div className="app_post_right">
         <InstagramEmbed
             url='https://www.instagram.com/p/CJD5S5VlitF/'
             maxWidth={320}
             hideCaption={false}
             containerTagName='div'
             protocol=''
             injectScript
             onLoading={() => {}}
              onSuccess={() => {}}
             onAfterRender={() => {}}
              onFailure={() => {}}
         />
       </div>
  </div>

   
      {user?
       (<ImageUpload username={user.displayName}/>)
        :(<p></p>)
      }
        {/* <Post username="pranjal" imageurl="https://miro.medium.com/max/875/0*pAypSD1ZSCCw0NcL" caption="hello "/>
        <Post username="rahul" imageurl="https://miro.medium.com/max/875/1*3br8nBCrj7YiFfPfPePy3w.jpeg" caption=" my"/>
        <Post username="amit" imageurl="https://miro.medium.com/max/875/1*f3IuXxc44ZZFqFv-aUaQqQ.jpeg" caption="friend "/> */}
    </div>
  );
}

export default App;
