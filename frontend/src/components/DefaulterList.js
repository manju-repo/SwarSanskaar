import React from 'react';
import classes from './StudentList.module.css';
import {useContext, useEffect, useState} from 'react';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import  '@fortawesome/fontawesome-free/css/all.css';
    const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
     ];


const StudentList=({students, updateStudentList} ) =>{

    const navigate=useNavigate();


const changeStatusHandler = async (studentId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle the boolean status

    try {
      const response = await fetch(`http://localhost:5000/students/${studentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ active: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student status');
      }

      const resData = await response.json();
      console.log('Status updated:', resData);

      // Update student list after status change
      updateStudentList();

    } catch (error) {
      console.error(error.message);
    }
  };

const updateFeesHandler= async(studentId)=>{
    navigate(`/feesPayment/${studentId}`);
}
  return (<>
  {(students.length===0 ?<div style={{textAlign:'center',fontWeight:'bold', marginTop:'10px'}}>There are no Defaulters currently</div>:
  <div style={{textAlign:'center',fontWeight:'bold', marginTop:'10px'}}>Defaulters List</div>)}


      <ul className={classes.gallery}>
  { students.map((student) => (<>

     <li key={student._id} className={classes.item}>
       <div style={{display:'flex',gap:'10px',marginLeft:'50px'}}>
          <div className={classes.desc} >
            <NavLink   to={{pathname:`/feesPayment/${student._id}` }} style={{color:student.active===false?'black':'#8b008b'}}>
                {student.name}
            </NavLink>
          </div>

          <div className={classes.desc}>
            <NavLink   to={{pathname:`/branches/${student.branch_id}` }}  style={{color:student.active===false?'black':'#8b008b'}}>
                {student.branchName} Branch
            </NavLink>
          </div>

    <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left'
            }}
          >
        {student.payment_details.map((payment, index) => (<>
<div style={{display:'flex'}}>
            <div style={{
              width: '200px',
              fontWeight: 'bold',
              textAlign: 'left'
            }}>
              {months[payment.month - 1]} {/* Month name */}
            </div>
            <div style={{
              color: 'red',
              textAlign: 'center'
            }}>
              ₹ {payment.amount_due} {/* Amount due */}
            </div>
    </div>
    </>
        ))}
          </div>


        <div className={classes.actionButtons}>
            <button style={{height:'100px',marginLeft:'60px'}}
              onClick={() => changeStatusHandler(student._id, student.active)}
                 style={{color:student.active===false?'black':'#8b008b'}}>
              {student.active===true ? 'Set as Inactive' : 'Set as Active'}
            </button>
          </div>
       </div>
     </li>

 </>))}
</ul>

</>
);
}
export default StudentList;
