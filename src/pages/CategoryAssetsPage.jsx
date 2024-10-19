import { Card, Title } from "@tremor/react";
import {Link, useNavigate} from "react-router-dom";
import React from "react";

export function CategoryAssetsPage() {
    const navigate = useNavigate();
    const navigation = [
        { name: 'Laptop', href: '/assetsRequest', id: 1 },
        { name: 'Proyector', href: '/assetsRequest', id: 2 },
        { name: 'Monitor', href: '/assetsRequest', id: 3 },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen -mt-16">
            <button
                onClick={() => navigate('/')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
                style={{
                    background: 'none',
                    border: 'none',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full max-w-4xl">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={{
                            pathname: item.href,
                        }}
                        state={{id: item.id}}
                        className="text-none"
                    >
                        <div
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            <div className="text-lg text-center text-gray-800">
                                {item.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
