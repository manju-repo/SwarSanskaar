import { useEffect, useState, useCallback} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import StudentList from '../components/StudentList';
import {NavLink, useNavigate} from 'react-router-dom';

function BranchStudents() {
    const [students, setStudents] = useState([]);
    const [branchName, setBranchName] = useState();
    const {branchId} = useParams();

    const fetchStudents=useCallback(async()=>{
        try{

            const response = await fetch(`http://localhost:5000/students/branch/${branchId}`);
            const {students} = await response.json();
            console.log(students);
            setStudents(students);
          }catch(error){
            console.log(error.message);
           }
        },[branchId]);

    const fetchBranchName=useCallback(async()=>{
     try{
        const response = await fetch(`http://localhost:5000/branches/${branchId}`);
        const {branch} = await response.json();
        setBranchName(branch.branch_name);

     }catch(error){
        console.log(error.message);
       }
    },[branchId]);
    useEffect(() => {
        fetchBranchName();
        fetchStudents();
  },[branchId]);




    return (
    <>
    <div style={{textAlign:'left', fontSize:'15px', marginLeft:'5px'}}>
        <NavLink style={{textDecoration:'none'}} to="/homepage"><span>&#60; </span>
        All Branches</NavLink></div>
    <div style={{textAlign:'center',fontWeight:'bold', fontSize:'20px', marginBottom:'40px'}}>
    <NavLink style={{textDecoration:'none'}} to="/">{branchName} <span>Branch</span></NavLink></div>
    {students && <StudentList students={students} branchId={branchId} updateStudentList={fetchStudents}/>}</>);
  };

    export default BranchStudents;



