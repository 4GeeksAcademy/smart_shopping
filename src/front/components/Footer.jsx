import { Link } from "react-router-dom";
export const Footer = () => (
    <footer className="ss-footer">
        <div className="ss-container">
            {/* Grid 4 columnas */}
            <div className="ss-footer-grid">
                {/* COL 1: Brand */}
                <div className="ss-footer-col">
                    <Link to="/" className="ss-brand" style={{ color: "var(--ss-text)" }}>
                        <span className="ss-brand-icon">
                            <i className="fa-solid fa-basket-shopping"></i>
                        </span>
                        <span style={{ color: "var(--ss-text)" }}>Smart Shopping</span>
                    </Link>
                    <p className="ss-footer-brand-text">
                        Una app de listas de compra inteligente con IA. Organiza tus compras,
                        genera ingredientes desde recetas y nunca olvides nada otra vez.
                    </p>
                    <div className="ss-social-row">
                        <a href="#" className="ss-social-icon" aria-label="Facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#" className="ss-social-icon" aria-label="Twitter">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a href="#" className="ss-social-icon" aria-label="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#" className="ss-social-icon" aria-label="LinkedIn">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
                {/* COL 2: Mi cuenta */}
                <div className="ss-footer-col">
                    <h4>Mi cuenta</h4>
                    <ul>
                        <li><Link to="/profile">Mi perfil</Link></li>
                        <li><Link to="/lists">Mis listas</Link></li>
                        <li><Link to="/login">Iniciar sesión</Link></li>
                        <li><Link to="/register">Crear cuenta</Link></li>
                    </ul>
                </div>
                {/* COL 3: Información */}
                <div className="ss-footer-col">
                    <h4>Información</h4>
                    <ul>
                        <li><a href="#">Sobre nosotros</a></li>
                        <li><a href="#">Cómo funciona</a></li>
                        <li><a href="#">Privacidad</a></li>
                        <li><a href="#">Términos</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </div>
                {/* COL 4: Contacto */}
                <div className="ss-footer-col">
                    <h4>Contacto</h4>
                    <div className="ss-footer-contact-item">
                        <div className="ss-footer-contact-icon">
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        <div>
                            <small style={{ display: "block", fontSize: "11px", opacity: 0.7 }}>Llámanos</small>
                            <strong style={{ color: "var(--ss-text)", fontWeight: 700, fontSize: "14px" }}>+34 600 000 000</strong>
                        </div>
                    </div>
                    <div className="ss-footer-contact-item">
                        <div className="ss-footer-contact-icon">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div>
                            <small style={{ display: "block", fontSize: "11px", opacity: 0.7 }}>Email</small>
                            <strong style={{ color: "var(--ss-text)", fontWeight: 700, fontSize: "14px" }}>hola@smartshopping.app</strong>
                        </div>
                    </div>
                    <div className="ss-footer-contact-item">
                        <div className="ss-footer-contact-icon">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div style={{ lineHeight: 1.4 }}>
                            Calle de la Compra, 4<br />
                            Madrid, España
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom bar */}
            <div className="ss-footer-bottom">
                © {new Date().getFullYear()} Smart Shopping · Hecho con{" "}
                <i className="fa-solid fa-heart" style={{ color: "var(--ss-danger)", margin: "0 4px" }}></i>{" "}
                por{" "}
                <a href="https://www.4geeksacademy.com" target="_blank" rel="noreferrer">
                    4Geeks Academy
                </a>
            </div>
        </div>
    </footer>
);