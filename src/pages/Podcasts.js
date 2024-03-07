import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import {setPodcasts} from "../slices/podcastSlice.js"
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import PodcastCard from "../components/PodcastsComponents/PodcastCard/index.js";
import Input from "../components/Common/Input/index.js"
import { getAuth } from "firebase/auth";

const Podcasts = () => {

    const [search, setSearch] = useState("");

    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
                (querySnapshot) => {
                    const podcastData = [] ;
                    querySnapshot.forEach((doc) => {
                        podcastData.push({
                            id:doc.id,
                            ...doc.data()
                        });
                    });
                    dispatch(setPodcasts(podcastData));
                },
                (error) => {
                    console.log("Error fetching podcasts",error.message)
                }
        );

        return () => {
            unsubscribe();
        }
    }, [dispatch])



    const filteredPodcast = podcasts.filter(
        (podcast) => podcast.title.trim().toLowerCase().includes(search.trim().toLowerCase())
        )

    return(
        <div>
            <Header/>
            <div className="input-forms">
                <h1>Podcasts</h1>

                <Input 
                 type={"text"}
                 state={search}
                 setState={setSearch}
                 required={false}
                 placeholder={"Search a podcast by Title"}
                />

                {filteredPodcast.length > 0 ? (
                    <div className="podcast-list" style={{marginTop:"1rem"}}>
                        {filteredPodcast.map((item) => {
                            getAuth().getUser(item.createdBy).then((userRecord) => {
                                console.log(userRecord.toJSON());
                            }).catch((error) => console.log(error.message));
                            return (
                            <PodcastCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                displayImage={item.displayImage}
                            />)
                            })}
                    </div>) : (<h3>{search ? `No podcast found with titled "${search}"` :"No podcast found"}</h3>)
                    }
            </div>
        </div>
    );
}

export default Podcasts;