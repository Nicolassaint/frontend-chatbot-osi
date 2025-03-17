"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import SystemStatusIndicator from "./SystemStatusIndicator";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="coral-bg dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/Osi.png" alt="OSI Logo" className="h-13 w-11 mr-3" />
          <h1 className="text-xl font-bold text-white">OSI : le chatbot de l'offre de services informatique</h1>
        </div>
        <div className="flex items-center gap-4">
          <SystemStatusIndicator showText={true} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 