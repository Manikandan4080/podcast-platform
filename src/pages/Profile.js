import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import Botton from "../components/Common/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";

import Loader from "../components/Common/Loader";
import { CgProfile } from "react-icons/cg";

import { collection, onSnapshot, query } from "firebase/firestore";
import PodcastCard from "../components/PodcastsComponents/PodcastCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const user = useSelector(state => state.user.user);

    const [podcasts, setPodcasts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    console.log(user);
    console.log(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
                (querySnapshot => {
                    const podcastData = [];
                    querySnapshot.forEach((podcast) => {
                        podcastData.push({
                            id:podcast.id,
                            ...podcast.data()
                        })
                    })

                    setPodcasts(podcastData);
                }),
                (error) => {
                    console.log("Error fetching podcasts",error.message)
                }
        );

        return () => {
            unsubscribe();
        }
    },[])

    const myPodcast = podcasts.filter(
            (podcast) => podcast.createdBy.trim() == user.uid.trim()
    );

    if(!user){
        return <Loader/>;
    }

    const handleLogout = () =>{
        signOut(auth)
            .then(() => {
                toast.success("Logged Out Successfully");
                // navigate('/');
            }).catch((error) => {
                console.log(error);
            });
    }
    const handleEdit = () => {
        navigate('/edit-profile')
    }
    return(
        <div className="profile">
            <Header/>
            <div className="profile-page">
                <div className="profile-content">
                    <h1>Profile</h1>
                    <div className="edit-logout-section">
                        {user.displayImage ? <img style={{borderRadius:"100%"}} className="profile-logo profile-img" src={user.displayImage}/>: <CgProfile className="profile-logo"/>}

                        <div style={{width:"40%"}}>
                            <h3>Name : {user.name}</h3>
                            <br/>
                            <h4>Email : {user.email}</h4>
                        </div>

                        <div style={{display:"flex", gap:"2rem"}}>
                            <Botton text={`Edit`} onClick={handleEdit} width={"fit-content"}/>
                            <Botton text={"Logout"} onClick={handleLogout} width={"fit-content"}/>
                        </div>
                    </div>

                    <h3>Your podcasts</h3>

                    {
                        myPodcast.length > 0 ? 
                            <div className="my-podcast-list">
                                {
                                    myPodcast.map(podcast => (
                                        <PodcastCard
                                            id={podcast.id}
                                            title={podcast.title}
                                            displayImage={podcast.displayImage}
                                        />
                                    ))
                                }
                            </div> 
                        : 
                        <h4>No podcasts</h4>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;