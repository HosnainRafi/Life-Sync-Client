import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DonationRequest() {
  const [donationRequest, setDonationRequest] = useState([]);

  useEffect(() => {
    (async () => {
      const status = "pending";
      const { data } = await axios.get(
        `http://localhost:5000/donation-requests/home/${status}`
      );
      setDonationRequest(data);
    })();
  }, []);

  return (
    <div className="my-12 lg:my-20">
      <h2 className="text-4xl lg:text-5xl font-semibold lg:font-bold text-center mb-4 lg:mb-6">
        Donation Request Page
      </h2>

      {donationRequest.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            {/* Table Head */}
            <thead>
              <tr>
                <th></th>
                <th>Recipient Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Details</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {donationRequest.map((donation, index) => (
                <tr key={donation?._id} className="bg-base-200">
                  <th>{index + 1}</th>
                  <td>{donation?.recipientName}</td>
                  <td>
                    {donation?.recipientUpazila}, {donation?.recipientDistrict}
                  </td>
                  <td>{donation?.donationDate}</td>
                  <td>{donation?.donationTime}</td>
                  <td>
                    <Link to={`/view-details/${donation?._id}`}>
                      <button style={{color: "white"}} className="btn btn-success">View Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          No donation requests found.
        </p>
      )}
    </div>
  );
}

export default DonationRequest;
