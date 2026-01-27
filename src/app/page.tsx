
"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import HeroSection from "@/components/sections/hero-section";
import { useToast } from "@/hooks/use-toast";
import { type MenuItem, menuData } from "@/lib/menu";
import { config, type Review } from "@/lib/utils";
import MobileSearchHeader from "@/components/mobile-search-header";
import MobileHeroCarousel from "@/components/mobile-hero-carousel";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const MenuSection = dynamic(() => import("@/components/sections/menu-section"));
const BestSellerSection = dynamic(() => import("@/components/sections/best-seller-section"));
const ProductSection = dynamic(() => import("@/components/sections/product-section"));
const ReviewsSection = dynamic(() => import("@/components/sections/reviews-section"));
const RecommendationSection = dynamic(() => import("@/components/sections/recommendation-section"));
const Footer = dynamic(() => import("@/components/footer"));
const WriteReviewSection = dynamic(() => import("@/components/sections/write-review-section"));
const ContactSection = dynamic(() => import("@/components/sections/contact-section"));
const ProductDetailDialog = dynamic(() => import("@/components/product-detail-dialog").then(mod => mod.ProductDetailDialog));
const CartSheet = dynamic(() => import("@/components/cart-sheet"));
const MenuDialog = dynamic(() => import("@/components/menu-dialog").then(mod => mod.MenuDialog));


export type CartItem = MenuItem & { quantity: number };

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allMenuItems, setAllMenuItems] = useState(menuData);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(config.reviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);


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

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);


  return (
    <>
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
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              allMenuItems={allMenuItems}
              onProductSelect={handleCardClick}
          />
      </div>
        <div className="pb-16 md:pb-0">
          <main>
             <div className="hidden md:block">
              <HeroSection />
            </div>
            <div className="md:hidden">
              <div className="mt-[-12px]">
                  <Image
                      src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(5).png"
                      alt="Special Offer Banner"
                      width={1200}
                      height={400}
                      className="object-cover w-full"
                      priority
                      sizes="100vw"
                  />
              </div>
              <div className="px-4">
                <h1 className="text-2xl font-semibold tracking-[0.2px] text-foreground mt-4">Our Best Seller</h1>
                <MobileHeroCarousel onCardClick={handleCardClick} onAddToCart={handleAddToCart} />
              </div>
              <div className="mx-4 mt-8 mb-4 border-b border-border"></div>
            </div>
            <div className="hidden md:block">
              <MenuSection />
            </div>

            <div className="hidden md:block my-12">
              <Image
                src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(5).png"
                alt="Special Offer Banner"
                width={1920}
                height={400}
                className="object-cover w-full"
                sizes="100vw"
              />
            </div>
            
            <div className="hidden md:block">
              <BestSellerSection />
            </div>
            
            <div className="my-12 hidden md:block">
                <Image
                    src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(6).png"
                    alt="Special Offer Banner"
                    width={1920}
                    height={400}
                    className="object-cover w-full"
                    sizes="100vw"
                />
            </div>
            
            <ProductSection 
                allMenuItems={allMenuItems}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onCardClick={handleCardClick}
                onRate={handleRatingChange}
                searchQuery={searchQuery}
                onCartClick={() => setIsCartSheetOpen(true)}
            />

            <div className="md:hidden -mx-4">
                <Image
                    src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(6).png"
                    alt="Special Offer Banner"
                    width={1200}
                    height={400}
                    className="object-cover w-full"
                    sizes="100vw"
                />
            </div>
            
            <div className="text-center my-8 md:my-16 md:hidden">
              <h2 className="text-2xl font-bold text-foreground">Words from Our Guests</h2>
              <p className="mt-2 text-md text-muted-foreground max-w-xl mx-auto px-4">
                  We are proud to be a part of so many wonderful journeys. Here's what our valued customers have to say.
              </p>
            </div>
            
            <ReviewsSection reviews={reviews} />
            <WriteReviewSection onReviewSubmit={handleReviewSubmit} />
            <ContactSection />
            <div className="hidden md:block">
              <RecommendationSection />
            </div>
          </main>
          <Footer />
        </div>

        <MobileBottomNav 
            cartCount={totalCartItems}
            onCartClick={() => setIsCartSheetOpen(true)}
            onMenuClick={() => setIsMenuDialogOpen(true)}
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
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={onRemoveFromCart}
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
