import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}