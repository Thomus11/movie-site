import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';

const CinemaSelector = () => {
  const [activeCinema, setActiveCinema] = useState('Garden City');
  const [cinemas, setCinemas] = useState([]);

   useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await api.post('/api/cinema');
        setCinemas(response.data);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      }
    };

    fetchCinemas();
  }, []);

  return (
    <section className="bg-[#0B0C10] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          AVAILABLE <span className="text-red-500">CINEMAS</span>
        </h2>
        
        <div className="flex overflow-x-auto pb-6 -mx-6 px-6">
          <div className="flex space-x-8">
            {cinemas.map((cinema) => (
              <div 
                key={cinema.name}
                onClick={() => setActiveCinema(cinema.name)}
                className={`flex-shrink-0 w-72 cursor-pointer transition-all duration-300 ${
                  activeCinema === cinema.name ? 'transform -translate-y-2' : ''
                }`}
              >
                <div className={`h-full rounded-xl overflow-hidden border-2 ${
                  activeCinema === cinema.name 
                    ? 'border-red-500 shadow-lg shadow-red-900/30' 
                    : 'border-gray-800 hover:border-gray-600'
                }`}>
                  {/* Cinema Image */}
                  <div className="h-40 w-full overflow-hidden">
                    <img 
                      src={cinema.image} 
                      alt={`${cinema.name} image`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="p-5 bg-[#1F1F1F]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{cinema.name}</h3>
                        <p className="text-gray-400 text-sm flex items-center mt-1">
                          <MapPin className="mr-1 w-4 h-4" />
                          {cinema.location}
                        </p>
                      </div>
                      <div className="flex items-center bg-black/50 px-2 py-1 rounded">
                        <Star className="fill-yellow-400 text-yellow-400 w-4 h-4 mr-1" />
                        <span className="text-white text-sm">{cinema.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cinema.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinemaSelector;
