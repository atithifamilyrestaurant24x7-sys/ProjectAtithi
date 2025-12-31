

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/header";
import HeroSection from "@/components/sections/hero-section";
import LoadingScreen from "@/components/loading-screen";
import MenuSection from "@/components/sections/menu-section";
import BestSellerSection from "@/components/sections/best-seller-section";
import ProductSection from "@/components/sections/product-section";
import ReviewsSection from "@/components/sections/reviews-section";
import RecommendationSection from "@/components/sections/recommendation-section";
import Footer from "@/components/footer";
import HeaderController from "@/components/header-controller";
import { useToast } from "@/hooks/use-toast";
import { type MenuItem, menuData } from "@/lib/menu";
import { ProductDetailDialog } from "@/components/sections/product-section";
import { config, type Review } from "@/app/config";
import WriteReviewSection from "@/components/sections/write-review-section";
import ContactSection from "@/components/sections/contact-section";
import MobileSearchHeader from "@/components/mobile-search-header";
import CartSheet from "@/components/cart-sheet";
import { MenuDialog } from "@/components/menu-dialog";
import { WhatsappIcon } from "@/components/icons";
import { cn } from "@/lib/utils";


export type CartItem = MenuItem & { quantity: number };

export default function Home() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allMenuItems, setAllMenuItems] = useState(menuData);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(config.reviews);
  const [searchQuery, setSearchQuery] = useState("");


  const handleCardClick = (item: MenuItem) => {
      setSelectedItem(item);
      setIsDetailViewOpen(true);
  };

  const handleRatingChange = (itemName: string, newRating: number) => {
      setAllMenuItems(prevMenuData => {
          return prevMenuData.map(category => {
              return {
                  ...category,
                  items: category.items.map(item => {
                      if (item.name === itemName) {
                          const newTotalRating = (item.rating * item.ratingsCount) + newRating;
                          const newRatingsCount = item.ratingsCount + 1;
                          return {
                              ...item,
                              rating: newTotalRating / newRatingsCount,
                              ratingsCount: newRatingsCount,
                          };
                      }
                      return item;
                  }),
              };
          });
      });
      
      if (selectedItem && selectedItem.name === itemName) {
          setSelectedItem(prevItem => {
              if (!prevItem) return null;
              const newTotalRating = (prevItem.rating * prevItem.ratingsCount) + newRating;
              const newRatingsCount = prevItem.ratingsCount + 1;
              return {
                  ...prevItem,
                  rating: newTotalRating / newRatingsCount,
                  ratingsCount: newRatingsCount,
              };
          });
      }
  };

  const handleAddToCart = (item: MenuItem) => {
      setCart(prevCart => {
          const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
          if (existingItem) {
              return prevCart.map(cartItem =>
                  cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
              );
          }
          return [...prevCart, { ...item, quantity: 1 }];
      });
      toast({
          title: "Added to Cart",
          description: `${item.name} has been added to your cart.`,
      });
  };

  const handleRemoveFromCart = (itemName: string) => {
      let itemRemoved = false;
      let itemDecremented = false;

      setCart(prevCart => {
          const existingItem = prevCart.find(cartItem => cartItem.name === itemName);
          if (existingItem && existingItem.quantity > 1) {
              itemDecremented = true;
              return prevCart.map(cartItem =>
                  cartItem.name === itemName ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
              );
          }
          itemRemoved = true;
          return prevCart.filter(cartItem => cartItem.name !== itemName);
      });

      if (itemRemoved) {
        toast({
            variant: "destructive",
            title: "Removed from Cart",
            description: `${itemName} has been removed from your cart.`,
        });
      } else if (itemDecremented) {
        toast({
            title: "Quantity Updated",
            description: `Quantity of ${itemName} has been updated.`,
        });
      }
  };
  
  const handleEmptyCart = () => {
      setCart([]);
      toast({
          variant: "destructive",
          title: "Cart Emptied",
          description: "All items have been removed from your cart.",
      });
  };

  const handleReviewSubmit = (newReview: { name: string; title: string; review: string }) => {
    const reviewWithAvatar: Review = { ...newReview, avatarId: `review-avatar-${Date.now()}` };
    setReviews(prevReviews => [reviewWithAvatar, ...prevReviews]);
    toast({
        title: "Review Submitted",
        description: "Thank you! Your feedback has been added.",
    });
};

  useEffect(() => {
    setIsAppLoading(false);
  }, []);

  const hideHeader = () => {
    if (!isDropdownOpen && window.innerWidth >= 768) { // Only hide on desktop
      headerTimerRef.current = setTimeout(() => {
          setIsHeaderVisible(false);
          headerTimerRef.current = null;
      }, 1000);
    }
  }

  const cancelHideHeader = () => {
    if (headerTimerRef.current) {
        clearTimeout(headerTimerRef.current);
        headerTimerRef.current = null;
    }
  }

  const showHeader = () => {
    if (window.innerWidth >= 768) { // Only show on desktop hover
      cancelHideHeader();
      setIsHeaderVisible(true);
      hideHeader();
    }
  };
  
  const toggleHeader = () => {
    if (window.innerWidth >= 768) { // Only toggle on desktop
      if (isHeaderVisible) {
        setIsHeaderVisible(false);
        cancelHideHeader();
      } else {
        showHeader();
      }
    }
  };
  
  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (window.innerWidth >= 768) { // Only manage desktop hover logic
      if (open) {
        cancelHideHeader();
        setIsHeaderVisible(true);
      } else {
        showHeader();
      }
    }
  }

  useEffect(() => {
    return () => {
      if (headerTimerRef.current) {
        clearTimeout(headerTimerRef.current);
      }
    };
  }, []);
  
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);


  return (
    <>
      <LoadingScreen isLoading={isAppLoading} />
      <div className="hidden md:block">
        <HeaderController onHover={showHeader} />
        <Header 
          isHeaderVisible={isHeaderVisible} 
          cart={cart}
          onEmptyCart={handleEmptyCart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onDropdownOpenChange={handleDropdownOpenChange}
          onMouseEnter={cancelHideHeader}
          onMouseLeave={hideHeader}
          onProductSelect={handleCardClick}
          isMobile={false}
          isCartOpen={isCartSheetOpen}
          onCartToggle={setIsCartSheetOpen}
        />
      </div>
      
      <div className="block md:hidden">
          <MobileSearchHeader 
              onSearch={setSearchQuery} 
              onRecommendClick={() => document.getElementById('recommendation')?.scrollIntoView({ behavior: 'smooth' })}
              onCartClick={() => setIsCartSheetOpen(true)}
              onMenuClick={() => setIsMenuDialogOpen(true)}
              cartCount={totalCartItems}
          />
      </div>
        <div className={`transition-opacity duration-500 ${isAppLoading ? 'opacity-0' : 'opacity-100'}`}>
          <main>
            <div className='hidden md:block'>
              <HeroSection onMenuClick={toggleHeader} />
              <MenuSection />
              <BestSellerSection />
            </div>
            
            <ProductSection 
                allMenuItems={allMenuItems}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onCardClick={handleCardClick}
                onRate={handleRatingChange}
                searchQuery={searchQuery}
            />

            <div className='hidden md:block'>
              <ReviewsSection reviews={reviews} />
              <WriteReviewSection onReviewSubmit={handleReviewSubmit} />
            </div>

            <ContactSection />
            <RecommendationSection />
          </main>
          <Footer />
        </div>

        {/* Cart Sheet for Mobile */}
        <CartSheet
            isOpen={isCartSheetOpen}
            onOpenChange={setIsCartSheetOpen}
            cart={cart}
            onEmptyCart={handleEmptyCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
        />

        <MenuDialog 
            isOpen={isMenuDialogOpen}
            onOpenChange={setIsMenuDialogOpen}
        />

        {selectedItem && (
          <ProductDetailDialog
              isOpen={isDetailViewOpen}
              onOpenChange={setIsDetailViewOpen}
              item={selectedItem}
              cartItem={cart.find(ci => ci.name === selectedItem.name)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onRate={handleRatingChange}
              onCartClick={() => {
                setIsDetailViewOpen(false);
                setIsCartSheetOpen(true);
              }}
          />
      )}

      {/* Floating WhatsApp Button for Mobile */}
      <Link 
        href="https://wa.me/918250104315"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-4 right-4 z-50 md:hidden",
          "socialContainer containerFour rounded-full shadow-lg"
        )}
        aria-label="Chat on WhatsApp"
      >
        <WhatsappIcon className="socialSvg" />
      </Link>
    </>
  );
}
