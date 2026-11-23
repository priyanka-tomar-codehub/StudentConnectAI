import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <AdminSidebar />

            <div style={{ flex: 1, background: "#f1f5f9" }}>
                <AdminNavbar />

                <main style={{ padding: "25px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;