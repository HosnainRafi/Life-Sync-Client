import  { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Firebase/AuthProvider';

function MyDonationReq() {
  const [myDonationReq, setMyDonationReq] = useState([]);
  const [control, setControl] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [donationsPerPage] = useState(5); // Set donations per page
  const { user } = useContext(AuthContext);
  const [statusFilter, setStatusFilter] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://localhost:5000/donation-requests/${user?.email}`
      );
      setMyDonationReq(data);
    })();
  }, [control, user?.email]);

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:5000/donation-requests/${id}`
        );
        if (response.data.deletedCount) {
          Swal.fire(
            'Deleted!',
            'Your donation request has been deleted.',
            'success'
          );
          setControl(!control);
        }
      }
    });
  };

  const handleStatusChange = event => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter donations
  const filteredDonations = statusFilter
    ? myDonationReq.filter(donation => donation.status === statusFilter)
    : myDonationReq;

  // Get current donations
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = filteredDonations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="my-10 lg:my-20 mx-4 lg:mx-10">
      {/* Filter by Status */}
      <div className="mb-6">
        <label
          className="block text-gray-800 text-lg font-semibold mb-2"
          htmlFor="status"
        >
          Filter by Status
        </label>
        <select
          id="status"
          value={statusFilter}
          onChange={handleStatusChange}
          className="block w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
  
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Recipient Name</th>
              <th className="px-4 py-3 text-left">Recipient Location</th>
              <th className="px-4 py-3 text-left">Donation Date</th>
              <th className="px-4 py-3 text-left">Donation Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Edit</th>
              <th className="px-4 py-3 text-left">Delete</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {currentDonations.map((item, index) => (
              <tr key={item._id}>
                <td className="px-4 py-3">{index + 1 + (currentPage - 1) * donationsPerPage}</td>
                <td className="px-4 py-3">{item.recipientName}</td>
                <td className="px-4 py-3">{item.address}</td>
                <td className="px-4 py-3">{item.donationDate}</td>
                <td className="px-4 py-3">{item.donationTime}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : item.status === "inprogress"
                        ? "bg-blue-200 text-blue-800"
                        : item.status === "done"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/dashboard/edit/${item._id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Edit
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/dashboard/view-details/${item._id}`}>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from(
          { length: Math.ceil(filteredDonations.length / donationsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 mx-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
  
}

export default MyDonationReq;
