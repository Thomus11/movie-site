import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: '/images/HOME2.jpeg',
    title: "Blockbuster Season",
    subtitle: "Reserve seats for the season's most anticipated films",
    highlight: "Now Showing"
  },
  {
    image: '/images/HOME3.webp',
    title: "Premium Experience",
    subtitle: "Dolby Atmos sound that transports you into the story",
    highlight: "VIP Cinemas"
  },
  {
    image: '/images/HOME4.webp',
    title: "Midnight Screenings",
    subtitle: "Exclusive fan events with limited edition merchandise",
    highlight: "Fan Events"
  },
  {
    image: '/images/HOME5.webp',
    title: "Date Night",
    subtitle: "Curated dinner and movie packages",
    highlight: "Special Offers"
  }
];

const NextArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-4 rounded-full cursor-pointer z-20 hover:bg-black/40 transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-4 rounded-full cursor-pointer z-20 hover:bg-black/40 transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </div>
);

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    arrows: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots !bottom-10"
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <link 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Manrope:wght@300;500&display=swap" 
        rel="stylesheet"
      />
      
      <Slider {...settings} className="w-full h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            {/* Image with overlay */}
            <div className="relative w-full h-screen">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </div>
            
            {/* Text container */}
            <div className="absolute bottom-[30%] left-12 lg:left-20 text-left max-w-2xl animate-fadeIn">
              <span className="font-manrope text-sm tracking-[0.2em] text-white/80 mb-2 block">
                {slide.highlight}
              </span>
              <h2 className="font-playfair text-6xl lg:text-7xl text-white mb-6 leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="font-manrope text-xl text-gray-300 mb-8 font-light max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <button className="bg-white/0 hover:bg-white/10 text-white font-manrope font-medium py-3 px-8 rounded-sm text-lg transition-all duration-300 border border-white/30 hover:border-white/70 group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  {slide.cta}
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .font-manrope {
          font-family: 'Manrope', sans-serif;
        }
        .slick-dots li button:before {
          color: white;
          opacity: 0.4;
          font-size: 10px;
          transition: all 0.3s ease;
        }
        .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
          transform: scale(1.4);
        }
        .tracking-tight {
          letter-spacing: -0.025em;
        }
      `}</style>
    </div>
  );
}

export default Carousel;