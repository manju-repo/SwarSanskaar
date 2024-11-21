import {useContext, useState} from 'react';
import classes from './Drawer.module.css';
import { NavLink } from 'react-router-dom';


const Drawer = ({ isOpen, onClose }) => {
  const [isAccSetting, setAccSetting] = useState(false);

const logOut=()=>{
    onClose();
}

 const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(); // Close the drawer if the backdrop itself is clicked
        }
    }
  return (<>
  {isOpen && <div className={classes.backdrop} onClick={handleBackdropClick}></div>}
    <div className={`${classes.drawer} ${isOpen ? classes.open : ''}`}>

     <div className={classes.drawerContent}>
             <button onClick={onClose} className={classes.closeButton}>X</button>
             <nav>
               <ul>
                 <li>
                    <NavLink to="/student/new"  style={{textDecoration:'none',border:'none'}}>
                    <div> New Student Registration</div></NavLink>
                 </li>
                 <li><NavLink to="/branch/new"  style={{textDecoration:'none',border:'none'}}>
                   Add Branch</NavLink>
                 </li>
                 <li><NavLink to="/feesPayment"  style={{textDecoration:'none',border:'none'}}>
                   Update Fees</NavLink>
                 </li>
                 <li><NavLink to="/studentRegistration"  style={{textDecoration:'none',border:'none'}}>
                    Waive Fees</NavLink>
                 </li>
                 <li><NavLink to="/studentRegistration"  style={{textDecoration:'none',border:'none'}}>
                    Send Reminders</NavLink>
                 </li>

                 <li>
                   <button onClick={logOut} className={classes.logoutButton}>Logout</button>
                 </li>
               </ul>
             </nav>
           </div>

    </div></>
  );
};

export default Drawer;
