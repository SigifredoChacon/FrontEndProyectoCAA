import { Card, Title } from "@tremor/react";
import { Link } from "react-router-dom";

export function CategoryAssetsPage() {
    const navigation = [
        { name: 'Laptop', href: '/assetsRequest', id: 1 },
        { name: 'Proyector', href: '/assetsRequest', id: 2 },
        { name: 'Monitor', href: '/assetsRequest', id: 3 },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen -mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full max-w-4xl">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={{
                            pathname: item.href,
                        }}
                        state={{ id: item.id }}
                        className="text-none"
                    >
                        <div className="w-full h-48 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
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
