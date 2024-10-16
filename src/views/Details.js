import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiBookmark } from "react-icons/hi";
import Header from "../components/Header";
import axios from "axios";
import ApiConnection from "../components/ApiConnection";
import MoneyFormat from "../components/MoneyFormat";
import DashboardCards from "../components/DashboardCards"; // Assuming Card component is imported from this path
import { formatDistanceToNow } from "date-fns";

export default function Details() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [bidAmount, setBidAmount] = useState(""); // State for bid amount
  const [bidMessage, setBidMessage] = useState(""); // State for success/error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch main property details
        const propertyResponse = await axios({
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          url: `${ApiConnection()}/api/content/${id}`,
        });
        setApiData(propertyResponse.data);

        // Fetch featured properties
        const featuredResponse = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          url: `${ApiConnection()}/api/content`, // Adjust this endpoint to your actual API
        });
        setFeaturedProperties(featuredResponse.data.data);
      } catch (err) {
        setError("Error fetching data. Please try again." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to handle bid placement
  const handlePlaceBid = async () => {
    if (!bidAmount) {
      setBidMessage("Please enter a valid bid amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const bidResponse = await axios({
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        url: `${ApiConnection()}/api/bids`,
        data: {
          receiver_id: apiData.user_id, // assuming `user_id` is the property owner
          bid: bidAmount,
        },
      });

      // Display success message if the bid is placed successfully
      setBidMessage("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid", error);
      setBidMessage("Error placing bid. Please try again.");
    }
  };

  // Display loading screen while data is being fetched
  if (loading) {
    return (
      <div>
        <Header />
        <div className="text-center py-5">Loading...</div>
      </div>
    );
  }

  // Display error message if something goes wrong
  if (error) {
    return (
      <div>
        <Header />
        <div className="text-center py-5 text-red-500">{error}</div>
      </div>
    );
  }

  // Format the time since the property was created
  const timeAgo = formatDistanceToNow(new Date(apiData.created_at), {
    addSuffix: true,
  });

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Property Details */}
        <div className="col-span-2">
          <div className="rounded-md overflow-hidden shadow-lg bg-white">
            <img
              className="w-full object-cover h-64"
              src={
                apiData.type === "apartment"
                  ? "https://images.pexels.com/photos/565324/pexels-photo-565324.jpeg"
                  : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
              alt="Property"
            />

            <div className="p-6 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">{apiData.title}</h2>
                {!apiData.availability && (
                  <div className="bg-red-200 font-bold rounded-md text-red-400 px-2 ml-4 text-xs">
                    Sold
                  </div>
                )}
              </div>

              <div className="mb-4 text-gray-500">Listed {timeAgo}</div>
              <MoneyFormat amount={apiData.price} />

              <div className="border-t border-gray-200 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Address:</h3>
                  <p>
                    {apiData.address}, {apiData.zip}, {apiData.state}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Property Type:</h3>
                  <p>{apiData.type.charAt(0).toUpperCase() + apiData.type.slice(1)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Bedrooms:</h3>
                  <p>{apiData.bedrooms}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Bathrooms:</h3>
                  <p>{apiData.bathrooms}</p>
                </div>
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold">Description:</h3>
                  <p>{apiData.description}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <button className="bg-blue-50 p-1 rounded-md">
                  <HiBookmark className="w-6 h-6" />
                </button>
              </div>

              {/* Bidding Section */}
              <div className="flex justify-end mt-4">
                <input
                  type="number"
                  placeholder="$"
                  className="border border-gray-300 rounded mr-4"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)} // Handle bid amount input
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handlePlaceBid} // Call the bid placing function
                >
                  Place Bid
                </button>
              </div>

              {/* Display bid success/error message */}
              {bidMessage && <div className="mt-4 text-green-500">{bidMessage}</div>}
            </div>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Featured Properties</h2>
          {featuredProperties.slice(0, 4).map((card) => (
            <React.Fragment key={card.id}>
              <DashboardCards
                id={card.id}
                type={card.type}
                title={card.address}
                price={card.price}
                m2={card.m2}
                bedrooms={card.bedrooms}
                bathrooms={card.bathrooms}
                city={card.city}
                availability={card.availability}
                created_at={card.created_at}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
