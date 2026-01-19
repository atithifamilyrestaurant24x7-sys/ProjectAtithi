"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/header";
import HeroSection from "@/components/sections/hero-section";
import LoadingScreen from "@/components/loading-screen";
import MenuSection from "@/components/sections/menu-section";
import BestSellerSection from "@/components/sections/best-seller-section";
import ProductSection from "@/components/sections/product-section";
import ReviewsSection from "@/components/sections/reviews-section";
import RecommendationSection from "@/components/sections/recommendation-section";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { type MenuItem, menuData } from "@/lib/menu";
import { ProductDetailDialog } from "@/components/sections/product-section";
import { config, type Review } from "@/app/config";
import WriteReviewSection from "@/components/sections/write-review-section";
import ContactSection from "@/components/sections/contact-section";
import MobileSearchHeader from "@/components/mobile-search-header";
import CartSheet from "@/components/cart-sheet";
import { MenuDialog } from "@/components/menu-dialog";
import MobileHeroCarousel from "@/components/mobile-hero-carousel";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export type CartItem = MenuItem & { quantity: number };

export default function Home() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allMenuItems, setAllMenuItems] = useState(menuData);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
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
  
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);


  return (
    <>
      <LoadingScreen isLoading={isAppLoading} />
      <div className="hidden md:block">
        <Header 
          cart={cart}
          onEmptyCart={handleEmptyCart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          isDropdownOpen={isDropdownOpen}
          onDropdownOpenChange={setIsDropdownOpen}
          onProductSelect={handleCardClick}
          isMobile={false}
          isCartOpen={isCartSheetOpen}
          onCartToggle={setIsCartSheetOpen}
        />
      </div>
      
      <div className="block md:hidden">
          <MobileSearchHeader 
              onSearch={setSearchQuery}
          />
      </div>
        <div className={`transition-opacity duration-500 ${isAppLoading ? 'opacity-0' : 'opacity-100'} pb-16 md:pb-0`}>
          <main>
             <div className="hidden md:block">
              <HeroSection />
            </div>
            <div className="md:hidden">
              <div className="px-4">
                  <h1 className="text-2xl font-semibold tracking-[0.2px] text-foreground mt-4 mb-3">Our Best Seller</h1>
                  <MobileHeroCarousel />
              </div>
              <div className="my-3.5 mx-4 border-b border-border"></div>
            </div>
            <div className="hidden md:block">
              <MenuSection />
            </div>
            <div className="hidden md:block">
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

            <ReviewsSection reviews={reviews} />
            <WriteReviewSection onReviewSubmit={handleReviewSubmit} />
            <ContactSection />
            <RecommendationSection />
          </main>
          <Footer />
        </div>

        <MobileBottomNav 
            cartCount={totalCartItems}
            onCartClick={() => setIsCartSheetOpen(true)}
        />

        {/* Cart Sheet for Mobile */}
        <CartSheet
            isOpen={isCartSheetOpen}
            onOpenChange={setIsCartSheetOpen}
            cart={cart}
            onEmptyCart={handleEmptyCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
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
    </>
  );
}
