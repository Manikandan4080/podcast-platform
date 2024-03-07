import React from 'react'
import Header from "../components/Common/Header/index.js"
import EditComponent from '../components/EditPage/index.js'

const EditPage = () => {
  return (
    <div>
        <Header/>
        <div className='input-forms'>
            <EditComponent/>
        </div>
    </div>
  )
}

export default EditPage;
