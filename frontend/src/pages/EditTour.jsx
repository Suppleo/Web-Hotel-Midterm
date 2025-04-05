import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TOUR, UPDATE_TOUR, GET_TOURS, UPLOAD_FILE } from '../graphql/tours'; // Added UPLOAD_FILE
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export default function EditTour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isActive: true,
    imageFilename: null, // Add state for existing image filename
  });
  const [selectedFile, setSelectedFile] = useState(null); // State for the new selected file object
  const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL (new or existing)
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState(''); // State for upload specific errors

  const { loading: queryLoading, error: queryError } = useQuery(GET_TOUR, {
    variables: { id },
    onCompleted: (data) => {
      const tour = data.tour;
      setFormData({
        name: tour.name,
        price: tour.price.toString(),
        description: tour.description,
        isActive: tour.isActive,
        imageFilename: tour.imageFilename, // Store existing filename
      });
      // Set initial preview URL if an image exists
      if (tour.imageFilename) {
        // Assuming images are served from /img/ at the server root
        const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
        const imageUrl = tour.imageFilename ? `${backendBaseUrl}/img/${tour.imageFilename}` : null;
        setPreviewUrl(imageUrl);
      }
    },
    fetchPolicy: 'cache-and-network', // Ensure fresh data on load
  });

  // Mutation hook for file upload
  const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
    onError: (error) => {
      console.error("Upload error:", error);
      setUploadError(`Failed to upload image: ${error.message}`);
    }
  });

  const [updateTour, { loading: updating }] = useMutation(UPDATE_TOUR, {
    onCompleted: () => {
      navigate(`/tours/${id}`);
    },
    refetchQueries: [{ query: GET_TOURS }, { query: GET_TOUR, variables: { id } }],
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    } else if (name === 'imageFile') {
      const file = e.target.files[0];
      // Revoke previous object URL if it exists (for new previews)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Create new preview URL
        setUploadError(''); // Clear previous upload error
      } else {
        // User cancelled selection, revert preview to original image if it exists
        setSelectedFile(null);
        if (formData.imageFilename) {
           const baseUrl = window.location.origin.replace(':5173', ':4000');
           setPreviewUrl(`${baseUrl}/img/${formData.imageFilename}`);
        } else {
           setPreviewUrl(null);
        }
      }
      // Clear general form error if present
      if (errors.imageFile) {
        setErrors({ ...errors, imageFile: '' });
      }
      return; // Prevent default handling
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Clean up blob preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const handleSwitchChange = (checked) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tour name is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    // Add file validation if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setUploadError(''); // Clear previous upload error

    if (!validateForm()) {
      return;
    }

    let imageFilenameToUpdate = formData.imageFilename; // Start with existing filename

    // 1. Upload new image if selected
    if (selectedFile) {
      try {
        const uploadResult = await uploadFile({ variables: { file: selectedFile } });
        if (uploadResult.data?.upload) {
          imageFilenameToUpdate = uploadResult.data.upload; // Update filename with the new one
          console.log("New image uploaded successfully:", imageFilenameToUpdate);
          // TODO: Optionally delete the old image file on the server
        } else {
          setUploadError("Image upload failed. Please try again.");
          console.error("Upload mutation did not return a filename.", uploadResult);
          return; // Stop submission
        }
      } catch (err) {
        console.error("Caught upload error during submit:", err);
        if (!uploadError) setUploadError(`Image upload failed: ${err.message}`);
        return; // Stop submission
      }
    }

    // 2. Update tour with potentially new image filename
    const tourInputData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      isActive: formData.isActive,
      imageFilename: imageFilenameToUpdate, // Use the determined filename (new or existing)
    };

    console.log("Updating tour with data:", tourInputData);

    updateTour({
      variables: { id, tourInput: tourInputData },
    });
  };

  if (queryLoading) return <p className="text-center py-10">Loading...</p>;
  if (queryError) return <p className="text-center py-10 text-red-500">Error: {queryError.message}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to={`/tours/${id}`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          &larr; Back to Tour Details
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Tour</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tour Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="price">Price (VND)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Image Upload Field */}
            <div>
              <Label htmlFor="imageFile">Tour Image (Optional: Upload new to replace)</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className={errors.imageFile || uploadError ? 'border-red-500' : ''}
              />
              {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
              {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <Label>Image Preview:</Label>
                  <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 w-auto border rounded" />
                </div>
              )}
            </div>


            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={uploading || updating}>
              {uploading ? 'Uploading...' : updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
