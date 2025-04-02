import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_TOURS, SEARCH_TOURS } from '../graphql/tours';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function TourList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const { loading, error, data, refetch } = useQuery(GET_TOURS);
  
  const handleSearch = () => {
    const criteria = {};
    
    if (searchTerm) {
      criteria.name = searchTerm;
    }
    
    if (minPrice) {
      criteria.minPrice = parseFloat(minPrice);
    }
    
    if (maxPrice) {
      criteria.maxPrice = parseFloat(maxPrice);
    }
    
    refetch({ criteria });
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name</label>
              <Input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.tours.map((tour) => {
          // Construct image URL using the known backend base URL
          // TODO: Move this base URL to an environment variable for better configuration
          const backendBaseUrl = 'https://jubilant-space-acorn-wrg46x79wr6cgqqg-4000.app.github.dev';
          const imageUrl = tour.imageFilename ? `${backendBaseUrl}/img/${tour.imageFilename}` : null;

          return (
            <Card key={tour.id} className="overflow-hidden flex flex-col"> {/* Added flex flex-col */}
              {/* Image Section */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={tour.name}
                  className="w-full h-48 object-cover" // Fixed height, object-cover
                  onError={(e) => { e.target.style.display = 'none'; /* Hide if image fails to load */ }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div> // Placeholder
              )}
              {/* Content Section */}
              <CardContent className="p-6 flex-grow flex flex-col justify-between"> {/* Added flex-grow and flex for spacing */}
                <div> {/* Wrap text content */}
                  <h3 className="text-lg font-semibold mb-2">{tour.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{tour.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto"> {/* Added mt-auto */}
                  <span className="text-lg font-bold text-indigo-600">{formatPrice(tour.price)}</span>
                  <Link
                    to={`/tours/${tour.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </CardContent> {/* Moved CardContent closing tag here */}
            </Card>
          ); // Added closing parenthesis for return
        })} {/* Added closing curly brace for map */}
      </div>
      
      {data.tours.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No tours found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
