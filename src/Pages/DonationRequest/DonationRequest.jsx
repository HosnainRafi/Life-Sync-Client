import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DonationRequest() {
  const [donationRequest, setDonationRequest] = useState([]);

  useEffect(() => {
    (async () => {
      const status = "pending";
      const { data } = await axios.get(
        `https://life-sync-server-eight.vercel.app/donation-requests/home/${status}`
      );
      setDonationRequest(data);
    })();
  }, []);

  return (
    <div className="my-12 lg:my-20">
      <h2 className="text-3xl font-semibold mb-6">Donation Request Page
      </h2>
        

      {donationRequest.length > 0 ? (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Group
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upazila
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donationRequest.map((donor) => (
              <tr key={donor.id}>
                <td className="px-6 py-4 whitespace-nowrap">{donor.recipientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.bloodGroup}</td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.recipientDistrict}</td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.recipientUpazila}</td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donor.status === "inprogress"
                    ? "Request Accepted"
                    : donor.status === "active"
                    ? "Active"
                    : donor.status === "done"
                    ? "Donation Complete"
                    : donor.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">{donor.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link to={`/view-details/${donor?._id}`}>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      View Details
                    </button>
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
