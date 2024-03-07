import React, { useState } from 'react'
import Header from '../components/Common/Header/index.js';
import Input from '../components/Common/Input/index.js';
import FileInput from '../components/Common/Input/FileInput.js';
import Button from '../components/Common/Button/index.js';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase.js';
import { addDoc, collection } from 'firebase/firestore';

function CreateEpisodePage() {
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [audio, setAudio] = useState(null);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const audioFileHandle = (file) => {
        setAudio(file)
    }

    const createEpisode = async () => {
        setLoading(true);
        if((title,desc,audio,id)){
            toast.info("Creating Episode");
            try{
                const audioRef = ref(
                    storage,
                    `podcasts-episodes/${auth.currentUser.uid}/${Date.now()}`
                );

                await uploadBytes(audioRef, audio);
                const audioUrl = await getDownloadURL(audioRef);

                const episodeData = {
                    title:title,
                    description: desc,
                    audio:audioUrl,
                }

                await addDoc(
                    collection(db, "podcasts", id, "episodes"),
                    episodeData
                );

                toast.success("Episode created Successfully");
                setTitle("");
                setDesc("")
                setAudio(null);

                setLoading(false);

                navigate(`/podcasts/${id}`);

            }
            catch(error){
                toast.error(error.message);
                setLoading(false);
            }
        }
        else{
            toast.error("Fill out all feilds");
            setLoading(false);
        }
    }

  return (
    <div>
        <Header/>
        <div className='input-forms'>
            <h1>Crate an episode</h1>

            <Input
                state={title}
                setState={setTitle}
                placeholder="Title of episode"
                type='text'
                required={true}
            />

            <Input
                state={desc}
                setState={setDesc}
                placeholder="Description of episode"
                type='email'
                required={true}
            />
            
            <FileInput
                accept={"audio/*"}
                id="audio-file"
                fileHandleFnc={audioFileHandle}
                text={"Upload Your audio file"}
            />
            
            <Button
                 text={loading ? "Creating ..." : "Create episode"}
                 onClick={createEpisode}
                 disabled={loading}
            />
        </div>
    </div>
  )
}

export default CreateEpisodePage;
