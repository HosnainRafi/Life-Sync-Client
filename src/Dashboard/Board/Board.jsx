import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import axios from 'axios';
import AdminAnalysis from './AdminAnalysis';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function Board() {
  const [userData, setUserData] = useState([]);
  const [realData, setRealData] = useState([]);
  const { user } = useContext(AuthContext);
  const [control, setControl] = useState(false);
  const [myDonationReq, setMyDonationReq] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://life-sync-server-eight.vercel.app/users/${user?.email}`
      );
      setUserData(data[0]);
    })();
  }, [user?.email]);

  useEffect(() => {
    (async () => {
      if (!user?.email) return;
      try {
        const { data } = await axios.get(
          `https://life-sync-server-eight.vercel.app/donation-requests/donor/${user?.email}`
        );
        setRealData(data);
        setMyDonationReq(data);
      } catch (error) {
        console.error("Error fetching donation requests:", error);
      }
    })();
  }, [control, user?.email]);

  const handleAccept = async (id) => {
    try {
      const response = await axios.patch(
        `https://life-sync-server-eight.vercel.app/donation-requests/accept/${id}`
      );
  
      if (response.data.modifiedCount) {
        // Fetch the updated request to get recipient details
        const { data: requestData } = await axios.get(
          `https://life-sync-server-eight.vercel.app/donation-requests/single/${id}`
        );
        const request = requestData[0]; // Assuming it's in an array
  
        // Get donor info (from your userData state)
        const emailPayload = {
          donorName: userData?.name,
          donorEmail: userData?.email,
          donorPhone: userData?.phone,
          recipientEmail: request?.recipientEmail,
        };
  
        // Send the email
        await axios.post('https://life-sync-server-eight.vercel.app/send-donation-confirmation-accept', emailPayload);
  
        Swal.fire('You have accepted the donation request and the recipient has been notified!');
        setControl(!control);
      }
    } catch (err) {
      console.error('Error accepting request or sending email:', err);
      Swal.fire('Failed to accept request or send email.');
    }
  };
  

  const handleDone = async id => {
    const response = await axios.patch(
      `https://life-sync-server-eight.vercel.app/donation-requests/done/${id}`
    );
    if (response.data.modifiedCount) {
      Swal.fire('Successfully updated status to Done');
      setControl(!control);
    }
  };

  const handleCancel = async id => {
    const response = await axios.patch(
      `https://life-sync-server-eight.vercel.app/donation-requests/cancel/${id}`
    );
    if (response.data.modifiedCount) {
      Swal.fire('Successfully Cancelled Request');
      setControl(!control);
    }
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `https://life-sync-server-eight.vercel.app/donation-requests/${id}`
        );
        if (response.data.deletedCount) {
          Swal.fire('Successfully Deleted Request');
          setControl(!control);
        }
      }
    });
  };

  const handleViewAllRequest = () => {
    navigate('/dashboard/my-donation-request');
  };

  const getStatusBadge = status => {
    const colorMap = {
      pending: 'badge-warning',
      inprogress: 'badge-info',
      done: 'badge-success',
      cancelled: 'badge-error',
    };
    return (
      <span className={`badge ${colorMap[status] || 'badge-neutral'} capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold m-6 md:m-10 text-center">
        Hello {userData?.name}. Welcome to LifeSync
      </h2>

      {userData?.role === 'Donor' && (
        <>
          {myDonationReq.length > 0 ? (
            <div className="overflow-auto">
              <table className="min-w-[900px] table table-xs table-pin-rows table-pin-cols">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Recipient Name</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {myDonationReq.map((donation, index) => (
                    <tr key={donation?._id}>
                      <td>{index + 1}</td>
                      <td>{donation?.recipientName}</td>
                      <td>
                        {donation?.recipientUpazila}, {donation?.recipientDistrict}
                      </td>
                      <td>{donation?.donationDate}</td>
                      <td>{donation.donationTime}</td>
                      <td>{getStatusBadge(donation?.status)}</td>
                      <td>
                        {donation?.status === 'pending' && (
                          <button
                            onClick={() => handleAccept(donation?._id)}
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                        )}
                        {donation?.status === 'inprogress' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDone(donation?._id)}
                              className="btn btn-primary btn-sm"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleCancel(donation?._id)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <Link to={`/dashboard/edit/${donation?._id}`}>
                          <button className="btn btn-outline btn-primary btn-sm">
                            Edit
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(donation?._id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <Link to={`/dashboard/view-details/${donation?._id}`}>
                          <button className="btn btn-outline btn-sm">Details</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* {realData.length > 0 && (
                <div className="text-center my-8 lg:my-12">
                  <button
                    onClick={handleViewAllRequest}
                    className="btn btn-primary"
                  >
                    View All My Requests
                  </button>
                </div>
              )} */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-10 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Data"
                className="w-32 h-32 mb-4 opacity-70"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Donation Requests Yet
              </h3>
              <p className="text-gray-500 mb-4 max-w-md">
                You haven’t accepted any donation requests yet. Once someone selects you as a donor,
                their requests will appear here.
              </p>
              <Link to="/donation-request">
                <button className="btn btn-primary">Explore Available Requests</button>
              </Link>
            </div>
          )}
        </>
      )}

      {userData?.role === 'Recipient' && (
        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            You can create a new blood donation request.
          </h3>
          <Link to="/dashboard/create-donation-request">
            <button className="btn btn-primary mt-4">Request for Blood</button>
          </Link>
        </div>
      )}

      {(userData?.role === 'admin' || userData?.role === 'volunteer') && (
        <AdminAnalysis />
      )}
    </div>
  );
}

export default Board;
