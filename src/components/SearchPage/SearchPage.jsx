import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Firebase/AuthProvider';
import { Link } from 'react-router-dom';

function SearchPage() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [bloodGroup, setBloodGroup] = useState('');
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [donors, setDonors] = useState([]);
  const [disabledRequests, setDisabledRequests] = useState({});

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`https://life-sync-server-eight.vercel.app/users/${user?.email}`);
        if (data && data.length > 0) {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  // Load districts
  useEffect(() => {
    (async () => {
      const res = await fetch('/districts.json');
      const data = await res.json();
      const sorted = data[2].data.sort((a, b) => a.name.localeCompare(b.name));
      setDistricts(sorted);
    })();
  }, []);

  // Load upazilas
  useEffect(() => {
    (async () => {
      const res = await fetch('/upazilas.json');
      const data = await res.json();
      const sorted = data[2].data.sort((a, b) => a.name.localeCompare(b.name));
      setAllUpazilas(sorted);
      setUpazilas(sorted);
    })();
  }, []);

  // Handle district selection
  const handleSelectDistrict = (e) => {
    const districtId = e.target.value;
    const districtObj = districts.find((d) => d.id.toString() === districtId);
    setSelectedDistrictId(districtId);
    setSelectedDistrict(districtObj?.name || '');
    const filtered = allUpazilas.filter((u) => u.district_id.toString() === districtId);
    setUpazilas(filtered);
    setSelectedUpazila('');
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await axios.get('https://life-sync-server-eight.vercel.app/donors', {
      params: {
        bloodGroup,
        district: selectedDistrict,
        upazila: selectedUpazila,
        role: 'Donor',
      },
    });
    setDonors(data);
  };

  // Send email
  const handleRequestEmail = async (donor) => {
    try {
      // 1. Send email
      const emailResponse = await axios.post('https://life-sync-server-eight.vercel.app/send-request-email', {
        donorEmail: donor.email,
        recipientName: userData.name,
        recipientEmail: userData.email,
        recipientPhone: userData.phone,
        recipientLocation: `${userData.district}, ${userData.upazila}`,
        recipientMessage: 'We urgently need your blood. Please help if possible.',
      });
  
      // 2. Save the request in DB so donor can view it later
      const requestPayload = {
        donorName: donor.name,
        donorsEmail: donor.email,
        donorPhone: donor.phone,
        donorDistrict: donor.district,
        donorUpazila: donor.upazila,
        recipientName: userData.name,
        recipientEmail: userData.email,
        recipientPhone: userData.phone,
        recipientDistrict: userData.district,
        recipientUpazila: userData.upazila,
        status: "pending", // You can later update this to "inprogress" or "done"
        createdAt: new Date().toISOString(),
      };
  
      const dbResponse = await axios.post('https://life-sync-server-eight.vercel.app/donation-requests-donor', requestPayload);
  
      if (emailResponse.status === 200 && dbResponse.status === 200) {
        alert('Request sent and saved successfully!');
        setDisabledRequests((prev) => ({ ...prev, [donor.email]: true }));
      } else {
        alert('Something went wrong while sending the request.');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('There was an error sending the request.');
    }
  };

  
  return (
    <div className="container mx-auto my-10 px-4">
      <h2 className="text-3xl font-semibold mb-6">Search Donor Listings</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
            Blood Group
          </label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm"
          >
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">
            District
          </label>
          <select
            id="district"
            value={selectedDistrictId}
            onChange={handleSelectDistrict}
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">
            Upazila
          </label>
          <select
            id="upazila"
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            disabled={!selectedDistrictId}
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm"
          >
            <option value="">Select Upazila</option>
            {upazilas.map((u) => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {donors.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Donor Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded-md">
                <thead className="bg-gray-100 text-sm text-gray-700 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Blood Group</th>
                    <th className="px-4 py-3 text-left">District</th>
                    <th className="px-4 py-3 text-left">Upazila</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Request</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {donors.map((donor) => (
                    <tr key={donor._id || donor.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{donor.name}</td>
                      <td className="px-4 py-2">{donor.email}</td>
                      <td className="px-4 py-2">{donor.bloodGroup}</td>
                      <td className="px-4 py-2">{donor.district}</td>
                      <td className="px-4 py-2">{donor.upazila}</td>
                      <td className="px-4 py-2">{donor.phone}</td>
                      <td className="px-4 py-2">
                        {donor.status === "inprogress"
                          ? "Request Accepted"
                          : donor.status === "done"
                            ? "Donation Complete"
                            : "Active"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRequestEmail(donor)}
                          disabled={disabledRequests[donor.email] || userData.role !== 'Recipient'}
                          className={`text-xs font-medium px-3 py-1 rounded transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 
                            disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400`}
                        >
                          {disabledRequests[donor.email] ? 'Requested' : 'Request'}
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No donors found. Please search above.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
