import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_TOURS } from '../graphql/tours';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function TourList() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3); // Tours per page
  // Sorting state
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Form state (what user types)
  const [formMinPrice, setFormMinPrice] = useState('');
  const [formMaxPrice, setFormMaxPrice] = useState('');
  const [formSearchTerm, setFormSearchTerm] = useState('');
  
  // Query state (what we send to the server)
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // GraphQL query with variables
  const { loading, error, data } = useQuery(GET_TOURS, {
    variables: {
      page,
      limit,
      sortBy,
      sortOrder,
      // Only include these if they have values
      ...(minPrice && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      ...(searchTerm && { searchTerm }),
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Handlers for state changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleFormMinPriceChange = (e) => {
    setFormMinPrice(e.target.value);
  };

  const handleFormMaxPriceChange = (e) => {
    setFormMaxPrice(e.target.value);
  };

  const handleFormSearchTermChange = (e) => {
    setFormSearchTerm(e.target.value);
  };
  
  // New function to handle search button click
  const handleSearch = () => {
    // Update query parameters
    setMinPrice(formMinPrice ? parseFloat(formMinPrice) : null);
    setMaxPrice(formMaxPrice ? parseFloat(formMaxPrice) : null);
    setSearchTerm(formSearchTerm);
    
    // Reset to first page
    setPage(1);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  const { tours, totalCount } = data?.tours || { tours: [], totalCount: 0 }; // Handle null data

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name/Description</label>
              <Input
                type="text"
                placeholder="Search by name or description"
                value={formSearchTerm}
                onChange={handleFormSearchTermChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <Input
                type="number"
                placeholder="Min price"
                value={formMinPrice}
                onChange={handleFormMinPriceChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <Input
                type="number"
                placeholder="Max price"
                value={formMaxPrice}
                onChange={handleFormMaxPriceChange}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sorting Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <label htmlFor="sortBy" className="mr-2">Sort by:</label>
          <select
            id="sortBy"
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="none">None</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mr-2">Order:</label>
          <select
            id="sortOrder"
            className="border rounded px-2 py-1"
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map((tour) => {
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

      {tours.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No tours found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
