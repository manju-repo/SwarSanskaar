import {
  Form,
  Link,
  useSearchParams,
  useActionData,
    useNavigate
} from 'react-router-dom';
import {useLocation, useParams} from 'react-router-dom';
import { useForm, setValue } from 'react-hook-form';
import classes from './branch.module.css';
import {useState, useEffect} from 'react';
import Branches from '../components/Branches';

const Branch=({onSubmit})=>{
    const [branches, setBranches] = useState([]); // State to hold branch names
    const [selectedBranch, setSelectedBranch] = useState(''); // State to store selected branchId


const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

    const { branchId } = useParams();
    const location = useLocation();
    const [branchDetails,setBranchDetails] =useState(null);
    const [refresh, setRefresh] = useState(false);
// Check if the route is for creating a new ticket
    const isNewBranch = location.pathname === '/branch/new';
    const isEditMode=location.pathname.includes('/branch/edit/');
    console.log(branchId, isEditMode);
    const navigate= useNavigate();

    useEffect(() => {
        const fetchBranch = async () => {
      try {
        const response = await fetch(`http://localhost:5000/branches/${branchId}`); // Adjust your endpoint
        const data = await response.json();
        console.log(data.branch);
        setBranchDetails(data.branch); // Assuming data is an array of branch names
        setRefresh(false);
      } catch (error) {
        console.error('Error fetching branch:', error);
      }
    };

    if(isEditMode)
      fetchBranch();
    }, [refresh]);



  const submitHandler =async (data) => {

    console.log(data);
    let response;
    if(!isEditMode){
          response= await fetch(`http://localhost:5000/branches`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
         });
     }
     else{
          response= await fetch(`http://localhost:5000/branches/${branchId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
         });
      }
      console.log(response);
      setRefresh(true);
      //navigate('/branch/new');
  };


   const resetHandler=()=>{
        window.history.back();
     };




   return (<>
       <Branches/>

<div className={classes.container}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <>

         <div className={classes.control}>
           <label htmlFor="branch_name">Branch Name</label>
           <input type="text" id="branch_name" name="branch_name"
             {...register("branch_name", { required: "Branch name is required." })}  />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
         </div>

          <div className={classes.control}>
            <label style={{minWidth:'240px'}} htmlFor="address">Address</label>
            <div style={{textAlign:'left',display:'flex',flexDirection:'column'}}>
                  <input  type="text" id="address1" name="address1" {...register("address.0")} />
                   <input type="text" id="address2" name="address2" {...register("address.1")} />
                   <input type="text" id="address3" name="address" {...register("address.2")} />
                   <div>  {errors.address && (<p className="errorMsg">{errors.address.message}</p>)}</div>
            </div>
          </div>


      </>

       <div className={classes.actions} style={{marginTop:'50px'}}>
         <button style={{ marginRight:'10px'}} className={classes.button} type="reset" onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit" >
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>
        </div>


     </form>
    </div>
</>
   )

}
export default Branch;