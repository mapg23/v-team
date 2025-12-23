"use strict";

// components/Navigation.jsx
import { Map, QrCode, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navigation border-top d-flex justify-content-around py-2 bg-white">
            <NavItem
                icon={<Map size={20} />}
                label="Karta"
                active={location.pathname === "/map"}
                path="/"
            />

            <NavItem
                icon={<QrCode size={20} />}
                label="Historik?"
                active={location.pathname === "/transactions"}
                path="/scan"
            />

            <NavItem
                icon={<User size={20} />}
                label="Konto"
                active={location.pathname === "/account"}
                path="/account"
            />
        </nav>
    );
}

function NavItem({ icon, label, active, path }) {
    const navigate = useNavigate();
    const onAction = () => {
        navigate(path, { replace: true });
    }

    return (
        <button
            onClick={onAction}
            className={`btn d-flex flex-column align-items-center gap-1 ${active ? "text-dark" : "text-muted"
                }`}
            style={{ minWidth: 64 }}
        >
            {icon}
            <small className="fw-medium">{label}</small>
        </button>
    );
}
