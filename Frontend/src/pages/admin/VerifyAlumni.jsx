import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import "./VerifyAlumni.css";

const VerifyAlumni = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchPendingAlumni = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/pending-alumni");

            setAlumni(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch pending alumni"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingAlumni();
    }, []);

    const handleVerification = async (alumniId, status) => {
        try {
            setUpdatingId(alumniId);
            setError("");

            const response = await api.patch(
                `/admin/alumni/${alumniId}/verification`,
                { status }
            );

            alert(response.data.message);

            await fetchPendingAlumni();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update verification"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="verify-alumni">
                <h2>Verify Alumni</h2>
                <p>Review and verify registered alumni.</p>

                {error && (
                    <p className="verify-error">{error}</p>
                )}

                {loading ? (
                    <p>Loading pending alumni...</p>
                ) : alumni.length === 0 ? (
                    <div className="no-pending-alumni">
                        <h3>All Caught Up!</h3>
                        <p>No pending alumni verification requests.</p>
                    </div>
                ) : (
                    <div className="verification-table-container">
                        <table className="verification-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Designation</th>
                                    <th>Experience</th>
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
                                        <td>{person.experience || 0} years</td>

                                        <td>
                                            <span className="pending-badge">
                                                Pending
                                            </span>
                                        </td>

                                        <td>
                                            <div className="verification-actions">
                                                <button
                                                    className="approve-btn"
                                                    disabled={updatingId === person._id}
                                                    onClick={() =>
                                                        handleVerification(
                                                            person._id,
                                                            "verified"
                                                        )
                                                    }
                                                >
                                                    {updatingId === person._id
                                                        ? "Updating..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    disabled={updatingId === person._id}
                                                    onClick={() =>
                                                        handleVerification(
                                                            person._id,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
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

export default VerifyAlumni;