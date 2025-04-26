"use client";
import Link from "next/link";
import { useState } from "react";
import { Bell, UserCircle } from "lucide-react"; // Optional: install lucide-react for nice icons

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-white text-lg font-bold">
                    MyLogo
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-white hover:text-gray-400">
                        Home
                    </Link>
                    <Link href="/about" className="text-white hover:text-gray-400">
                        About
                    </Link>
                    <Link href="/services" className="text-white hover:text-gray-400">
                        Services
                    </Link>
                    <Link href="/contact" className="text-white hover:text-gray-400">
                        Contact
                    </Link>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className="text-white focus:outline-none"
                        >
                            <Bell className="w-6 h-6" /> this is fucking bell
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20">
                                <div className="p-4 text-gray-800 font-semibold border-b">Notifications</div>
                                <div className="p-4 text-gray-600">No new notifications.</div>
                            </div>
                        )}
                    </div>

                    {/* Profile Icon */}
                    <button className="text-white focus:outline-none">
                        <UserCircle className="w-8 h-8" />
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4">
                    <Link href="/" className="block text-white py-2 hover:bg-gray-700">
                        Home
                    </Link>
                    <Link href="/about" className="block text-white py-2 hover:bg-gray-700">
                        About
                    </Link>
                    <Link href="/services" className="block text-white py-2 hover:bg-gray-700">
                        Services
                    </Link>
                    <Link href="/contact" className="block text-white py-2 hover:bg-gray-700">
                        Contact
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
