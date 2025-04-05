import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TOUR, DELETE_TOUR, GET_TOURS } from '../graphql/tours';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_TOUR, {
    variables: { id },
  });
  
  const [deleteTour] = useMutation(DELETE_TOUR, {
    variables: { id },
    onCompleted: () => {
      navigate('/');
    },
    refetchQueries: [{ query: GET_TOURS }],
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  const tour = data.tour;

  // Construct image URL using the known backend base URL
  // TODO: Move this base URL to an environment variable for better configuration
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = tour.imageFilename ? `${backendBaseUrl}/img/${tour.imageFilename}` : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          &larr; Back to Tours
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/tours/edit/${tour.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Tour
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Tour</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the tour.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTour()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        {/* Display Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tour.name}
            className="w-full h-64 object-cover rounded-t-lg" // Image styling
            onError={(e) => { e.target.style.display = 'none'; /* Hide on error */ }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-lg">
            No Image Available
          </div> // Placeholder
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{tour.name}</CardTitle>
          <CardDescription>
            Created on {formatDate(tour.createdAt)}
            {tour.isActive ? (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactive
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Price</h3>
            <p className="mt-1 text-xl font-bold text-indigo-600">{formatPrice(tour.price)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-1 text-gray-700">{tour.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
