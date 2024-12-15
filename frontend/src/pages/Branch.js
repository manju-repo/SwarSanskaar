import {
  Form,
  Link,
  useSearchParams,
  useActionData,
    useNavigate, NavLink
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
        const fetchBranches = async () => {
          try {
            const response = await fetch('http://localhost:5000/branches'); // Adjust your endpoint
            const data = await response.json();
            console.log(data.branches);
            setBranches(data.branches); // Assuming data is an array of branch names
            setRefresh(false);
          } catch (error) {
            console.error('Error fetching branches:', error);
          }
        };

        const fetchBranch = async () => {
          try {
            const response = await fetch(`http://localhost:5000/branches/${branchId}`); // Adjust your endpoint
            const data = await response.json();
            console.log(data.branch);
            setBranchDetails(data.branch); // Assuming data is an array of branch names

          } catch (error) {
            console.error('Error fetching branch:', error);
          }
       };

       fetchBranches();
        if(isEditMode)
          fetchBranch();
    }, [refresh, branchId, isEditMode]);

    useEffect(() => {
        console.log(branchDetails);
        if (isEditMode &&  branchDetails) {
            reset(branchDetails); // Dynamically reset form with fetched branch details
        }
    }, [isEditMode, branchDetails]);

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
       if (response.ok) {
          setRefresh(true);

          // Clear the form
            reset({
              branch_name: '',
              address: ['', '', '']});

      navigate('/branch/new');

    }
  };


   const resetHandler=()=>{
        //window.history.back();
      navigate('/branch/new');
     };

    const handleDeleteBranch=()=>{}


   return (<>
    <div style={{width:'80%',alignItems:'center'}}>
      <ul style={{ listStyleType: 'none', padding: 0 ,display:'flex', padding: 0, justifyContent: 'space-between',
                    alignItems: 'center',padding:'0 10px', flexWrap:'wrap'}}>

        {branches && branches.map((branch) => (
            <li style={{alignItems:'center',padding:'10px',fontSize:'14px', fontWeight:'Bold'}}>
            <NavLink to={{pathname:`/branch/edit/${branch._id}`}}>{branch.branch_name}</NavLink></li>
        ))}
      </ul>
    </div>
    <div className={classes.container}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <>
         <div style={{alignItems:'center', padding:'20px',fontWeight:'bold'}}>Branch Details</div>

         <div className={classes.control}>
           <label style={{fontWeight:'bold'}} htmlFor="branch_name">Branch Name</label>
           <input type="text" id="branch_name" name="branch_name"
             {...register("branch_name", { required: "Branch name is required." })}  />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
         </div>

          <div className={classes.control}>
            <label style={{fontWeight:'bold', minWidth:'240px'}} htmlFor="address">Address</label>
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
         {isEditMode? 'Update Branch' : 'Add Branch'}</button>
        </div>


     </form>
    </div>
</>
   )

}
export default Branch;