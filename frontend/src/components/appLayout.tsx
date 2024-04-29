import Navbar from "./navbar";


export default function AppLayout({ children }: any) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}