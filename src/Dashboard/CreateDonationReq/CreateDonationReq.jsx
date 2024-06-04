import { useContext } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';

function CreateDonationReq() {
  const { user } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const recipientName = form.recipientName.value;
    const recipientDistrict = form.recipientDistrict.value;
    const recipientUpazila = form.recipientUpazila.value;
    const hospitalName = form.hospitalName.value;
    const address = form.address.value;
    const donationDate = form.donationDate.value;
    const donationTime = form.donationTime.value;
    const description = form.textarea.value;
    const donationRequest = {
      recipientName,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      address,
      donationDate,
      donationTime,
      description,
    };
    try {
      console.log(donationRequest);
      // await axios.post(
      //   'http://localhost:5000/donation-requests',
      //   donationRequestData
      // );
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error creating donation request:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="max-w-5xl mx-auto border border-red-500 w-full">
      <h2 className="text-3xl font-bold mb-4">
        Donation Request Form Donation Request Form Donation Request Form
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
            placeholder="Name"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
        </div>
        <div className="relative w-full mb-3">
          <label
            className="block text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="recipientDistrict"
          >
            Recipient District
          </label>
          <input
            type="text"
            name="recipientDistrict"
            id="recipientDistrict"
            placeholder="recipientDistrict"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
        </div>
        <div className="relative w-full mb-3">
          <label
            className="block text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="recipientUpazila"
          >
            Recipient Upazila
          </label>
          <input
            type="text"
            name="recipientUpazila"
            id="recipientUpazila"
            placeholder="Recipient Upazila"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
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

export default CreateDonationReq;
