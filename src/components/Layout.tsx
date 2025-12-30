import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useRecipes } from '../context/RecipeContext';

export function Layout() {
    const { refreshRecipes } = useRecipes();
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} onClick={onClick} className="flex flex-col items-center justify-center w-full h-full space-y-1 relative" aria-label={label}>
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
            <nav className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-100 flex items-center justify-center px-6 pb-2 z-50 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <NavItem to="/" icon={Home} label="Accueil" onClick={() => refreshRecipes()} />
            </nav>
        </div>
    );
}
