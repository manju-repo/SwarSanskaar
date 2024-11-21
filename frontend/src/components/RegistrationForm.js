import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import {useLocation, useParams} from 'react-router-dom';
import { useForm, setValue } from 'react-hook-form';
import classes from './RegistrationForm.module.css';
import {useState, useEffect} from 'react';

const RegistrationForm=({onSubmit})=>{
    const [imageName, setImageName] = useState('Choose Image...');
    const [branches, setBranches] = useState([]); // State to hold branch names
    const [selectedBranch, setSelectedBranch] = useState(''); // State to store selected branchId


const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

    const { studentId } = useParams();
    const location = useLocation();
    const [studentDetails,setStudentDetails] =useState(null);
// Check if the route is for creating a new ticket
    const isNewStudent = location.pathname === '/student/new';
    const isEditMode=location.pathname.includes('/student/edit/');
    console.log(studentId, isEditMode);
    const navigate= useNavigate();

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

    const fetchStudent=async()=>
    {
     if(studentId){
      try{
           const response=await fetch(`http://localhost:5000/students/${studentId}`,{
                 method:'GET',
                 headers:{
                     'Content-Type':'application/json',
                     }
                 });

           const {student}=await response.json();
           console.log(student);
           if (student) {
              setStudentDetails(student);
            setSelectedBranch(student.branch_id || ''); // Pre-select branch if available

               reset({
                  name: student.name,
                  email: student.email,
                  phone: student.phone,
                  address:student.address,
                  monthly_fees:student.monthly_fees
               });
           }
       }
       catch(error){
           console.log(error);
       }
       }
      };
      fetchBranches();
      fetchStudent();
    }, []);



  const submitHandler =async (data) => {
    data.branch_id = selectedBranch;
    console.log(data);
    let response;
    if(!isEditMode){
          response= await fetch(`http://localhost:5000/students/register`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
         });
     }
     else{
          response= await fetch(`http://localhost:5000/students/${studentId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
         });
      }
      console.log(response);
      //navigate('/students');
      window.history.back();
  };


   const resetHandler=()=>{
        console.log("in reset");
        window.history.back();
     };


    const handleBranchChange = (event) => {
         setSelectedBranch(event.target.value); // Set selected branchId
    };

   return (
<div className={classes.container}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <>

         <div className={classes.control}>
           <label htmlFor="name">Student Name</label>
           <input type="text" id="name" name="name"
             {...register("name", { required: "Student name is required." })}  />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
         </div>

        <div className={classes.control}>
         <label htmlFor="email">Email</label>
         <input id="email" type="email" name="email"
         {...register("email", {
               //required: "Email is required.",
               pattern: {
                 value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                 message: "Email is not valid."
               }
             })}
           />
         {errors.email && <p className="errorMsg">{errors.email.message}</p>}
       </div>


         <div className={classes.control}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
               {...register("phone", { required: "Phone Number is required.",
                minLength: {
                              value: 10,
                              message: "Please enter a valid 10-digit phone number"
                            },
                maxLength: {
                              value: 10,
                              message: "Please enter a valid 10-digit phone number"
                            }
                            })}
            />
            {errors.phone && (
                 <p className="errorMsg">{errors.phone.message}</p>)}
          </div>


          <div className={classes.control}>
            <label style={{minWidth:'240px'}} htmlFor="address">Address</label>
            <div style={{textAlign:'left'}}>
                  <input  type="text" id="address1" name="address1" {...register("address.0",
                  //{ required: "Enter atleast one address field." }
                  )} />
                   <input type="text" id="address2" name="address2" {...register("address.1")} />
                   <input type="text" id="address3" name="address" {...register("address.2")} />
                   <div>  {errors.address && (<p className="errorMsg">{errors.address.message}</p>)}</div>
          </div>
          </div>

        <div className={classes.control}>
              <label style={{marginTop:'2px'}} htmlFor="branch">Branch</label>
              <select
              style={{marginTop:'7px', height:'35px'}}
                id="branch"
                name="branch" value={selectedBranch} onChange={handleBranchChange}
              >
                <option value="">Select a Branch</option>
                {branches && branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              {errors.branch && <p className="errorMsg">{errors.branch.message}</p>}
            </div>

            <div className={classes.control}>
                <label htmlFor="monthly_fees">Monthly Fees</label>
                <input
                  style={{width:'50px', height:'20px', textAlign:'right'}}
                  id="monthly_fees"
                  type="text"
                  name="monthly_fees"
                   {...register("monthly_fees", { required: "Please enter the fees for this student"})}/>
                <span style={{ marginLeft: '5px', alignSelf: 'center' }}>Rs.</span>
                {errors.monthly_fees && (
                     <p className="errorMsg">{errors.monthly_fees.message}</p>)}
              </div>
      </>

       <div style={{marginTop:'50px'}}>
         <button style={{ marginRight:'10px'}} className={classes.button} type="reset" onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit" >
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>
        </div>


     </form>
    </div>

   )

}
export default RegistrationForm;