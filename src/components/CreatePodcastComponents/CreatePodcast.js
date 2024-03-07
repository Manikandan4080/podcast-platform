import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import './style.css';
import {auth, db, storage} from '../../firebase'

import Input from "../Common/Input";
import Button from "../Common/Button";
import FileInput from "../Common/Input/FileInput";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const CreatePodcast = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("");
    const [displayImage, setDisplayImage] = useState("");
    const [bannerImage, setBannerImage] = useState('');

    const [loading, setLoading] = useState(false);
    

    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const handleCreatePodcast = async() => {
        setLoading(true);
        if(title && description && displayImage && bannerImage){

            toast.info("Creating a Podcast");

            try{
                const displayImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
    
                const display = await uploadBytes(displayImageRef, displayImage);
                const displayUrl = await getDownloadURL(displayImageRef)



                const bannerImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
    
                const banner = await uploadBytes(bannerImageRef, bannerImage);
                const bannerUrl = await getDownloadURL(bannerImageRef)

                


                const podcastData = {
                    title : title,
                    description: description,
                    createdBy: auth.currentUser.uid,
                    displayImage: displayUrl,
                    bannerImage: bannerUrl
                }

                const docRef = await addDoc(collection(db, "podcasts"), podcastData);
                
                toast.success("Podcast created successfully");

                setTitle("");
                setDescription("");
                setDisplayImage(null);
                setBannerImage(null);
                setLoading(false);

                navigate(`/podcasts`);
            }
            catch(e){
                toast.error(e.message);
                setLoading(false);
            }
        }
        else{
            toast.error("Please Enter All details");
            setLoading(false);
        }
    }

    const displayImageHandle = (file) => {
        setDisplayImage(file);
      };
    
      const bannerImageHandle = (file) => {
        setBannerImage(file);
      };

      
    return (
        <div className = "create-podcast-form">
            <h3>Podcast Details</h3>

            <Input
                state={title}
                setState={setTitle}
                placeholder="Enter Title of podcast"
                type='text'
                required={true}
            />
            
            <Input
                state={description}
                setState={setDescription}
                placeholder="Enter description of podcast"
                type='textArea'
                required={true}
            />
            
            <FileInput
                accept={"image/*"}
                id="display-image-input"
                fileHandleFnc={displayImageHandle}
                text={"Upload Display Image"}
            />

            <FileInput
                accept={"image/*"}
                id="banner-image-input"
                fileHandleFnc={bannerImageHandle}
                text={"Upload Banner Image"}
            />

            <Button
                text={loading ? "Loading..." :"Create Podcast"}
                onClick={handleCreatePodcast}
                disabled={loading}
            />

        </div>
    );
}

export default CreatePodcast;