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

    fontSize: 14
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/districts.json");
      const data = await res.json();
      setDistricts(data[2].data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/upazilas.json");
      const data = await res.json();
      setUpazilas(data[2].data);
    })();
  }, []);

  const handleSelectDistrict = (e) => {
    const districtName = e.target.value;
    const selectedDistrict = districts.find(
      (item) => item.name === districtName
    );

    if (selectedDistrict) {
      const filteredUpazilas = upazilas.filter(
        (item) => item.district_id === selectedDistrict.id // Ensure matching IDs
      );
      setSelectedUpazilas(filteredUpazilas);
    } else {
      setSelectedUpazilas([]);
    }
  };

  const handleSubmit = async e => {
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
        'https://lifesyncserver2.vercel.app/donation-requests',
        donationRequest
      );
      console.log(res);
      if (res.data.insertedId) {
        Swal.fire('Successful Added Donation Information');
        navigate('/dashboard/my-donation-request');
      }
    } catch (error) {
      console.error('Error creating donation request:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://lifesyncserver2.vercel.app/users/${user?.email}`
      );
      setUserData(data[0]);
    })();
  }, [user?.email]);
  console.log(userData);
  return (
    <>
      {userData?.status === 'block' ? (
        <p className="text-4xl font-semibold my-8 lg:my-12 text-center text-red-500">
          You are a blocked User
        </p>
      ) : (
        <div className="max-w-5xl mx-auto  w-full">
          <h2 className="text-3xl font-bold mb-4 text-center my-8 md:my-14">
            Donation Request Form
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-6 rounded-lg w-full"
          >
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Requester Name
              </label>
              <input
                type="text"
                disabled
                required
                placeholder="Name"
                defaultValue={user?.displayName}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Requester Email
              </label>
              <input
                type="text"
                disabled
                required
                placeholder="Name"
                defaultValue={user?.email}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="recipientName"
              >
                Recipient Name
              </label>
              <input
                type="text"
                name="recipientName"
                id="name"
                required
                placeholder="Name"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="recipientName"
              >
                Phone number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                required
                placeholder="Phone Number"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
            <div className="relative w-full mb-3" style={style}>
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="bloodGroup"
              >
                Blood Group
              </label>
              <select
                name="bloodGroup"
                id="bloodGroup"
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
          

            <div className="relative mt-4" style={style}>
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="recipientDistrict"
              >
                District
              </label>
              <select
                name="recipientDistrict"
                required
                onChange={handleSelectDistrict} // Use onChange instead of onBlur
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


            <div className="relative mt-4" style={style}>
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="recipientUpazila"
              >
                Upazila
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


            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="hospitalName"
              >
                Hospital Name
              </label>
              <input
                type="text"
                name="hospitalName"
                required
                id="hospitalName"
                placeholder="Hospital Name"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="address"
              >
                Full Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                placeholder="Full Address"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="donationDate"
              >
                Donation Date
              </label>
              <input
                type="date"
                required
                name="donationDate"
                id="donationDate"
                placeholder="Donation Date"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="donationTime"
              >
                Donation Time
              </label>
              <input
                type="time"
                required
                name="donationTime"
                id="donationTime"
                placeholder="Donation Time"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Request Message
              </label>
              <textarea
                placeholder="Description"
                name="textarea"
                required
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
