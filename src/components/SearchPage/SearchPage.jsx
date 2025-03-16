import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(""); // Store district ID for the dropdown
const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [donors, setDonors] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]); // Store all upazilas

  useEffect(() => {
    (async () => {
      const res = await fetch("/districts.json");
      const data = await res.json();
      const sortedDistricts = data[2].data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDistricts(sortedDistricts);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/upazilas.json");
      const data = await res.json();
      const sortedUpazilas = data[2].data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setAllUpazilas(sortedUpazilas); // Store full list separately
      setUpazilas(sortedUpazilas);
    })();
  }, []);

  const handleSelectDistrict = (e) => {
    const districtId = e.target.value;
    const selectedDistrictObj = districts.find(d => d.id.toString() === districtId);
  
    if (selectedDistrictObj) {
      setSelectedDistrictId(selectedDistrictObj.id); // Store ID for UI
      setSelectedDistrict(selectedDistrictObj.name); // Store Name for API (this is important)
      setSelectedDistrictName(selectedDistrictObj.name); // Store Name for display if needed
    } else {
      setSelectedDistrictId("");
      setSelectedDistrict("");
      setSelectedDistrictName("");
    }
  
    // Filter Upazilas based on selected district ID
    const filteredUpazilas = allUpazilas.filter(
      (item) => item.district_id.toString() === districtId
    );
    
    setUpazilas(filteredUpazilas);
    setSelectedUpazila(""); // Reset upazila selection
  };
  
  



  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      'https://lifesyncserver2.vercel.app/donors',
      {
        params: {
          bloodGroup,
          district: selectedDistrict, // Now passing the district name
          upazila: selectedUpazila,
        },
      }
    );
    setDonors(data);
  };
  

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-6">Search Donation Listings</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label
            htmlFor="bloodGroup"
            className="block text-sm font-medium text-gray-700"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={e => setBloodGroup(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700"
          >
            District
          </label>
          <select
  id="district"
  value={selectedDistrictId} // Use ID to ensure correct selection in UI
  onChange={handleSelectDistrict}
  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select District</option>
  {districts.map((district) => (
    <option key={district.id} value={district.id}>
      {district.name}
    </option>
  ))}
</select>


        </div>


        <div>
          <label
            htmlFor="upazila"
            className="block text-sm font-medium text-gray-700"
          >
            Upazila
          </label>
          <select
  id="upazila"
  value={selectedUpazila}
  onChange={(e) => setSelectedUpazila(e.target.value)}
  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  disabled={!selectedDistrictId} // Enable only when a district is selected
>
  <option value="">Select Upazila</option>
  {upazilas.map((item) => (
    <option key={item.id} value={item.name}>
      {item.name}
    </option>
  ))}
</select>

        </div>

        <button
          type="submit"
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </form>



      <div className="mt-10">
        {donors.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Donor Results</h3>
            <div className="overflow-x-auto">
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
        <th className="px-4 py-3 text-center">Details</th>
      </tr>
    </thead>
    <tbody className="text-gray-700 text-sm">
      {donors.map((donor) => (
        <tr key={donor.id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap">{donor.recipientName}</td>
          <td className="px-4 py-3 whitespace-nowrap">{donor.bloodGroup}</td>
          <td className="px-4 py-3 whitespace-nowrap">{donor.recipientDistrict}</td>
          <td className="px-4 py-3 whitespace-nowrap">{donor.recipientUpazila}</td>
          <td className="px-4 py-3 whitespace-nowrap">{donor.phoneNumber}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            {donor.status === "inprogress"
              ? "Request Accepted"
              : donor.status === "active"
              ? "Active"
              : donor.status === "done"
              ? "Donation Complete"
              : donor.status}
          </td>
          <td className="px-4 py-3 whitespace-nowrap">{donor.address}</td>
          <td className="px-4 py-3 text-center">
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

          </div>
        ) : (
          <p className="text-gray-500">
            No donors found. Please search using the form above.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
