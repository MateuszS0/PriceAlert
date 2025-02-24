"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"

const HImage = [
  { imgUrl: '/assets/images/7900xtx.png', alt: 'AMD GPU' },
  { imgUrl: '/assets/images/threadripper.png', alt: 'AMD Cpu' },
  { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp' },
  { imgUrl: '/assets/images/hero-2.svg', alt: 'bag' },
  { imgUrl: '/assets/images/hero-5.svg', alt: 'chair' }
]

const HCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel showThumbs={false}
        autoPlay
        infiniteLoop
        interval={5000}
        showArrows={false}
        showStatus={false}>
        {HImage.map((image) => (
          <Image
            src={image.imgUrl}
            alt={image.alt}
            width={600}
            height={600}
            className="object-contain"
            key={image.alt}
          />
        ))}
      </Carousel>
    </div>
  )
}

export default HCarousel