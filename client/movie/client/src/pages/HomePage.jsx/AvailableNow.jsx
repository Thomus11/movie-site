// AvailableNow.js

import React from "react";

const movies = [
  {
    id: 1,
    title: "Until Dawn",
    genre: "Drama • Horror",
    rating: 4,
    price: 12,
    image: "/images/Available1.jpeg",
  },
  {
    id: 2,
    title: "Sinners",
    genre: "Horror • Adventure",
    rating: 5,
    price: 15,
    image: "/images/Available2.jpeg",
  },
  {
    id: 3,
    title: "The Accountant 2",
    genre: "Action • Thriller",
    rating: 4,
    price: 13,
    image: "/images/Available3.jpeg",
  },
  {
    id: 4,
    title: "The Kings of Kings",
    genre: "Animation",
    rating: 5,
    price: 10,
    image: "/images/Available4.jpeg",
  },
];

function AvailableNow() {
  return (
    <section className="bg-[#0B0C10] py-20 px-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-white tracking-wide mb-14">Available Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#1F1F1F] rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col justify-between h-[250px]">
                <div>
                  <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                  <p className="text-base text-gray-400 mt-3">{movie.genre}</p>

                  {/* Star Ratings */}
                  <div className="flex justify-center mt-4">
                    {Array(5)
                      .fill()
                      .map((_, index) => (
                        <span key={index} className={index < movie.rating ? "text-[#D4AF37]" : "text-gray-600"}>
                          ★
                        </span>
                      ))}
                  </div>

                  {/* Price */}
                  <p className="text-base text-gray-400 mt-3">From ${movie.price}</p>
                </div>

                {/* Buy Button */}
                <button className="mt-6 bg-[#8B0000] text-white font-bold text-lg py-3 px-6 rounded-full hover:bg-[#a10000] transition">
                  Get Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AvailableNow;
