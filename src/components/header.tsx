
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { config } from "@/app/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import CartSheet from "@/components/cart-sheet";
import { type CartItem } from "@/app/page";
import { type MenuItem } from "@/lib/menu";
import ProductMenuDropdown from "./product-menu-dropdown";
import { Badge } from "@/components/ui/badge";

type HeaderProps = {
  isHeaderVisible: boolean;
  cart: CartItem[];
  onEmptyCart: () => void;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemName: string) => void;
  onDropdownOpenChange: (open: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onProductSelect: (item: MenuItem) => void;
  isMobile: boolean;
  isCartOpen: boolean;
  onCartToggle: (open: boolean) => void;
};

const Header = ({ 
  isHeaderVisible, 
  cart, 
  onEmptyCart, 
  onAddToCart, 
  onRemoveFromCart, 
  onDropdownOpenChange,
  onMouseEnter,
  onMouseLeave,
  onProductSelect,
  isMobile,
  isCartOpen,
  onCartToggle,
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopNavLinks = config.navbarLinks.filter(link => link.name !== 'Products');
  const mobileNavLinks = config.navbarLinks;
  
  const navLinks = isMobile ? mobileNavLinks : desktopNavLinks;

  let navTextColor: string;
  if (isMobile) {
    navTextColor = "text-foreground";
  } else {
    navTextColor = isScrolled ? "text-foreground" : "text-white hover:text-white hover:bg-white/10";
  }
  
  const mobileMenuBg = isMobileMenuOpen ? "bg-background/95" : "bg-transparent";

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isMobile 
      ? "bg-background/80 shadow-lg backdrop-blur-sm"
      : isHeaderVisible
        ? "translate-y-0" 
        : "-translate-y-full",
    !isMobile && (isScrolled ? "bg-background/80 shadow-lg backdrop-blur-sm" : "bg-transparent")
  );

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        className={headerClasses}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Left side: Hamburger for mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn("text-foreground")}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
            
            {/* Center: Navigation Links */}
            <nav className={cn("hidden md:flex flex-1 justify-center items-center", isMobile && "flex")}>
              <ul className="flex items-center space-x-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Button variant="ghost" asChild className={cn(navTextColor)}>
                      <Link href={link.href}>{link.name}</Link>
                    </Button>
                  </li>
                ))}
                {!isMobile && (
                  <li>
                    <ProductMenuDropdown
                      onAddToCart={onAddToCart}
                      onProductSelect={onProductSelect}
                      onOpenChange={onDropdownOpenChange}
                      className={cn(navTextColor)}
                    />
                  </li>
                )}
              </ul>
            </nav>

            {/* Right side: Cart */}
            <div className="flex items-center">
              <CartSheet
                isOpen={isCartOpen}
                onOpenChange={onCartToggle}
                cart={cart}
                onEmptyCart={onEmptyCart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
              >
                <Button variant="ghost" size="icon" className={cn("relative", navTextColor)} onClick={() => onCartToggle(!isCartOpen)}>
                    <ShoppingCart className="h-5 w-5" />
                    {totalCartItems > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-2">
                            {totalCartItems}
                        </Badge>
                    )}
                    <span className="sr-only">View Cart</span>
                </Button>
              </CartSheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cn("fixed inset-0 top-20 z-40 backdrop-blur-sm md:hidden animate-in fade-in-20", mobileMenuBg)}>
          <nav className="container mx-auto px-4 pt-4">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Button variant="ghost" asChild className="w-full justify-start text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href={link.href}>{link.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
