import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DonationRequest() {
  const [donationRequest, setDonationRequest] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [bloodGroup, setBloodGroup] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://life-sync-server-eight.vercel.app/donation-requests-new");
      setDonationRequest(res.data);
      setFilteredRequests(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/districts.json");
      const data = await res.json();
      setDistricts(data[2].data.sort((a, b) => a.name.localeCompare(b.name)));
    })();
    (async () => {
      const res = await fetch("/upazilas.json");
      const data = await res.json();
      setAllUpazilas(data[2].data.sort((a, b) => a.name.localeCompare(b.name)));
    })();
  }, []);

  const handleSelectDistrict = (e) => {
    const id = e.target.value;
    const district = districts.find((d) => d.id.toString() === id);
    if (district) {
      setSelectedDistrictId(id);
      setSelectedDistrictName(district.name);
      setUpazilas(allUpazilas.filter(u => u.district_id.toString() === id));
    } else {
      setSelectedDistrictId("");
      setSelectedDistrictName("");
      setUpazilas([]);
    }
    setSelectedUpazila("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = donationRequest.filter(item =>
      (!bloodGroup || item.bloodGroup === bloodGroup) &&
      (!selectedDistrictName || item.recipientDistrict === selectedDistrictName) &&
      (!selectedUpazila || item.recipientUpazila === selectedUpazila) &&
      (!status || item.status === status)
    );
    setFilteredRequests(filtered);
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-6">Search Donation Requests</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={e => setBloodGroup(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
          <select
            id="district"
            value={selectedDistrictId}
            onChange={handleSelectDistrict}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">Upazila</label>
          <select
            id="upazila"
            value={selectedUpazila}
            onChange={e => setSelectedUpazila(e.target.value)}
            disabled={!selectedDistrictId}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Upazila</option>
            {upazilas.map(u => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">Request Accepted</option>
            {/* <option value="active">Active</option> */}
            <option value="done">Donation Complete</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Donation Requests</h3>
            <table className="w-full min-w-max border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Blood Group</th>
                  <th className="px-4 py-3 text-left">District</th>
                  <th className="px-4 py-3 text-left">Upazila</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredRequests.map((donor) => (
                  <tr key={donor._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{donor.recipientName}</td>
                    <td className="px-4 py-3">{donor.bloodGroup}</td>
                    <td className="px-4 py-3">{donor.recipientDistrict}</td>
                    <td className="px-4 py-3">{donor.recipientUpazila}</td>
                    <td className="px-4 py-3">{donor.phoneNumber}</td>
                    <td className="px-4 py-3">
                      {donor.status === "inprogress"
                        ? "Request Accepted"
                        : donor.status === "active"
                        ? "Active"
                        : donor.status === "done"
                        ? "Donation Complete"
                        : donor.status}
                    </td>
                    <td className="px-4 py-3">{donor.address}</td>
                    <td className="px-4 py-3">
                      <Link to={`/view-details/${donor._id}`}>
                        <button className="px-3 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold">
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
          <p className="text-gray-500">No donation requests found.</p>
        )}
      </div>
    </div>
  );
}

export default DonationRequest;
