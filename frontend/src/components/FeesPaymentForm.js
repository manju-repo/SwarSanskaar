
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import {useLocation, useParams, NavLink} from 'react-router-dom';
import { useForm, setValue } from 'react-hook-form';
import classes from './RegistrationForm.module.css';
import {useState, useEffect} from 'react';

const FeesPaymentForm=()=>{
    const [branches, setBranches] = useState([]); // State to hold branch names
    const [selectedBranch, setSelectedBranch] = useState(''); // State to store selected branchId
    const [students, setStudents] = useState([]); // State to hold student names
    const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected studentId
    const [studentName,setStudentName]=useState('');    //state to hold student name in case of parameter studentId
    const [branchName, setBranchName]=useState('');     //state to hold branch name in case of parameter studentId
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [monthNumber, setMonthNumber] = useState(null);
    const [amountDue, setAmountDue]=useState(null);
    const [amountPaid, setAmountPaid]=useState(null);
    const [amount, setAmount]=useState(null);
    const [selectedMode, setSelectedMode]=useState(null);
    const [paymentDate, setPaymentDate]=useState(null);
    const [refresh, setRefresh] = useState(false); // State to trigger re-fetch and re-render component
    const [waivingFees, setWaivingFees] =useState(false);
    const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
     ];
    const currentMonth = new Date().getMonth() + 1;
    const startMonth = ((currentMonth - 3 + 12) % 12) || 12;
    const [formData, setFormData] = useState({
          name: '',
          email: '',
          phone: '',
          address: [],
          monthly_fees: '',
          payments:[],
          reminder_enabled:null
        });

const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

    const { studentId } = useParams();
    console.log(studentId);
    const location = useLocation();
    const isReminder = location.pathname.includes('/feesPayment/reminder');
    const navigate= useNavigate();

    useEffect(() => {

        const fetchBranchStudents = async() =>{
        if(selectedBranch==='0'){
            fetchStudents();
        }
        if (selectedBranch) {
            try{
                const response=await fetch(`http://localhost:5000/students/branch/${selectedBranch}`);
                const {students} =await response.json();
                setStudents(students);
            }
            catch (error) {
                console.error('Error fetching branch students:', error);
            }
         }
       }

      const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:5000/branches');
        const data = await response.json();
        console.log(data.branches);
        setBranches(data.branches); // Assuming data is an array of branch names
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    const fetchStudents=async()=>{
      try{
           const response=await fetch(`http://localhost:5000/students`,{
                 method:'GET',
                 headers:{
                     'Content-Type':'application/json',
                     }
                 });

           const {students}=await response.json();
           console.log(students);
           setStudents(students);
       }
       catch(error){
        console.error('Error fetching students:', error);
       }
      };

      const fetchStudent=async(student_id)=>{
            try{
                 const response=await fetch(`http://localhost:5000/students/${student_id}`);
                 const {student}=await response.json();
                 console.log(student?.reminder_enabled);
                 if(student){
                    setFormData({
                            name: student.name,
                            email: student.email,
                            phone: student.phone,
                            address: student.address,
                            monthly_fees: student.monthly_fees,
                            payments: student.payments,
                            reminder_enabled: student.reminder_enabled
                          });
                if(monthNumber){
                    setSelectedMonth(selectedMonth);
                    const paymentData = student.payments[monthNumber - 1]; // Adjusting for zero-based index
                    console.log(paymentData?.amount_due);
                    setAmountDue(paymentData?.amount_due || 0);
                    setAmountPaid(paymentData?.amount_paid || 0);
                 }
                 if (student?.branch_id) {
                    const branchResp=await fetch(`http://localhost:5000/branches/${student.branch_id}`);
                    const {branch}=await branchResp.json();
                    setBranchName(branch?.branch_name);

                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      branch: branch?.branch_name
                    }));
                 }

             }
             setRefresh(false);
             setWaivingFees(false);
             }
             catch(error){
                 console.log(error);
             }

       };
      if (studentId || selectedStudent)
         fetchStudent(studentId||selectedStudent);
      else{
          fetchBranches();
          //fetchStudents();
          if(selectedBranch) fetchBranchStudents()
          else setStudents(null);
      }

    }, [studentId, selectedBranch, refresh]);



  const submitHandler =async (data) => {
      console.log(data);
    let response;
    data.studentId = studentId || selectedStudent;
    if(isReminder){
        const response= await fetch(`http://localhost:5000/students/reminder/${data.studentId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
       });

        console.log(response);
        const resp=await response.json();
        alert(resp.message);

        navigate('/students');
    }
    else{
        data.monthNumber = monthNumber;
        data.mode=selectedMode;
        data.paymentDate=paymentDate;

        console.log(data);
          response= await fetch(`http://localhost:5000/payment/fees`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
         });

          console.log(response);
          if(response.ok)
            alert('Fees Updated');
          navigate(-1);
     }
  };


   const resetHandler=(event)=>{
    if(!selectedStudent && !studentId)
        //navigate(`/homepage`);
        navigate(-1);
    else{
        setSelectedStudent(null);
        //navigate(`/feesPayment`);
        navigate(-1);
    }
   };


    const handleBranchChange = async(event) => {
         setSelectedBranch(event.target.value); // Set selected branchId
         console.log(selectedBranch);
    };

    const handleStudentChange = (event) => {
         event.preventDefault();
         setSelectedStudent(event.target.value); // Set selected studentId
         //if(selectedStudent)
         if(isReminder)
            navigate(`/feesPayment/reminder`);
        else
        navigate(`/feesPayment/${event.target.value}`);
    };

    const setMonthData = (monthIndex) => {
        const paymentData = formData.payments[monthIndex - 1]; // Adjusting for zero-based index

        setAmountDue(paymentData?.amount_due || 0);
        setAmountPaid(paymentData?.amount_paid || 0);
    };

    const handleMonthChange = (event) => {
        setMonthNumber(event.target.selectedIndex);
        setSelectedMonth(event.target.value);
        console.log(formData.payments[event.target.selectedIndex-1]?.amount_due);
        setAmountDue(formData.payments[event.target.selectedIndex-1]?.amount_due);
        setAmountPaid(formData.payments[event.target.selectedIndex-1]?.amount_paid);
    };

    const handleModeChange = (event) => {
        setSelectedMode(event.target.value); // Set selected Mode
    };

    const handleDateChange = (event) => {
        setPaymentDate(event.target.value);
     };

    const waiveFeesHAndler = async(event) => {
        setWaivingFees(true);
        const waiveyn=window.confirm(`Waive off fees of Rs.${amountDue}/- for ${selectedMonth}`);
        if(!waiveyn) return;
        const student_id=studentId || selectedStudent;
        //const month=monthNumber+1;
        const response=await fetch(`http://localhost:5000/students/waivefees`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId:student_id,month:monthNumber})
        });
        console.log(response);
        if(response.ok){
            //alert(`Waived off fees for ${selectedMonth}`);
            setRefresh(true);
        }
    };

    const reminderHandler=async()=>{
      try{
        const new_reminder_enabled=!formData.reminder_enabled;
        const student_id=studentId || selectedStudent;
        const response= await fetch(`http://localhost:5000/students/togReminder/${student_id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({reminder_enabled:new_reminder_enabled})
        });
        if(response.ok){
            setRefresh(true);
        }
      }
      catch (err) {
          console.error('Failed to update reminder status:', err);
      }
    }

   return (<>
     <div className={classes.container}>

     <form onSubmit={handleSubmit(submitHandler)} className={classes.form} style={{ border:'2px solid grey'}}>
     <>

     {(studentId || selectedStudent) ? (
        isReminder?(<>
            <div style={{marginTop:'100px',width:'100%', display:'flex'}}>
                <label htmlFor="notificationMsg" style={{display:'block',minWidth:'200px',marginLeft:'50px',justifyContent:'center'}}> Message</label>
                <textarea  style={{overflowY:'auto'}} id="notificationMsg" type="text" name="notificationMsg" rows="4"
                {...register("notificationMsg", {
                      required: "Enter the Message",
                    })}
                />
                {errors.notificationMsg && <p className={classes.errorMsg}>{errors.notificationMsg.message}</p>}
            </div>
            <div style={{marginTop:'100px', marginBottom:'50px'}}>
             <button style={{ marginRight:'10px'}} className={classes.button}  onClick={resetHandler}>
               Cancel
             </button>
             <button className={classes.button} type="submit" >
               Send
             </button>

            </div>
        </>):(<>

        <div className={classes.control} style={{ display: "flex", justifyContent: "space-between",  border:'2px solid grey'}}>
            <div style={{width:'30%', textAlign:'left', marginTop:'20px', marginLeft:'20px'}} >
                <div style={{textAlign:'left'}}>Email:  {formData.email}</div>
                <div style={{textAlign:'left'}}>Phone:  {formData.phone}</div>
                <div style={{textAlign:'left'}}>Monthly Fees: Rs. {formData.monthly_fees}</div>

            </div>
            <div style={{width:'30%',textAlign:'left',fontSize:'20px',fontWeight:'bold'}}>
                 <p>{formData.name}</p>
            </div>
            <div style={{textAlign: "right", marginRight:'25px'}} >
                <div  style={{textAlign:'left'}}>Branch:    {formData.branch}</div>
                <pre style={{ fontSize: "16px", fontFamily: "inherit",  textAlign:'left' }}>Address:   {formData.address?.join('\n')}</pre>
            </div>
        </div>

        <div style={{width:'100%', display:'flex'}}>
       <div style={{marginTop:'40px', marginLeft:'100px', marginRight:'70px', marginBottom:'50px', textAlign:'left'}}>
                     <label style={{minWidth:'150px', display: 'inline-block'}} htmlFor="mode">Payment for:</label>
              <select
                id="month"
                name="month"
                {...register("month", { required: true })}
                value={selectedMonth} onChange={handleMonthChange}>

                <option value="">Select Month</option>
                {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
             </select>
            {errors.month && <p className="errorMsg">Please select the Month</p>}

         </div>
        {selectedMonth && (<>
         <div style={{width:'30%'}}>
            <p>Amount Due: Rs. {amountDue}/-</p>
         </div>
         <div style={{width:'30%'}}>
            <p>Amount Paid: Rs. {amountPaid}/-</p>
         </div>
         {amountDue>0 && <div style={{width:'30%'}}>
            <button style={{fontSize:'12px', marginTop:'20px'}} onClick={waiveFeesHAndler}>Waive Fees</button>
         </div>}
         </>)}
        </div>
        <input type="hidden" {...register("monthNumber")} value={monthNumber || ''} />
        <hr/>
        {selectedMonth ? (amountDue!==0) ? (<>
        <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold', marginTop:'5px', marginBottom:'5px'}}>
        Please enter Payment Details</div>
        <div style={{width:'100%', height:'40%',paddingTop:'20px'}}>
               <div style={{marginLeft:'100px', marginRight:'70px', marginBottom:'50px', textAlign:'left'}}>
              <label  style={{minWidth:'150px', display: 'inline-block'}} htmlFor="paymentDate">Date:</label>
              <input
                  style={{ width: '150px', height: '25px' }}
                  type="date"
                  id="paymentDate"
                  {...register("paymentDate", { required: true })}
                  name="paymentDate"
                  value={paymentDate}
                  onChange={handleDateChange}
                  />
            {!waivingFees && errors.paymentDate && <p className="errorMsg">Select Date of Payment</p>}

              </div>
              <div style={{marginLeft:'100px', marginRight:'70px', marginBottom:'50px', textAlign:'left'}}>
              <label  style={{minWidth:'150px', display: 'inline-block'}} htmlFor="amount">Amount:</label>
              Rs <input style={{width:'50px',height:'15px', textAlign:'right'}} type="text" id="amount"
              {...register("amount", { required: "Enter Amount",
               validate: {
                       notZero: (value) => Number(value) > 0 || "Amount must be greater than zero",
                       isNumber: (value) => !isNaN(value) || "Amount must be a valid number",
                       lessThanOrEqualToAmountDue: (value) =>
                            Number(value) <= amountDue || `Amount cannot exceed Rs. ${amountDue}`,
                     }
               })}
              name="amount"/>
            {!waivingFees && errors.amount && <p className="errorMsg">{errors.amount.message}</p>}

              </div>
              <div style={{marginLeft:'100px', marginRight:'70px', marginBottom:'50px', textAlign:'left'}}>
              <label style={{minWidth:'150px', display: 'inline-block'}} htmlFor="mode">Mode of Payment:</label>
             <select
                id="mode"
                {...register("mode", { required: true })}
                name="mode" value={selectedMode} onChange={handleModeChange}>

                <option value="">Select Mode</option>
                  <option  value="cash">
                    Cash
                  </option>
                  <option  value="upi">
                   UPI
                  </option>
                  <option  value="card">
                    Card
                  </option>
              </select>
            {!waivingFees && errors.mode && <p className="errorMsg">Select Mode of Payment</p>}
              </div>
        </div>
        </>
        ):
        <div>No Dues for this month</div>:
//Month not selected show transactions of previous 3 months
        <div style={{marginLeft:'100px',width:'100%'}}>
        <div style={{ display: 'flex', marginBottom:'10px',fontWeight:'bold'}}>
            <div style={{marginRight:'40px', minWidth:'80px' }}>Month</div>
            <div style={{marginRight:'50px', minWidth:'55px'}}>Amount Due</div>
            <div style={{marginRight:'50px', minWidth:'55px'}}>Amount Paid</div>
            <div style={{marginRight:'50px', minWidth:'55px'}}>Status</div></div>
             {formData?.payments
                ?.filter(payment => {
                  // Include payments for the last three months, wrapping around the year if necessary
                  return (
                    (payment.month > startMonth && payment.month <= currentMonth) ||
                    (startMonth > currentMonth && (payment.month >= startMonth || payment.month <= currentMonth))
                  );
                })
                ?.map(payment => (
                  <div style={{ display: 'flex', color:(payment.amount_paid!==payment.amount_due && payment.amount_due!==0) ? 'red':'black' }}>
                    <div style={{ marginRight: '40px',minWidth:'80px', textAlign:'left' }}>{months[payment.month - 1]}</div>
                    <span>Rs.</span>
                    <div style={{ marginRight: '70px',minWidth:'55px', textAlign:'right' }}>{payment.amount_due}/-</div>
                    <span>Rs.</span>
                    <div style={{ marginRight: '70px',minWidth:'55px', textAlign:'right' }}>{payment.amount_paid}/-</div>
                   { /*payment.amount_paid-payment.amount_due===payment.amount_paid?
                   payment.amount_paid===0?
                    <div style={{marginLeft:'10px', textAlign:'left'}}>Waived Off</div>:
                    <div style={{marginLeft:'10px', textAlign:'left'}}> Paid</div>:
                    <div style={{marginLeft:'10px', textAlign:'left'}}> Pending</div>*/}

                    <div style={{marginLeft:'10px', textAlign:'left'}}>{payment.status}</div>

                  </div>
                ))}
         </div>
        }
        </>)
      ):(
        <div style={{display:'flex', marginTop:'50px',marginBottom:'50px', marginLeft:'100px', width:'80%'}}>
        <div className={classes.control}>
          <label style={{width:'100px'}} htmlFor="branch">Branch</label>
          <select
            id="branch"
            name="branch" value={selectedBranch} onChange={handleBranchChange}>

            <option value="">Select a Branch</option>
            <option key='0' value='0'>
                All Branches
             </option>
            {branches && branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          {errors.branch && <p className="errorMsg">{errors.branch.message}</p>}
        </div>

        <div className={classes.control}>
          <label  style={{width:'100px'}} htmlFor="student">Student</label>
          <select
            id="student"
            name="student" value={selectedStudent} onChange={handleStudentChange}>

            <option value="">Select a Student</option>
            {students && students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
          { errors.branch && <p className="errorMsg">{errors.student.message}</p>}
        </div>
        </div>
      )}
      </>
    {
        (selectedMonth && amountDue!==0 && (studentId || selectedStudent)) &&
       (<div style={{marginTop:'100px', marginBottom:'50px'}}>
         <button type="button" style={{ marginRight:'10px'}} className={classes.button}  onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit" >
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>

        </div>)}


    <div style={{ display: "flex", justifyContent: "space-between",
    marginTop:'30px',marginBottom:'30px', marginRight:'10px', marginLeft:'10px'}}>

        {!isReminder && (studentId || selectedStudent) && (formData.reminder_enabled ?
             (<><div><NavLink style={{textDecoration:'none'}} onClick={reminderHandler}>
                  Disable Reminders
             </NavLink></div>
             <div><NavLink style={{textDecoration:'none'}}
                     to={`/feesPayment/reminder/${selectedStudent || studentId}`}>Send Reminder
             </NavLink></div></>)
            :
                  <div><NavLink style={{textDecoration:'none'}}
                  onClick={reminderHandler}>Enable Reminders </NavLink></div>

        )}

     </div>
     </form>
    </div>
    <div style={{textAlign:'right',marginRight:'150px'}}>
         <NavLink style={{textDecoration:'none'}} onClick={resetHandler}><span>Back</span></NavLink></div>
   </>)

}
export default FeesPaymentForm