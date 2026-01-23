import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChartLine, faHome, faSignOut, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../providers/AuthProvider";

function AppLayout() {
    const [open, setOpen] = useState(false);
    const { authenticated, logout } = useAuth()
    const navigate = useNavigate()

    // useEffect(() => {
    //     if (!authenticated)
    //         navigate('/')
    //     else
    //         navigate('/home')
    // }, [authenticated])

    return (
        <div className="relative min-h-screen flex">

            {/* BACKDROP — tylko mobile */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/20 lg:hidden z-40"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    flex flex-col justify-between
                    fixed lg:sticky z-50
                    top-0 left-0 h-screen w-64 bg-gray-900 text-white
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <nav className="p-4 space-y-3 flex flex-col">
                    <NavLink to='/home' onClick={() => setOpen(false)} className="hover:bg-gray-700 p-2 rounded aria-[current=page]:bg-gray-700 aria-[current=page]:text-white flex items-center gap-4">
                        <FontAwesomeIcon icon={faHome} />
                        Home
                    </NavLink>
                    <NavLink to='/clients' onClick={() => setOpen(false)} className="hover:bg-gray-700 p-2 rounded aria-[current=page]:bg-gray-700 aria-[current=page]:text-white flex items-center gap-4">
                        <FontAwesomeIcon icon={faUserGroup} />
                        Clients
                    </NavLink>
                    <NavLink to='/raports' onClick={() => setOpen(false)} className="hover:bg-gray-700 p-2 rounded aria-[current=page]:bg-gray-700 aria-[current=page]:text-white flex items-center gap-4">
                        <FontAwesomeIcon icon={faChartLine} />
                        Raports
                    </NavLink>
                </nav>
                <NavLink to='/' onClick={() => {
                    setOpen(false)
                    logout()
                }}
                    className="hover:bg-gray-700 p-6 rounded aria-[current=page]:bg-gray-700 aria-[current=page]:text-white flex items-center gap-4">
                    <FontAwesomeIcon icon={faSignOut} />
                    Sign out
                </NavLink>

            </aside>

            {/* GŁÓWNY OBSZAR */}
            <main className="flex-1">

                {/* HEADER – tylko mobile */}
                <header className="sticky top-0 bg-gray-900 text-white h-12 flex items-center px-3 lg:hidden z-30">
                    <button onClick={() => setOpen(true)}>
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </header>

                {/* TREŚĆ STRONY */}
                <div className="p-4 h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AppLayout;
