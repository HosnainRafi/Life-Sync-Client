import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DonationViewDetails() {
  const { _id } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [control, setControl] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `https://life-sync-server-eight.vercel.app/donation-requests/view-details/${_id}`
      );
      setDetailsData(response.data);
      setControl(!control);
    })();
  }, [control, _id]);
  console.log(detailsData);
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {detailsData.map((data) => (
        <div
          key={data?._id}
          className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
            Donation Details
          </h1>
  
          {/* Recipient Information */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Recipient Information
            </h2>
            <p className="text-gray-700"><strong>Name:</strong> {data.recipientName}</p>
            <p className="text-gray-700"><strong>District:</strong> {data.recipientDistrict}</p>
            <p className="text-gray-700"><strong>Upazila:</strong> {data.recipientUpazila}</p>
          </div>
  
          {/* Donation Information */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Donation Information
            </h2>
            <p className="text-gray-700"><strong>Hospital Name:</strong> {data.hospitalName}</p>
            <p className="text-gray-700"><strong>Date:</strong> {data.donationDate}</p>
            <p className="text-gray-700"><strong>Time:</strong> {data.donationTime}</p>
            <p
              className={`font-bold ${
                data.status === "pending"
                  ? "text-yellow-500"
                  : data.status === "completed"
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
            >
              <strong>Status:</strong> {data.status}
            </p>
          </div>
  
          {/* Contact Information */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Contact Information
            </h2>
            <p className="text-gray-700"><strong>Email:</strong> {data.email}</p>
          </div>
  
          {/* Address */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">Address</h2>
            <p className="text-gray-700">{data.address}</p>
          </div>
  
          {/* Description */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">Description</h2>
            <p className="text-gray-700">{data.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
}

export default DonationViewDetails;
