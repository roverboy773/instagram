import React,{useState,useEffect} from 'react'
import  './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase'
import firebase from 'firebase'



function Post({postId,user,username,imageurl,caption}) {
   const [comment, setComment] = useState('');
   const [comments, setComments] = useState([]);
    const name=username.toUpperCase();

    useEffect(()=>{
        let unsub;
        if(postId)
        {
             unsub=db.collection("posts")
                     .doc(postId)
                     .collection("comments")
                     .orderBy('timestamp','desc')
                     .onSnapshot((snapshot)=>{
                         setComments(snapshot.docs.map((doc)=>doc.data()));
                     }); 
        }

        return()=>{
            unsub();
        };
    },[postId]);

     const postComment=(event)=>{
         event.preventDefault();
            db.collection("posts").doc(postId).collection("comments").add({
                text:comment,
                username:user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp()
            });
            setComment('');
     }

    return (
       
        <div className="post">
            {/* dp + username */}
            <div className="post_header">
               <Avatar className="post_avatar"
                 alt={name}
                 src="/static/images/avatar/2.jpg"
               /> 
               <h3> {username}</h3>
            </div>
            {/* image */}
                <img className="post_image" src={imageurl} alt=""/>
            {/* username + caption */}
               <h4 className="post_text"><strong>{username}</strong>:{caption}</h4>
            {/*Showing Comments  */}
               <div className="post_comments">
                   {
                       comments.map((comment)=>(
                           <p>
                               <strong>{comment.username}</strong> {comment.text}
                           </p>
                       ))
                   }
               </div>
             
          

             {/* Add Comments */}
             {user &&
             <form action="" className="post_commentBox">
                    <input className="post_input" type="text" placeholder="Add Comment" 
                    value={comment}  onChange={(e)=>setComment(e.target.value)}
                     />
                     <button className="post_button" disabled={!comment} type="submit"
                      onClick={postComment}>Post
                     </button>
             </form>
            }
        </div>
    )
}

export default Post
