import "./AdminLayout.css";

const AdminNavbar = () => {
    let admin = null;

    try {
        admin = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.log("User data not found");
    }

    return (
        <div className="admin-navbar">
            <h3>Admin Dashboard</h3>

            <div className="admin-profile">
                <span>👤</span>
                <span>{admin?.name || "Administrator"}</span>
            </div>
        </div>
    );
};

export default AdminNavbar;