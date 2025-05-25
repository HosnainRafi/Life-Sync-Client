import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Firebase/AuthProvider';

function AllBloodDonationReq() {
  const [myDonationReq, setMyDonationReq] = useState([]);
  const [control, setControl] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10); // Number of requests per page

  const [userData, setUserData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await axios.get(
        `https://life-sync-server-eight.vercel.app/users/${user?.email}`
      );
      setUserData(data[0]);
    };
    fetchUserData();
  }, [user?.email]);

  useEffect(() => {
    const fetchDonationRequests = async () => {
      const { data } = await axios.get(
        'https://life-sync-server-eight.vercel.app/donation-requests'
      );
      setMyDonationReq(data);
    };
    fetchDonationRequests();
  }, [control]);

  const handleDelete = async _id => {
    await axios.delete(
      `https://life-sync-server-eight.vercel.app/donation-requests/${_id}`
    );
    setControl(!control);
  };

  // Get current posts
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = myDonationReq.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="my-10 lg:my-20 mx-4 lg:mx-10">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Recipient Name</th>
              <th className="px-4 py-2 text-left">Recipient Location</th>
              <th className="px-4 py-2 text-left">Donation Date</th>
              <th className="px-4 py-2 text-left">Donation Time</th>
              <th className="px-4 py-2 text-left">Donation Status</th>
              <th className="px-4 py-2 text-center">Edit</th>
              {userData?.role === 'admin' && (
                <th className="px-4 py-2 text-center">Delete</th>
              )}
              <th className="px-4 py-2 text-center">View Details</th>
              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((item, index) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-left">{index + 1 + (currentPage - 1) * requestsPerPage}</td>
                <td className="px-4 py-3 text-left">{item?.recipientName}</td>
                <td className="px-4 py-3 text-left">{item?.address}</td>
                <td className="px-4 py-3 text-left">{item?.donationDate}</td>
                <td className="px-4 py-3 text-left">{item?.donationTime}</td>
                <td className="px-4 py-3 text-left">{item?.status}</td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/dashboard/edit/${item?._id}`}>
                    <button className="btn btn-outline btn-primary btn-sm">Edit</button>
                  </Link>
                </td>
                <td className="px-4 py-3 text-center">
                  {userData?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(item?._id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/dashboard/view-details/${item?._id}`}>
                    <button className="btn btn-outline btn-sm">Details</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(myDonationReq.length / requestsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className="px-4 py-2 mx-1 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
}

export default AllBloodDonationReq;
