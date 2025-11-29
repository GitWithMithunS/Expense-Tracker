import React, { useContext } from 'react'
import AppContext from '../../context/AppContext'
import { User } from 'lucide-react';
import { SIDE_BAR_DATA } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({activeMenu}) => {
    const { user } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-gray-200/50 p-5 sticky top-[61px] z-20">

            {/* Profile */}
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="profile"
                        className="w-20 h-20 object-cover rounded-full"
                    />
                ) : (
                    <User className="w-20 h-20 text-gray-700" />
                )}

                <h5 className="text-gray-900 font-medium">{user.name}</h5>
            </div>

            {/* Menu Items */}
            {SIDE_BAR_DATA.map((item, index) => (
                <button
                onClick={() => navigate(item.path)}
                    key={`menu_${index}`}
                    className={`cursor-pointer w-full flex items-center gap-4 text-[15px] text-gray-700 py-3 px-6 rounded-lg mb-3  ${activeMenu == item.label ? 'text-white bg-purple-800' : 'hover:bg-purple-100 transition'} `}
                >
                    <item.icon className="text-xl" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Sidebar;
