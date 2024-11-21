import {useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import Navigation from './navigation';
import Branches from './Branches';
import classes from './root.module.css';


function RootLayout(){

return(
<>

     <Navigation/>
        <main className={classes.main}>
            <Outlet/>
        </main>
</>);
}
export default RootLayout;