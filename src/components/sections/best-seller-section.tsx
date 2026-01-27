
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

const bestSellers = [
    {
        name: "Butter Chicken",
        description: "Our signature dish! Grilled chicken in a creamy, buttery tomato sauce. A crowd favorite that's rich, flavorful, and unforgettable.",
        imageId: "bestseller-butter-chicken",
    },
    {
        name: "Chicken Biryani",
        description: "Aromatic and flavorful rice dish with marinated chicken, slow-cooked to perfection with fragrant spices. A true classic.",
        imageId: "bestseller-chicken-biryani",
    },
];

const BestSellerSection = () => {
    return (
        <section id="bestseller" className="py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Best Sellers</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Loved by our patrons, these dishes represent the pinnacle of taste and quality at Atithi.
                    </p>
                </div>

                <div className="space-y-20">
                    {bestSellers.map((item, index) => {
                        const imageData = PlaceHolderImages.find(img => img.id === item.imageId);
                        const isReversed = index % 2 !== 0;
                        return (
                            <div key={item.name} className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center`}>
                                <div className={`relative aspect-video ${isReversed ? 'md:order-2' : ''}`}>
                                    {imageData && (
                                        <Image
                                            src={imageData.imageUrl}
                                            alt={`Our best-selling dish: ${item.name}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            data-ai-hint={imageData.imageHint}
                                            className="rounded-lg object-cover shadow-2xl"
                                            unoptimized={true}
                                        />
                                    )}
                                </div>
                                <div className={`${isReversed ? 'md:order-1' : ''}`}>
                                    <h3 className="text-2xl md:text-3xl font-bold">{item.name}</h3>
                                    <p className="mt-4 text-muted-foreground text-lg">{item.description}</p>
                                    <Button size="lg" className="mt-6" asChild>
                                        <Link href="tel:8250104315">
                                            <Phone className="mr-2 h-5 w-5" /> Call to Order
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default BestSellerSection;

    
