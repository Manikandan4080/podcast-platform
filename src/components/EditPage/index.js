import React, { useEffect, useState } from 'react'
import Input from '../Common/Input';
import FileInput from '../Common/Input/FileInput';
import Button from '../Common/Button';
import { useDispatch, useSelector } from 'react-redux';

import "./style.css"
import { useNavigate } from 'react-router-dom';

import {ref as dbRef, set, update} from "firebase/database";
import { setUser } from '../../slices/userSlice';
import { auth, db, storage } from '../../firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref as storeRef, uploadBytes } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

const EditComponent = () => {
    const user = useSelector((state) => state.user.user);
    // const [user, setUserState] = useState(u);
    const [userName, setUserName] = useState("");
    const [userPhoto, setUserPhoto] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const profilePhotoHandle = (file) => {
        setUserPhoto(file);
    };
    const cancelUpdate = () => {
        navigate("/profile")
    }


    const handleUpdateProfile = async () => {
      setLoading(true);
      if(userName && userPhoto){

        try {
          const photoRef = storeRef(
            storage, `users/${auth.currentUser.uid}/${Date.now()}`
          );

          const photo = await uploadBytes(photoRef, userPhoto);
          const photoUrl = await getDownloadURL(photoRef);

          const updateData = {
            name:userName,
            email:auth.currentUser.email,
            uid:auth.currentUser.uid,
            displayImage:photoUrl,
          };

          auth.currentUser.photoURL=photoUrl;
    
          // const setData = await set(dbRef(db , `users/${user.uid}`), updateData);
          // db.collection("users").doc(user.uid).update(...updateData)

          await setDoc(doc(db, "users", user.uid), updateData)
          
          dispatch(setUser(updateData));
          navigate("/profile");
          setLoading(false);
        }
        catch (error) {
          toast.error(error.message);
          
          console.log(auth.currentUser);
          setLoading(false);
        }
      }
      else{
        toast.error("Enter all feilds to update");
        setLoading(false);
      }
    }
    
  return (
    <div className='edit-profile'>
      <h1>Edit Your Profile</h1>
      <Input 
        state={userName}
        setState={setUserName}
        placeholder="Enter Name"
        type='text'
        required={true}
      />
      <FileInput
        accept={"image/*"}
        id="display-image-input"
        fileHandleFnc={profilePhotoHandle}
        text={"Upload Display Image"}
       />
       <Button
            text={loading ? "Loading..." :"Cancel"}
            onClick={cancelUpdate}
            disabled={loading}
        />
       <Button
            text={loading ? "Loading..." :"Update Profile"}
            onClick={handleUpdateProfile}
            disabled={loading}
        />

    </div>
  )
}

export default EditComponent;
