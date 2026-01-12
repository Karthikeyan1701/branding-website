import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div styles={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={{ width: "220px", padding: "1rem", borderRight: "1px solid #ddd"}}>
                <h3>Admin</h3>
                <nav>
                    <ul>
                        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                        <li><NavLink to="/dashboard/categories">Categories</NavLink></li>
                        <li><NavLink to="/dashboard/subcategories">Subcategories</NavLink></li>
                        <li><NavLink to="/dashboard/products">Products</NavLink></li>
                    </ul>
                </nav>
                <button onClick={logout}>Logout</button>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
}