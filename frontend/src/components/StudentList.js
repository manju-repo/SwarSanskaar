import React from 'react';
import classes from './StudentList.module.css';
import {useContext, useEffect, useState} from 'react';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import  '@fortawesome/fontawesome-free/css/all.css';


const StudentList=({students, branchId, updateStudentList} ) =>{
    const location = useLocation();
    const isDefaulterlist = location.pathname.includes('/student/defaulters');
    const navigate=useNavigate();
console.log(students, branchId);
 const removeStudentHandler = (id) => {
    const yn=window.confirm("Are you sure you want to delete this Student");
    if(!yn) return;
   /* const deleteFabric = async(dispatch)=>{
      try{
           const response=await fetch(
                    `http://localhost:5000/fabrics/${id}`,
                    { method:'DELETE',
                      headers:{Authorization:'Bearer '+ authCtx.token}
                    }
                  );
           if(! response.ok)
                throw new Error("Could not delete the Fabric");
           const resData = await response.json();
           console.log(resData);
           updateFabricList();
           navigate('/store/'+category);
        }
        catch(error){
            console.log(error);
            }
        }
      deleteFabric(dispatch);*/
   }

   const addStudentHandler = () => {
    //navigate(`/students/new/${branchId}`);
    navigate(-1);
   }

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
  {isDefaulterlist  ?
  (students.length===0 ?<div style={{textAlign:'center',fontWeight:'bold', marginTop:'10px'}}>There are no Defaulters currently</div>:
  <div style={{textAlign:'center',fontWeight:'bold', marginTop:'10px'}}>Defaulters List</div>):

   (<> <div>
        {students.length===0 &&  <div style={{textAlign:'center',fontWeight:'bold', marginTop:'10px'}}>There are no Students enrolled currently in this Branch</div>}
    </div>
    <div style={{textAlign:'center', marginTop:'30px',  marginBottom:'30px'}}><NavLink style={{textDecoration:'none'}} to={{pathname:`/student/new`}}>
    <button className={classes.actions}>
    Add Student</button></NavLink></div></>)
 }
      <ul className={classes.gallery}>
  { students.map((student) => (<>

     <li key={student._id} className={classes.item}>
       <div style={{display:'flex',gap:'10px',marginLeft:'50px'}}>
          <div className={classes.desc} >
            <NavLink   to={{pathname:`/student/edit/${student._id}` }} style={{color:student.active===false?'black':'#8b008b'}}>
                {student.name}
            </NavLink>
          </div>

          {(!branchId) &&
          <div className={classes.desc}>
            <NavLink   to={{pathname:`/branches/${student.branch_id}` }}  style={{color:student.active===false?'black':'#8b008b'}}>
                {student.branchName} Branch
            </NavLink>
          </div>}

          <div className={classes.actionButtons}>
            <button
              onClick={() => changeStatusHandler(student._id, student.active)}
                className={classes.trashIcon} style={{color:student.active===false?'black':'#8b008b'}}>
              {student.active===true ? 'Set as Inactive' : 'Set as Active'}
            </button>
             <button
                onClick={() => updateFeesHandler(student._id, student.active)}
                className={classes.updateFees} style={{color:student.active===false?'black':'#8b008b'}}>
                Update Fees
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
