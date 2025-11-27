import { useState } from "react";
import { Plane, Train, Ship, Bike, Car, Search, MapPin, Rocket, AlertCircle, BookOpen } from "lucide-react";
import { flightApi, trainApi, transportApi } from "../services/api";

const TravelHub = () => {
  const [selectedMode, setSelectedMode] = useState("flight");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const travelModes = [
    { id: "flight", label: "Flights", icon: Plane },
    { id: "train", label: "Train (Luxury + Local)", icon: Train },
    { id: "cruise", label: "Cruise Ship", icon: Ship },
    { id: "private", label: "Private Jet", icon: Rocket },
    { id: "cab", label: "Taxi / Ola / Uber", icon: Car },
    { id: "bike", label: "Bike & Scooty Rentals", icon: Bike },
  ];

  const handleSearch = async () => {
    setError("");
    setIsLoading(true);
    setHasSearched(true);

    if (!fromCity || !toCity || !travelDate) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      let response: any;

      switch (selectedMode) {
        case "flight":
          response = await flightApi.search(fromCity, toCity, travelDate, passengers);
          break;
        case "train":
          response = await trainApi.search(fromCity, toCity, travelDate, passengers);
          break;
        case "cab":
          response = await transportApi.searchCabs(fromCity, toCity, travelDate);
          break;
        case "cruise":
          response = await transportApi.searchCruises(fromCity, toCity, travelDate);
          break;
        case "private":
          response = await transportApi.searchJets(fromCity, toCity, travelDate);
          break;
        case "bike":
          const endDate = new Date(travelDate);
          endDate.setDate(endDate.getDate() + 1);
          response = await transportApi.searchBikes(fromCity, toCity, travelDate, endDate.toISOString().split('T')[0]);
          break;
        default:
          throw new Error("Invalid mode");
      }

      if (response.success && response.data) {
        setResults(response.data.data || response.data);
      } else {
        setError(response.error || "No results found");
        setResults([]);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Travel <span className="text-teal-600">Hub</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Compare routes, prices & transport options — all in one platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {travelModes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedMode(id)}
            className={`border rounded-xl py-4 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm hover:scale-[1.03] 
              ${selectedMode === id ? "border-teal-600 bg-teal-50 shadow-md" : "hover:border-teal-500 hover:bg-gray-50"}`}
          >
            <Icon size={28} className="text-teal-700" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Search {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="font-medium text-gray-700 text-sm">From</label>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-lg shadow-sm bg-white">
              <MapPin size={20} className="text-teal-600" />
              <input 
                type="text" 
                placeholder="City / Airport" 
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 text-sm">To</label>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-lg shadow-sm bg-white">
              <MapPin size={20} className="text-teal-600" />
              <input 
                type="text" 
                placeholder="Destination" 
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 text-sm">Travel Date</label>
            <input 
              type="date" 
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="px-4 py-3 border rounded-lg shadow-sm w-full outline-none" 
            />
          </div>
        </div>

        {selectedMode === 'flight' && (
          <div className="mt-5">
            <label className="font-medium text-gray-700 text-sm">Passengers</label>
            <select 
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              className="px-4 py-3 border rounded-lg shadow-sm w-full outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="mt-6 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl text-lg flex items-center gap-2 shadow-md transition-all hover:scale-[1.03] disabled:scale-100"
        >
          {isLoading ? (
            <>
              <div className="animate-spin">⏳</div> Searching...
            </>
          ) : (
            <>
              <Search size={20} /> Search & Compare
            </>
          )}
        </button>

        {error && hasSearched && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && !isLoading && results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Options ({results.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {results.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedMode === 'flight' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Flight</p>
                        <p className="font-semibold text-gray-900">{item.airline}</p>
                        <p className="text-xs text-gray-500">{item.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{item.origin} → {item.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{item.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.price.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                  {selectedMode === 'train' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Train</p>
                        <p className="font-semibold text-gray-900">{item.trainName}</p>
                        <p className="text-xs text-gray-500">{item.trainNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{item.source} → {item.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{item.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">From</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.classes?.[0]?.price?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </>
                  )}
                  {selectedMode === 'cab' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-semibold text-gray-900 capitalize">{item.provider}</p>
                        <p className="text-xs text-gray-500">{item.carType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{item.estimatedDuration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-semibold">⭐ {item.driverRating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.price.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                  {selectedMode === 'cruise' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Cruise</p>
                        <p className="font-semibold text-gray-900">{item.cruiseName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{item.duration} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ports</p>
                        <p className="font-semibold text-sm">{item.embarkPort} → {item.disembarkPort}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.price.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                  {selectedMode === 'private' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Jet</p>
                        <p className="font-semibold text-gray-900">{item.aircraft}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="font-semibold">{item.capacity} passengers</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{item.origin} → {item.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                  {selectedMode === 'bike' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Bike</p>
                        <p className="font-semibold text-gray-900">{item.bikeName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold capitalize">{item.bikeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-semibold">⭐ {item.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price/Day</p>
                        <p className="text-2xl font-bold text-teal-600">₹{item.pricePerDay.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>
                <button className="mt-4 w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg font-semibold transition-colors">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSearched && !isLoading && results.length === 0 && !error && (
        <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-lg text-gray-600">No results found for your search</p>
        </div>
      )}

      <div className="mt-12 p-6 rounded-xl border bg-gradient-to-r from-orange-50 to-teal-50 text-gray-800 shadow">
        <h3 className="font-semibold text-lg mb-1">🚀 Coming Soon: AI Smart Planning</h3>
        <p className="text-gray-600">Personalized route suggestions based on budget, weather, peak rush, and your mood!</p>
      </div>
    </div>
  );
};

export default TravelHub;
