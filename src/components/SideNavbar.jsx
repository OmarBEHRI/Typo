import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, ChevronRight, GraduationCap, LayoutDashboard, CheckSquare, Edit, LogOut } from 'lucide-react';
import { logoutUser } from '../services/authService';

function SideNavbar({ openLoginModal }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  useEffect(() => {
    try {
      const userRolesStr = localStorage.getItem('userRoles');
      if (userRolesStr) {
        const userRoles = JSON.parse(userRolesStr);
        setIsAdmin(userRoles.includes('ROLE_ADMIN'));
      }
    } catch (error) {
      console.error('Error parsing user roles:', error);
      setIsAdmin(false);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <nav
      className={`fixed left-4 top-1/2 -translate-y-1/2 bg-light-gray backdrop-blur-sm border border-highlight/50 transition-all duration-300 z-[9999] flex flex-col rounded-lg ${
        expanded ? "w-44 py-4" : "w-12 py-3"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!expanded && (
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 bg-highlight border border-text-normal/50 rounded-full p-1 cursor-pointer hover:bg-dark-gray transition-colors"
          onClick={handleMouseEnter}
        >
          <ChevronRight size={12} className="text-text-normal" />
        </div>
      )}
      
      <ul className={`flex flex-col gap-1 w-full ${expanded ? "px-2" : "px-0 items-center"}`}>
        {isLoggedIn ? (
          <>
            <NavItem
              href="/practice"
              icon={<GraduationCap size={18} />}
              label="Practice"
              active={isActive("/practice")}
              expanded={expanded}
            />
            <NavItem
              href="/user"
              icon={<User size={18} />}
              label="Stats"
              active={isActive("/user")}
              expanded={expanded}
            />
            <NavItem
              href="/leaderboard"
              icon={<BookOpen size={18} />}
              label="Leaderboard"
              active={isActive("/leaderboard")}
              expanded={expanded}
            />
            
            {isAdmin && (
              <>
                <div className="w-full my-2 border-t border-highlight/50"></div>
                <NavItem
                  href="/admin/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  active={isActive("/admin/dashboard")}
                  expanded={expanded}
                />
                <NavItem
                  href="/admin/verification"
                  icon={<CheckSquare size={18} />}
                  label="Verify"
                  active={isActive("/admin/verification")}
                  expanded={expanded}
                />
                <NavItem
                  href="/admin/edit"
                  icon={<Edit size={18} />}
                  label="Edit"
                  active={isActive("/admin/edit")}
                  expanded={expanded}
                />
              </>
            )}
            
            <div className="w-full my-2 border-t border-highlight/50"></div>
            <div
              onClick={handleLogout}
              className={`flex items-center py-2 px-2 rounded-md transition-all duration-200 text-text-normal hover:text-text-highlight hover:bg-highlight/60 cursor-pointer ${expanded ? "" : "justify-center w-8 h-8"}`}
            >
              <div className="flex-shrink-0">
                <LogOut size={18} />
              </div>
              {expanded && (
                <span className="ml-2 text-sm font-medium whitespace-nowrap">
                  Log Out
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="p-2 rounded-md bg-highlight/50">
              <User size={18} className="text-text-normal" />
            </div>
            {expanded && (
              <button 
                onClick={openLoginModal}
                className="mt-3 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        )}
      </ul>
    </nav>
  );
}

function NavItem({ href, icon, label, active, expanded }) {
  return (
    <Link to={href} className={`w-full ${!expanded ? "flex justify-center" : ""}`} title={label}>
      <div
        className={`flex items-center py-2 px-2 rounded-md transition-all duration-200 ${
          active 
            ? "bg-accent text-text-highlight" 
            : "text-text-normal hover:text-text-highlight hover:bg-highlight/60"
        } ${expanded ? "" : "justify-center w-8 h-8"}`}
      >
        <div className="flex-shrink-0">
          {icon}
        </div>
        {expanded && (
          <span className="ml-2 text-sm font-medium whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </Link>
  );
}

export default SideNavbar;