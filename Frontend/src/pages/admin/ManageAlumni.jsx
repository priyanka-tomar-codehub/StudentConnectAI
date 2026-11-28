import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import "./ManageAlumni.css";

const ManageAlumni = () => {
    const [alumni, setAlumni] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchAlumni = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/alumni", {
                params: { search: searchValue }
            });

            setAlumni(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch alumni"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchAlumni(search);
        }, 400);

        return () => clearTimeout(delaySearch);
    }, [search]);

    const handleToggleBlock = async (alumniId) => {
        try {
            setUpdatingId(alumniId);
            setError("");

            const response = await api.patch(
                `/admin/alumni/${alumniId}/block`
            );

            alert(response.data.message);

            await fetchAlumni(search);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update alumni status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="manage-alumni">
                <h2>Manage Alumni</h2>
                <p>View and manage all registered alumni.</p>

                <input
                    type="text"
                    className="alumni-search"
                    placeholder="Search by name, email, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {error && (
                    <p className="alumni-error">{error}</p>
                )}

                {loading ? (
                    <p>Loading alumni...</p>
                ) : alumni.length === 0 ? (
                    <p>No alumni found.</p>
                ) : (
                    <div className="alumni-table-container">
                        <table className="alumni-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Designation</th>
                                    <th>Verification</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {alumni.map((person) => (
                                    <tr key={person._id}>
                                        <td>{person.name}</td>
                                        <td>{person.email}</td>
                                        <td>{person.company || "N/A"}</td>
                                        <td>{person.designation || "N/A"}</td>

                                        <td>
                                            <span className={
                                                person.isVerified
                                                    ? "alumni-verification verified"
                                                    : "alumni-verification pending"
                                            }>
                                                {person.isVerified
                                                    ? "Verified"
                                                    : "Pending"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={
                                                person.isBlocked
                                                    ? "alumni-status blocked"
                                                    : "alumni-status active"
                                            }>
                                                {person.isBlocked
                                                    ? "Blocked"
                                                    : "Active"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className={
                                                    person.isBlocked
                                                        ? "alumni-unblock-btn"
                                                        : "alumni-block-btn"
                                                }
                                                onClick={() =>
                                                    handleToggleBlock(person._id)
                                                }
                                                disabled={updatingId === person._id}
                                            >
                                                {updatingId === person._id
                                                    ? "Updating..."
                                                    : person.isBlocked
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

export default ManageAlumni;