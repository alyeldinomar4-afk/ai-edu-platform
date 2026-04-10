import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-slate-950">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
