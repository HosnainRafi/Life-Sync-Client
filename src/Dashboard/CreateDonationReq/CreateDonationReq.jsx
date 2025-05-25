import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CreateDonationReq() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedUpazilas, setSelectedUpazilas] = useState([]);
  const [userData, setUserData] = useState([]);

  const style = {
    fontSize: 14,
  };

  useEffect(() => {
  (async () => {
    const res = await fetch('/districts.json');
    const data = await res.json();
    const sortedDistricts = data[2].data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setDistricts(sortedDistricts);
  })();
}, []);

useEffect(() => {
  (async () => {
    const res = await fetch('/upazilas.json');
    const data = await res.json();
    const sortedUpazilas = data[2].data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setUpazilas(sortedUpazilas);
  })();
}, []);

  const handleSelectDistrict = (e) => {
    const districtName = e.target.value;
    const selectedDistrict = districts.find(
      (item) => item.name === districtName
    );

    if (selectedDistrict) {
      const filteredUpazilas = upazilas.filter(
        (item) => item.district_id === selectedDistrict.id
      );
      setSelectedUpazilas(filteredUpazilas);
    } else {
      setSelectedUpazilas([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const recipientName = form.recipientName.value;
    const bloodGroup = form.bloodGroup.value;
    const phoneNumber = form.phoneNumber.value;
    const recipientDistrict = form.recipientDistrict.value;
    const recipientUpazila = form.recipientUpazila.value;
    const hospitalName = form.hospitalName.value;
    const address = form.address.value;
    const donationDate = form.donationDate.value;
    const donationTime = form.donationTime.value;
    const description = form.textarea.value;
    const email = user?.email;

    const donationRequest = {
      recipientName,
      bloodGroup,
      phoneNumber,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      address,
      donationDate,
      donationTime,
      description,
      status: 'pending',
      email,
    };

    try {
      const res = await axios.post(
        'http://localhost:5000/donation-requests',
        donationRequest
      );
      if (res.data.insertedId) {
        Swal.fire('Successfully added donation request');
        navigate('/dashboard/my-donation-request');
      }
    } catch (error) {
      console.error('Error creating donation request:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://localhost:5000/users/${user?.email}`
      );
      setUserData(data[0]);
    })();
  }, [user?.email]);

  return (
    <>
      {userData?.status === 'block' ? (
        <p className="text-4xl font-semibold my-8 lg:my-12 text-center text-red-500">
          You are a blocked User
        </p>
      ) : (
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4 text-center my-8 md:my-14">
            Donation Request Form
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-6 rounded-lg w-full"
          >
            {/* Requester Name */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Requester Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                required
                defaultValue={user?.displayName}
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Requester Email */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Requester Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                required
                defaultValue={user?.email}
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Recipient Name */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                required
                placeholder="Name"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Phone Number */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                placeholder="Phone Number"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Blood Group */}
            <div className="relative w-full mb-3" style={style}>
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                required
                className="block w-full pl-4 py-3 text-gray-950 bg-white border border-gray-300 rounded-lg"
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

            {/* District */}
            <div className="relative mt-4" style={style}>
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="recipientDistrict"
                required
                onChange={handleSelectDistrict}
                className="block w-full pl-4 py-3 text-gray-950 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select District Name</option>
                {districts.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div className="relative mt-4" style={style}>
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Upazila <span className="text-red-500">*</span>
              </label>
              <select
                name="recipientUpazila"
                required
                className="block w-full pl-4 py-3 text-gray-950 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select Upazila Name</option>
                {selectedUpazilas.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Name */}
            <div className="relative w-full mb-3 mt-4">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hospitalName"
                required
                placeholder="Hospital Name"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Address */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Full Address"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Donation Date */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Donation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="donationDate"
                required
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Donation Time */}
            <div className="relative w-full mb-3">
              <label className="block text-blueGray-600 text-xs font-bold mb-2">
                Donation Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="donationTime"
                required
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              />
            </div>

            {/* Request Message */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Request Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="textarea"
                required
                placeholder="Description"
                className="textarea textarea-bordered textarea-sm w-full max-w-5xl"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Request
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateDonationReq;
