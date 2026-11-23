import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

const AdminSidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "Manage Students", path: "/admin/students", icon: "🎓" },
        { name: "Manage Alumni", path: "/admin/alumni", icon: "👨‍💼" },
        { name: "Verify Alumni", path: "/admin/verify-alumni", icon: "✅" },
        { name: "Manage Bookings", path: "/admin/bookings", icon: "📅" },
    ];

    return (
        <div className="admin-sidebar">
            <h2>SeniorConnect AI</h2>

            <p className="sidebar-subtitle">ADMIN PANEL</p>

            <nav>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        <span>{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;