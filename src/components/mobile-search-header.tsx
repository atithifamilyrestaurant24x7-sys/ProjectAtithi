"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

type MobileSearchHeaderProps = {
    onSearch: (query: string) => void;
};

const MobileSearchHeader = ({ onSearch }: MobileSearchHeaderProps) => {
    return (
        <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-sm pt-[10px] pb-3">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image
                                src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/ChatGPT%20Image%20Jan%2020,%202026,%2012_52_38%20AM.png"
                                alt="Atithi Logo"
                                width={80}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="container-input flex-grow">
                        <Search className="h-5 w-5 text-gray-500" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="input"
                            onChange={(e) => onSearch(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileSearchHeader;
