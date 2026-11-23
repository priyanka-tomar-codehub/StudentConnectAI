import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAlumni: 0,
        totalBookings: 0,
        pendingVerifications: 0,
        verifiedAlumni: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/admin/dashboard");

                setStats(response.data.data);
            } catch (error) {
                console.error("Dashboard Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dashboardCards = [
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: "🎓"
        },
        {
            title: "Total Alumni",
            value: stats.totalAlumni,
            icon: "👨‍💼"
        },
        {
            title: "Total Bookings",
            value: stats.totalBookings,
            icon: "📅"
        },
        {
            title: "Pending Verifications",
            value: stats.pendingVerifications,
            icon: "⏳"
        },
        {
            title: "Verified Alumni",
            value: stats.verifiedAlumni,
            icon: "✅"
        }
    ];

    return (
        <AdminLayout>
            <h2>Welcome to Admin Dashboard</h2>

            <p>Manage your SeniorConnect AI platform here.</p>

            {loading ? (
                <p>Loading dashboard data...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginTop: "25px"
                }}>
                    {dashboardCards.map((card) => (
                        <div
                            key={card.title}
                            style={{
                                background: "white",
                                padding: "25px",
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                            }}
                        >
                            <h3>{card.icon} {card.title}</h3>

                            <h2 style={{
                                fontSize: "30px",
                                color: "#2563eb"
                            }}>
                                {card.value}
                            </h2>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;