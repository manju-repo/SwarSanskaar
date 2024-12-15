import { useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import DefaulterList from '../components/DefaulterList';
import { NavLink } from 'react-router-dom';

function Defaulters() {
    const [students, setStudents] = useState([]);
const [searchParams] = useSearchParams();
    const query1 = searchParams.get('query1');

    const fetchStudents=async()=>{
        try{

            const response = await fetch(`http://localhost:5000/students/defaulters`);
            const {students} = await response.json();
            const studentsWithBranches = await Promise.all(
            students.map(async (student) => {
                if(student.branch_id) {
                    try {
                        console.log(student.branch_id);
                        const branchResponse = await fetch(`http://localhost:5000/branches/${student.branch_id}`);
                        const {branch} = await branchResponse.json();
                        console.log(branch.branch_name);
                        return { ...student, branchName: branch.branch_name }; // Add branchName to student
                    }
                    catch (error) {
                        console.error(`Failed to fetch branch for student ${student.name}: ${error.message}`);
                        return { ...student, branchName: 'Unknown' }; // Default name if fetch fails
                    }
                }
                return { ...student, branchName: 'No Branch' }; // Default for no branchId
            }));
            console.log(studentsWithBranches);
            setStudents(studentsWithBranches);

            let currentStudents = studentsWithBranches;

            if(students && query1){
                const keywords = query1.split(/\s+/);
                currentStudents = currentStudents.filter(item =>
                keywords.every(keyword => item?.name?.toLowerCase().includes(keyword.toLowerCase()))
                );
            }
            setStudents(currentStudents);

          }catch(error){
            console.log(error.message);
           }
        }

    useEffect(() => {
        fetchStudents();
  },[query1]);




    return (
    <>
    <NavLink style={{marginLeft:'50px', textDecoration:'none'}} className="fa fa-arrow-left" aria-hidden="true" to="/homepage"></NavLink>

    {students && <DefaulterList students={students}  updateStudentList={fetchStudents}/>}
    </>);
  };

    export default Defaulters;



