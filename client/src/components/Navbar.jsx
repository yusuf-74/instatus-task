import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 mb-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-white text-lg font-semibold">Instatus</span>
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Home
                    </Link>
                    <Link to="/create" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Create
                    </Link>
                    <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
