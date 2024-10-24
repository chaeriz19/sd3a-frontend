import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HouseListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    homeName: "",
    type: "",
    availability: false,
    address: "",
    city: "",
    state: "",
    zip: "",
    squareMeters: "",
    price: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormValid = () => {
    return (
      formData.homeName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.zip.trim() !== "" &&
      price > 0 &&
      image !== null
    );
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle price changes with validation
  const handlePriceChange = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100000000)) {
      setPrice(value === "" ? 0 : Number(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/d/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is being sent
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("House listing created successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.message || "An error occurred.");
      }
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-prim-green mt-8 p-8 font-bold text-6xl text-white text-center">
        Huisvest
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8 p-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Create House Listing</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="homeName" className="block font-medium mb-1">
                Home Name
              </label>
              <input
                type="text"
                id="homeName"
                value={formData.homeName}
                onChange={handleInputChange}
                placeholder="Enter home name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block font-medium mb-1">
                Type
              </label>
              <input
                type="text"
                id="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Enter type"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block font-medium mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block font-medium mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="zip" className="block font-medium mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Enter zip code"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="squareMeters" className="block font-medium mb-1">
                Square Meters
              </label>
              <input
                type="number"
                id="squareMeters"
                value={formData.squareMeters}
                onChange={handleInputChange}
                placeholder="Enter square meters"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="price" className="block font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="bedrooms" className="block font-medium mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Enter number of bedrooms"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block font-medium mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Enter number of bathrooms"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-medium">Available</label>
            </div>

            {/* Moved Image Upload to the Last Position */}
            <div>
              <label htmlFor="image" className="block font-medium mb-1">
                Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full font-bold py-2 rounded ${
                isFormValid()
                  ? "bg-tert-blue hover:bg-[#419695] duration-200 ease-in-out transform"
                  : "bg-tert-blue opacity-50 cursor-not-allowed"
              } text-white`}
              disabled={!isFormValid()}
            >
              Submit Listing
            </button>
          </form>
        </div>

        {/* House Details Display */}
        <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">House Details</h2>
          <div className="mb-2">
            <strong>Home Name:</strong> {formData.homeName}
          </div>
          <div className="mb-2">
            <strong>Type:</strong> {formData.type}
          </div>
          <div className="mb-2">
            <strong>Price:</strong> ${price}
          </div>
          <div className="mb-2">
            <strong>Bedrooms:</strong> {formData.bedrooms}
          </div>
          <div className="mb-2">
            <strong>Bathrooms:</strong> {formData.bathrooms}
          </div>
          <div className="mb-2">
            <strong>Square Meters:</strong> {formData.squareMeters}
          </div>
          <div className="mb-2">
            <strong>Image:</strong> {image ? image.name : "No image selected"}
          </div>
          <div className="mb-2">
            <strong>Description:</strong> {formData.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseListing;
