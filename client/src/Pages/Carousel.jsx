// Carousel.js

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const images = [
  '/images/HOME2.jpeg',
  '/images/HOME3.webp',
  '/images/HOME4.webp',
  '/images/HOME5.webp',
  '/images/HOME5.webp'
];


const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-[#370617] bg-opacity-70 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-[#6a040f] transition"
    >
      &gt;
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-[#370617] bg-opacity-70 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-[#6a040f] transition"
    >
      &lt;
    </div>
  );
};

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: true,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Slider {...settings} className="w-full h-full">
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`carousel-${index}`}
              className="w-full h-screen object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
