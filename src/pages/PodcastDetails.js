import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";

import Button from "../components/Common/Button/index.js"
import EpisodeCard from "../components/PodcastsComponents/EpisodeCard/index.js";
import AudioPlayer from "../components/PodcastsComponents/AudioPlayer/index.js";
import Loader from "../components/Common/Loader/index.js";

const PodcastDetails = () => {
    const {id} = useParams();
    const [selectedPodcast, setSelectedPodcast] = useState({});
    const [episodes, setEpisodes] = useState([]);

    const [playing, setPlaying] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(id){
            getData()
        }
    },[id]);

    useEffect (() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts", id, "episodes")),
               (querySnap) => {
                const episodesData = [];

                querySnap.forEach((document) => {
                    episodesData.push({id:document.id, ...document.data()});
                });
                setEpisodes(episodesData);
               },
               (error) => {
                console.log("Error");
               }
        );

        return () => {
            unsubscribe();
        }
    },[id]);




    const getData = async() => {
        try{
            const docRef = doc(db, "podcasts", id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                console.log("data", docSnap.data());
                setSelectedPodcast({id:id, ...docSnap.data()});
            }
            else{
                toast.error("No such podcast");
                navigate("/podcasts");
            }
        }
        catch(e){
            toast.error(e.message);
            navigate("/podcasts");
        }
    }

    const createAnEpisode = () => {
        navigate(`/podcasts/${id}/create-new-episode`)
    }

    return (
        <div>
            <Header/>

            <div className="input-forms">
                {selectedPodcast.id && (
                    <>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                            <h1 className="podcast-detail-title">{selectedPodcast.title}</h1>

                            {selectedPodcast.createdBy == auth.currentUser.uid && (
                                <Button
                                    text={"Create an episode"}
                                    onClick={createAnEpisode}
                                    width={"200px"}
                                />
                            )
                            }
                        </div>
                        <div className="podcast-detail-banner-image">
                            <img src={selectedPodcast.bannerImage}/>
                        </div>
                        <p style={{marginTop:"20px"}}>{selectedPodcast.description}</p>

                        <h1 className="podcast-detail-title" style={{marginTop:"20px"}}>Episodes</h1>

                        {
                            episodes.length > 0 ? 
                            (
                                <div className="episodes-list">
                                    {
                                        episodes.map((episode, index) => {
                                            return <EpisodeCard
                                                        key={episode.id}
                                                        index={index+1}
                                                        title={episode.title}
                                                        description={episode.description}
                                                        audio={episode.audio}
                                                        onClick= {(file) => setPlaying(file)}
                                                   />
                                        })
                                    }
                                </div>
                            ):
                            (<h3>No Episodes</h3>)
                        }
                    </>
                )}
            </div>

            {
                playing && <AudioPlayer audioSrc={playing} displayImage = {selectedPodcast.displayImage}/>
            }
        </div>
    );
}

export default PodcastDetails;