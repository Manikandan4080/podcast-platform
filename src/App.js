import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupPage from "./pages/SignUp.js";
import Profile from './pages/Profile.js';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice.js';
import PrivateRoutes from './components/Common/PrivateRoutes.js';
import CreatePodcastPage from './pages/CreatePodcast.js';
import Podcasts from './pages/Podcasts.js';
import PodcastDetails from './pages/PodcastDetails.js';
import CreateEpisodePage from './pages/CreateEpisodePage.js';
import ForgetPassword from './components/SignupComponents/ForgetPassword/index.js';
import EditPage from './pages/EditPage.js';


function App() {

  const dispatch = useDispatch();
  

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.error("Error fetching user data:", error);
          }
        );

        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/' element={ <SignupPage /> } />
          <Route path='/forget-password' element={<ForgetPassword/>}/>
          <Route element={ <PrivateRoutes/> }>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/edit-profile' element={<EditPage/>}/>
            <Route path='/create-podcast' element={<CreatePodcastPage/>}/>
            <Route path='/podcasts' element={<Podcasts/>}/>
            <Route path='/podcasts/:id' element={<PodcastDetails/>}/>
            <Route path='/podcasts/:id/create-new-episode' element={<CreateEpisodePage/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
