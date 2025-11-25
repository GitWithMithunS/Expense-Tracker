import React, { useState, useContext, useRef, useEffect } from 'react'
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, User, X } from 'lucide-react';
import Sidebar from './Sidebar';
import logo from '../assets/logo.png';

const Navbar = ({activeMenu}) => {

    const [openSidebar, setOpenSidebar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data from context and local storage
        localStorage.removeItem('user');
        localStorage.clear();
        setShowDropdown(false);
        navigate('/login');
    }

    
    useEffect(() => {
    const handleClickOutside = (e) => {
        //if dropdwon is not null and doesnt contains the ref elements -> then close
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    if (showDropdown) {
        document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [showDropdown]);




    return (
        <>
            <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-6 lg:px-7 sticky top-0 z-30">
               
                {/* left side menu butotn and title */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => { setOpenSidebar(!openSidebar) }}
                        className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors">
                        {openSidebar ? (
                            <X />
                        ) : (
                            <Menu />
                        )}
                    </button>


                    <div className="flex items-center gap-2">
                        <img src={logo} alt="" className='h-10 w-10' />
                        <span className="text-lg font-medium text-black truncated">Expense Tracker</span>
                    </div>
                </div>


                {/* right side profile avatar photo */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 
             rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 
             focus:ring-purple-400"
                    >
                        <User className="text-purple-500" />
                    </button>


                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                        <User className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm front-medium text-gray-800 truncate">
                                            {user?.fullname || 'Guest User'}
                                        </p>
                                        <p className="text-xs text-gray-500 trucate">
                                            {user?.email || 'guest@example.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Dropdwon options */}
                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 transition-colors duration-150">
                                    <LogOut className='w-4 h-4 text-gray-500' />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>)}
                </div>


                {/* Mobile side menu */}
                {openSidebar && (
                    <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
                        <Sidebar activeMenu={activeMenu}/>
                    </div>
                )}

            </div>
        </>
    )
}

export default Navbar   