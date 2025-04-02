import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_TOUR, GET_TOURS, UPLOAD_FILE } from '../graphql/tours'; // Added UPLOAD_FILE
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export default function CreateTour() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isActive: true,
    // imageFilename will be set after upload
  });
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file object
  const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState(''); // State for upload specific errors

  // Mutation hook for file upload
  const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
    onError: (error) => {
      console.error("Upload error:", error);
      setUploadError(`Failed to upload image: ${error.message}`);
      // Potentially clear file/preview if upload fails definitively
      // setSelectedFile(null);
      // setPreviewUrl(null);
    }
  });

  const [createTour, { loading: creating }] = useMutation(CREATE_TOUR, {
    onCompleted: () => {
      navigate('/');
    },
    refetchQueries: [{ query: GET_TOURS }],
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
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Create preview URL
        setUploadError(''); // Clear previous upload error
      } else {
        // Handle case where user cancels file selection
        setSelectedFile(null);
        setPreviewUrl(null);
      }
      // Clear general form error if present for this field (though unlikely for file input)
      if (errors.imageFile) {
        setErrors({ ...errors, imageFile: '' });
      }
      return; // Prevent default handling for file input
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

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
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
    // Add validation for file if needed (e.g., type, size)
    // if (selectedFile && !selectedFile.type.startsWith('image/')) {
    //   newErrors.imageFile = 'Please select an image file.';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setUploadError(''); // Clear previous upload error on new submit

    if (!validateForm()) {
      return;
    }

    let imageFilename = null;

    // 1. Upload image if selected
    if (selectedFile) {
      try {
        const uploadResult = await uploadFile({ variables: { file: selectedFile } });
        if (uploadResult.data?.upload) {
          imageFilename = uploadResult.data.upload;
          console.log("Image uploaded successfully:", imageFilename);
        } else {
          // Handle case where upload mutation returns null or error implicitly
          setUploadError("Image upload failed. Please try again.");
          console.error("Upload mutation did not return a filename.", uploadResult);
          return; // Stop submission if upload failed
        }
      } catch (err) {
        // Error is already handled by onError in useMutation hook, but we stop submission
        console.error("Caught upload error during submit:", err);
        // Ensure uploadError state is set if onError didn't catch it somehow
        if (!uploadError) setUploadError(`Image upload failed: ${err.message}`);
        return; // Stop submission
      }
    }

    // 2. Create tour with or without image filename
    const tourInputData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      isActive: formData.isActive,
      ...(imageFilename && { imageFilename }), // Conditionally add imageFilename
    };

    console.log("Creating tour with data:", tourInputData);

    createTour({
      variables: { tourInput: tourInputData },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          &larr; Back to Tours
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Tour</CardTitle>
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
              <Label htmlFor="imageFile">Tour Image</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*" // Accept only image files
                onChange={handleChange}
                className={errors.imageFile || uploadError ? 'border-red-500' : ''}
              />
              {/* Display upload specific error */}
              {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
              {/* Display general form error for file if needed */}
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
            {/* Disable button if either upload or create is loading */}
            <Button type="submit" disabled={uploading || creating}>
              {uploading ? 'Uploading Image...' : creating ? 'Creating Tour...' : 'Create Tour'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
