import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";


export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="ss-page">
                <Navbar />
                <main className="ss-main">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
};