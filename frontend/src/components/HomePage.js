import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  classes from './HomePage.module.css';
import Branches from './Branches';

function HomePage() {
    const [branches, setBranches] = useState([]); // State to hold branch names

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
       // fetchBranches();
    }, []);

  return (<>
     <Branches/>

    <div className={classes.centeredContainer}>
    <i><img style={{width:'400px',height:'400px',marginTop:'100px'}} src="/logo.png"/></i>
    </div>
  </>);
}

export default HomePage;