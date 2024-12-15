import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  classes from './branches.module.css';

function Branches() {
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
        fetchBranches();
    }, []);

  return (<>
    <div className={classes.branchesContainer}>
      <ul style={{ listStyleType: 'none', padding: 0 ,display:'flex', padding: 0, justifyContent: 'space-between',
                    alignItems: 'center',padding:'0 10px', flexWrap:'wrap'}}>

        {branches && branches.map((branch) => (
        <li className={classes.branch}>
            <NavLink to={{pathname:`/branches/${branch._id}`}}>{branch.branch_name}</NavLink></li>
        ))}
      </ul>
    </div>

  </>);
}

export default Branches;