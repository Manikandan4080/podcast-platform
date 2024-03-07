import React from "react";
import Header from "../components/Common/Header/index";
import CreatePodcast from "../components/CreatePodcastComponents/CreatePodcast";

const CreatePodcastPage = () => {

    // const 

    return (
        <div>
            <Header/>
            <div className="input-forms">
                <h1>Create Podcast</h1>
                <CreatePodcast/>
            </div>
        </div>
    )
}

export default CreatePodcastPage;