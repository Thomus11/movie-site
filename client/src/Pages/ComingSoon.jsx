// ComingSoon.js

import React from "react";

const ComingSoon = () => {
  const movies = [
    { image: "/images/Soon1.jpeg", title: "Mission: Impossible – Dead Reckoning Part Two", description: "Action/Thriller." },
    { image: "/images/Soon2.jpeg", title: "Thunderbolts", description: "Action/Adventure." },
    { image: "/images/Soon3.jpeg", title: "Blade", description: "Action/Horror." },
    { image: "/images/Soon4.jpeg", title: "Jurassic World Rebirth", description: "Action/Sci-fi." },
    { image: "/images/Soon5.jpeg", title: "Fast X: Part 2", description: "Action/Thriller." },
    { image: "/images/Soon6.jpeg", title: "Star Wars: Lost Horizons", description: "Sci-fi." },
    { image: "/images/Soon7.jpeg", title: "Avatar: Fire & Ash", description: "Action/Sci-fi." },
    { image: "/images/Soon8.jpeg", title: "Return of the Living Dead", description: "Horror/Comedy." },
  ];

  return (
    <div className="bg-[#0B0C10] py-20">
      <div className="text-center mb-14">
        <h2 className="text-5xl font-extrabold text-white tracking-wide mb-4">Coming Soon</h2>
        <p className="text-lg text-gray-400">Catch the latest movies coming soon to the cinema</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="bg-[#1F1F1F] p-6 rounded-2xl w-full transition-all transform hover:scale-105 hover:shadow-lg"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-56 object-cover rounded-xl mb-6 transition-all transform hover:scale-105"
            />
            <h3 className="text-white text-2xl font-semibold mb-3">{movie.title}</h3>
            <p className="text-base text-gray-400">{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
