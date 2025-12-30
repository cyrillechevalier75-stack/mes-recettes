import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Plus, ChefHat } from 'lucide-react';
import { clsx } from 'clsx';

export function Layout() {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className="flex flex-col items-center justify-center w-full h-full space-y-1 relative" aria-label={label}>
                <div className={clsx("p-2 rounded-2xl transition-all duration-300", isActive ? "text-orange-600 -translate-y-1" : "text-gray-400")}>
                    <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full"></span>
                )}
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans mx-auto max-w-md shadow-2xl relative">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-white/50 backdrop-blur-sm">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="absolute bottom-0 w-full h-24 bg-white border-t border-gray-100 flex items-end justify-around px-6 pb-6 z-50 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <NavItem to="/" icon={Home} label="Accueil" />

                {/* Floating Action Button */}
                <Link to="/add" className="relative -top-8 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-200 transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 ring-8 ring-gray-50">
                        <Plus size={32} className="text-white" strokeWidth={3} />
                    </div>
                </Link>

                <NavItem to="/recipes" icon={ChefHat} label="Recettes" />
            </nav>
        </div>
    );
}
