import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';

function MyDonationReq() {
  const [myDonationReq, setMyDonationReq] = useState([]);
  const [control, setControl] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://localhost:5000/donation-requests/${user?.email}`
      );
      setMyDonationReq(data);
    })();
  }, [control, user?.email]);
  console.log('i am from hihihi',myDonationReq);
  const handleDelete = async (_id) => {
    console.log(_id);
    await axios.delete(`http://localhost:5000/donation-requests/${_id}`);
    setControl(!control);
  };
  return (
    <div className="my-10 lg:my-20 mx-4 lg:mx-10">
      <div className="overflow-x-auto">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <th>Recipient Name</th>
              <th>Recipient Location</th>
              <th>Donation Date</th>
              <th>Donation Time</th>
              <th>Donation Status</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>View Details</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myDonationReq.map((item,index) => (
              <tr key={item._id}>
                <th>{index + 1}</th>
                <td>{item?.recipientName}</td>
                <td>{item?.address}</td>
                <td>{item?.donationDate}</td>
                <td>{item?.donationTime}</td>
                <td>{item?.status}</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Edit</button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item?._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
                <th>1</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyDonationReq;
