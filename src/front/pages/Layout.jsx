import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Estructura: navbar fijo arriba, contenido central, footer abajo.
// El fondo crema viene del body (index.css).
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