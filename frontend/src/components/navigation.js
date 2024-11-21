import {useEffect, useState, useContext, useRef} from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './navigation.css';
import Drawer from './Drawer';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Navigation() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null); // State for branch selection

    const inputRef1 = useRef();
    const inputRef2 = useRef();

    const navigate=useNavigate();
    useEffect(() => {
        const fetchBranches = async () => {
        try {
            const response = await fetch('http://localhost:5000/branches'); // Adjust your endpoint
            const data = await response.json();
            console.log(data.branches);
            setBranches(data.branches); // Assuming data is an array of branch names
          } catch (error) {
            console.error('Error fetching branches:', error);
          }
        };
    fetchBranches();
    },[]);

const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
}

  const handleSearch=(e)=>{
      e.preventDefault();
      const query1 = inputRef1.current.value; // Get the value from the input field
      navigate(`/students?query1=${query1}`);
    }

     const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

  return (
    <div style={{width:'100%'}}>
      <header>
      <ul style={{ listStyleType: 'none', padding: 0 ,display:'flex', padding: 0, justifyContent: 'space-between', alignItems: 'center'}}>

        <li>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i style={{ color: '#e44da5', marginRight: '8px' }} className="fa-solid fa-magnifying-glass"></i>
              </button>
              <input
                 ref={inputRef1}
                type="text"
                placeholder="Search student..."
                //onKeyPress={handleKeyPress}
                style={{
                  height: '30px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  padding: '0 8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </form>
      </li>

      <li><NavLink  style={{textDecoration:'none'}} to="/homepage" ><h1 className="logo">Swar Sanskaar </h1></NavLink></li>
      <li>
      <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'white', // or any background color you prefer
            borderRadius: '50%',
            fontSize: '20px', // adjust size as needed
            color: 'black', // or any text color you prefer
            border: 'none'
          }}
          onClick={toggleDrawer}>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
        </li>
      </ul>
    <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />

      </header>
    </div>
  );
}

export default Navigation;
