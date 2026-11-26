import {useState, useEffect} from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import "./ManageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);



  const fetchStudents = async (searchValue = "") => {
    try{
        setLoading(true);
        setError("");

        const response = await api.get("/admin/students", {
            params: {
                search: searchValue
            }
        });
        setStudents(response.data.data);
    }catch(error){
        setError(error.response?.message ||
            "Failed to fetch students"
        );
    }finally{
        setLoading(false);
    }
};

useEffect(() => {
    const delaySearch = setTimeout(() => {
        fetchStudents(search);
    },400);

    return () => clearTimeout(delaySearch);
}, [search]);

const handleToggleBlock = async (studentId) =>{
    try{
        setUpdatingId(studentId);
        setError("");

        const response = await api.patch('/admin/students/${studentId}/block'
        );

        alert(response.data.message);

        await fetchStudents(search);
    }catch(error){
        setError(error.response?.data?.message || "Failed to update student status");
    }finally{
        setUpdatingId(null);
    }

};

return (
    <AdminLayout>
        <div className="manage-students">
            <h2>Manage Students</h2>
            <p>View and manage all registered students.</p>

            <input
                type="text"
                className="student-search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && (
                <p className="student-error">{error}</p>
            )}

            {loading ? (
                <p>Loading students...</p>
            ) : students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="students-table-container">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Branch</th>
                                <th>Year</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.branch || "N/A"}</td>
                                    <td>{student.currentYear || "N/A"}</td>

                                    <td>
                                        <span className={
                                            student.isBlocked
                                                ? "student-status blocked"
                                                : "student-status active"
                                        }>
                                            {student.isBlocked
                                                ? "Blocked"
                                                : "Active"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className={
                                                student.isBlocked
                                                    ? "unblock-btn"
                                                    : "block-btn"
                                            }
                                            onClick={() =>
                                                handleToggleBlock(student._id)
                                            }
                                            disabled={updatingId === student._id}
                                        >
                                            {updatingId === student._id
                                                ? "Updating..."
                                                : student.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </AdminLayout>
);

};

export default ManageStudents;