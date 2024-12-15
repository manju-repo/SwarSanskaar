import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './HomePage.module.css';
import Branches from './Branches';
import backgroundImage from '../assets/logo.png'; // Import the image in JS

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

    return (
        <>
            <div
                className={classes.backgroundContainer}
                style={{
                   marginTop:'20px', backgroundImage: `url(${backgroundImage})`, // Keep dynamic background inline
                }}
            >
                <div className={classes.overlay}></div>
                <div className={classes.contentContainer}>
                    <Branches />
                </div>
            </div>
        </>
    );
}

export default HomePage;
