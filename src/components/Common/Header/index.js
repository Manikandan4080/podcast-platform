import './style.css';
import { Link, useLocation } from 'react-router-dom';
const Header = () => {

    const location = useLocation();
    const curPath = location.pathname;
    return (
    <div className='nav'>
        <div className="gradient"></div>
        <div className='links'>
            <Link to= '/' className= {curPath === '/' ? 'active' : 'nav-links'}>Signup</Link>
            <Link to= '/podcasts' className= {curPath === '/podcasts' ? 'active' : 'nav-links'}>Podcasts</Link>
            <Link to= '/create-podcast' className= {curPath === '/create-podcast' ? 'active' : 'nav-links'}>Create a Podcast</Link>
            <Link to= '/profile' className= {curPath === '/profile' ? 'active' : 'nav-links'}>Profile</Link>
        </div>
    </div>
    );
}
export default Header;