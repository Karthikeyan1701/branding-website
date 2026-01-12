import { useAuth } from "../context/useAuth";

export default function Dashboard() {
    const { logout } = useAuth();

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
}