import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function DonationRequestEdit() {
  const { user } = useContext(AuthContext);
  const { _id } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [district, setDistrict] = useState([]);
  const [upazila, setUpazila] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredUpazila, setFilteredUpazila] = useState([]);
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [control, setControl] = useState(false);
  const navigate = useNavigate();

  const style = {

    fontSize: 14
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://lifesyncserver2.vercel.app/donation-requests/view-details/${_id}`
        );
        setDetailsData(response.data);
        setSelectedBloodGroup(response.data?.bloodGroup || ""); // Ensure it sets the value properly
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [_id]);
  
  const [data] = detailsData;

  useEffect(() => {
    (async () => {
      const res = await fetch('/districts.json');
      const data = await res.json();
      const sortedDistricts = data[2].data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDistrict(sortedDistricts);
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      const res = await fetch('/upazilas.json');
      const data = await res.json();
      const sortedUpazilas = data[2].data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setUpazila(sortedUpazilas);
    })();
  }, []);
  
  const handleBloodGroupChange = (e) => {
    setSelectedBloodGroup(e.target.value);
  };

  useEffect(() => {
    if (data?.recipientDistrict && !selectedDistrict) {
      setSelectedDistrict(data.recipientDistrict);
      filterUpazilaList(data.recipientDistrict, data.recipientUpazila);
    }
  }, [data, district, upazila]);
  
  const filterUpazilaList = (districtName, upazilaName = '') => {
    const districtObj = district.find((item) => item.name === districtName);
    if (districtObj) {
      const filteredList = upazila.filter(
        (item) => item.district_id === districtObj.id
      );
      setFilteredUpazila(filteredList);
      if (upazilaName) {
        setSelectedUpazila(upazilaName);
      }
    }
  };
  


  const handleSelectDistrict = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setSelectedUpazila(''); // Reset upazila when district changes
    filterUpazilaList(districtName);
  };
  

 
  const handleSelectUpazila = (e) => {
    setSelectedUpazila(e.target.value);
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
      const res = await axios.patch(
        `https://lifesyncserver2.vercel.app/donation-requests/edit/${_id}`,
        donationRequest
      );
      if (res.data.modifiedCount) {
        Swal.fire('Successful updated Information');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating donation request:', error);
    }
  };
  return (
    <div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold lg:font-bold my-8 lg:my-14 text-center ">
        Edit Donation Request{' '}
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
            defaultValue={data?.recipientName}
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
                defaultValue={data?.phoneNumber}
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
      value={selectedBloodGroup} // Ensuring the value is set correctly
      onChange={handleBloodGroupChange} 
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
            value={selectedDistrict}
            onChange={handleSelectDistrict}
            className="block w-full pl-4 py-3 text-gray-950 bg-white border border-gray-300 rounded-lg"
          
          >
            <option value="" disabled>
              Select District Name
            </option>
            {district.map((item) => (
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
            value={selectedUpazila}
            onChange={handleSelectUpazila}
            className="block w-full pl-4 py-3 text-gray-950 bg-white border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              Select Upazila Name
            </option>
            {filteredUpazila.map((item) => (
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
            defaultValue={data?.hospitalName}
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
            defaultValue={data?.address}
            id="address"
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
            name="donationDate"
            defaultValue={data?.donationDate}
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
            name="donationTime"
            defaultValue={data?.donationTime}
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
            defaultValue={data?.description}
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
  );
}

export default DonationRequestEdit;
