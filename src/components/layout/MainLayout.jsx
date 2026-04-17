import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
