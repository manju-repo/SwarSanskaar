import {useContext, useState} from 'react';
import classes from './Drawer.module.css';
import { NavLink } from 'react-router-dom';


const Drawer = ({ isOpen, onClose }) => {
  const [isAccSetting, setAccSetting] = useState(false);
const [isStudentSubMenuOpen, setStudentSubMenuOpen] = useState(false);
const [isBranchSubMenuOpen, setBranchSubMenuOpen] = useState(false);
const [isFeesSubMenuOpen, setFeesSubMenuOpen] = useState(false);

  const handleStudentMenuToggle = () => {
    setStudentSubMenuOpen((prevState) => !prevState);
  };

const handleBranchMenuToggle = () => {
    setBranchSubMenuOpen((prevState) => !prevState);
  };

  const handleFeesMenuToggle = () => {
      setFeesSubMenuOpen((prevState) => !prevState);
    };

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
                    <div onClick={handleStudentMenuToggle} className={classes.menuItem} style={{ cursor: 'pointer' }}>
                        Students {isStudentSubMenuOpen ? (<span><i class="fa-solid fa-caret-down"></i></span>) : (<span><i class="fa-solid fa-caret-right"></i></span>)}
                    </div>
                        {isStudentSubMenuOpen && (
                          <ul>
                            <li className={classes.subMenu}>
                              <NavLink
                                to="/student/new"
                                style={{ textDecoration: 'none', border: 'none' }}>
                                New Student Registration
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/student/defaulters"
                                style={{ textDecoration: 'none', border: 'none' }}>
                                Defaulter Student List
                              </NavLink>
                            </li>
                          </ul>
                        )}
                 </li>

                 <li>
                 <div onClick={handleBranchMenuToggle} className={classes.menuItem} style={{ cursor: 'pointer' }}>
                   Branch {isBranchSubMenuOpen ? (<span><i class="fa-solid fa-caret-down"></i></span>) : (<span><i class="fa-solid fa-caret-right"></i></span>)}
                 </div>
                 {isBranchSubMenuOpen && (
                   <ul className={classes.subMenu}>
                    <li><NavLink to="/branches"  style={{textDecoration:'none',border:'none'}}>
                      View Branches</NavLink>
                    </li>
                     <li><NavLink to="/branch/new"  style={{textDecoration:'none',border:'none'}}>
                       Add/Edit Branch Details</NavLink>
                     </li>
                   </ul>
                 )}
                 </li>

                 <li>
                  <div onClick={handleFeesMenuToggle} className={classes.menuItem} style={{ cursor: 'pointer' }}>
                    Fees {isFeesSubMenuOpen ? (<span><i class="fa-solid fa-caret-down"></i></span>) : (<span><i class="fa-solid fa-caret-right"></i></span>)}
                  </div>
                  {isFeesSubMenuOpen && (
                  <ul className={classes.subMenu}>
                     <li><NavLink to="/feesPayment"  style={{textDecoration:'none',border:'none'}}>
                       Update Fees</NavLink>
                     </li>
                     <li><NavLink to="/feesPayment"  style={{textDecoration:'none',border:'none'}}>
                        Waive Fees</NavLink>
                     </li>

                 </ul>
                 )}
                 </li>
                 <li><NavLink to="/feesPayment/reminder"  style={{textDecoration:'none',border:'none'}}>
                     Send Reminders</NavLink>
                 </li>
             </ul>
             </nav>
           </div>

    </div></>
  );
};

export default Drawer;
