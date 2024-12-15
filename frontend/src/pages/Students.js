import { useEffect, useState, useCallback} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import StudentList from '../components/StudentList';
import { NavLink } from 'react-router-dom';
function Students() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [searchItems,setSearchItems] =useState([]);
    const [searchParams] = useSearchParams();
    const query1 = searchParams.get('query1');
    //const {branchId} = useParams();

    const fetchStudents=useCallback(async()=>{
        try{

            const response = await fetch(`http://localhost:5000/students`);
            const {students} = await response.json();
            const studentsWithBranches = await Promise.all(
            students.map(async (student) => {
                if(student.branch_id) {
                    try {
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
            setFilteredStudents(studentsWithBranches);

            let currentStudents = studentsWithBranches;

            if(students && query1){
                const keywords = query1.split(/\s+/);
                currentStudents = currentStudents.filter(item =>
                keywords.every(keyword => item?.name?.toLowerCase().includes(keyword.toLowerCase()))
                );
            }
            setFilteredStudents(currentStudents);
            console.log(currentStudents);
          }catch(error){
            console.log(error.message);
           }
        },[query1]);

    useEffect(() => {
        fetchStudents();
  },[query1]);




    return (
    <>
    <NavLink style={{marginLeft:'50px', textDecoration:'none'}} className="fa fa-arrow-left" aria-hidden="true" to="/homepage"></NavLink>

    {filteredStudents && <StudentList students={filteredStudents}  updateStudentList={fetchStudents}/>}</>);
  };

    export default Students;



