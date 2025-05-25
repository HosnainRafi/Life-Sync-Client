import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


function ViewDetails() {
  const { user } = useContext(AuthContext);
  const [donationRequestSingleData, setDonationRequestSingleData] = useState(
    []
  );
  const [control, setControl] = useState(false);
  const [userData, setUserData] = useState(null);
  const { _id } = useParams();
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://life-sync-server-eight.vercel.app/donation-requests/single/${_id}`
      );
      setDonationRequestSingleData(data);
    })();
  }, [_id, control]);
  console.log(donationRequestSingleData);
  console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `https://life-sync-server-eight.vercel.app/users/${user?.email}`
        );
        if (data && data.length > 0) {
          setUserData(data[0]);
        }
      } catch (error) {
        toast.error('Error fetching user data');
        console.error(error);
      }
    };
  
    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);



  const handleDonate = () => {
    Swal.fire({
      title: 'Want to Donate?',
      text: 'An email will be sent to the recipient with your confirmation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I want to Donate!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          // 1. Update donation request
          const response = await axios.patch(
            `https://life-sync-server-eight.vercel.app/donation-requests/single-update/${_id}`,
            { donorsEmail: user.email }
          );
  
          if (response.data.modifiedCount) {
            // 2. Send confirmation email
            await axios.post(`https://life-sync-server-eight.vercel.app/send-donation-confirmation`, {
              donorName: user.displayName || 'A donor',
              donorEmail: user.email,
              donorPhone: userData?.phoneNumber || 'Not provided',
              recipientEmail: donationRequestSingleData[0]?.email,
              hospitalName: donationRequestSingleData[0]?.hospitalName,
              donationDate: donationRequestSingleData[0]?.donationDate,
              donationTime: donationRequestSingleData[0]?.donationTime,
            });
  
            Swal.fire(
              'Confirmed!',
              'Donation status updated & email sent to the recipient!',
              'success'
            );
            setControl(!control);
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to update status or send email', 'error');
          console.error('Error:', error);
        }
      }
    });
  };
  
  

  
  return (
    <div className="my-8 lg:my-12 px-4">
      {donationRequestSingleData.map((data) => (
        <div
          key={data?._id}
          className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        >
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
            <p className="text-gray-700"><strong>Phone:</strong> {data.phoneNumber}</p>
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
  
          {/* Donate Button */}
          {data?.status === "pending" && (
            <div className="text-center">
              <button
                onClick={handleDonate}
                className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-md 
                           hover:bg-blue-700 transition-all duration-300 active:scale-95"
              >
                Donate
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
}

export default ViewDetails;
