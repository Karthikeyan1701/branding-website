import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">
                {children}
            </main>
        </div>
    );
}