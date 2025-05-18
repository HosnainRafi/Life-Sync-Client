import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

function AllUsers() {
  const [userData, setUserData] = useState([]);
  const { user } = useContext(AuthContext);
  const [control, setControl] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); // Add state for filter

  useEffect(() => {
    const fetchUsers = setTimeout(async () => {
      const { data } = await axios.get(
        `http://localhost:5000/users`
      );
      setUserData(data);
    }, 500); // Adjust delay as needed
  
    return () => clearTimeout(fetchUsers); // Cleanup function
  }, [control]);

  const handleBlock = async (id, status, role) => {
    if (status === 'active' && role !== 'admin') {
      const response = await axios.patch(
        `http://localhost:5000/users/block/${id}`
      );
      if (response.data.modifiedCount) {
        Swal.fire('Successful updated Status');
        setControl(!control);
      }
    } else if (role === 'admin') {
      Swal.fire('You can not block Admin');
    } else {
      Swal.fire('Status is already Blocked');
    }
  };

  const handleUnBlock = async (id, status, role) => {
    if (status === 'block' && role !== 'admin') {
      const response = await axios.patch(
        `http://localhost:5000/users/active/${id}`
      );
      if (response.data.modifiedCount) {
        Swal.fire('Successful updated Status');
        setControl(!control);
      }
    } else if (role === 'admin') {
      Swal.fire('You can not Unblock Admin');
    } else {
      Swal.fire('Status is already active');
    }
  };

  const handleVolunteer = async (id, role) => {
    if (role === 'donor') {
      const response = await axios.patch(
        `http://localhost:5000/users/volunteer/${id}`
      );
      if (response.data.modifiedCount) {
        Swal.fire('Successful updated Status');
        setControl(!control);
      }
    } else {
      Swal.fire('Account is already Volunteer');
    }
  };

  const handleAdmin = async (id, role) => {
    if (role === 'donor' || role === 'volunteer') {
      const response = await axios.patch(
        `http://localhost:5000/users/makeAdmin/${id}`
      );
      if (response.data.modifiedCount) {
        Swal.fire('Successful updated Status');
        setControl(!control);
      }
    } else {
      Swal.fire('Account is already Admin');
    }
  };

  const handleStatusChange = event => {
    setStatusFilter(event.target.value); // Update filter state
  };

  const filteredUsers = statusFilter
    ? userData.filter(user => user.status === statusFilter)
    : userData;

    return (
      <div className="my-6 mx-4 sm:mx-6 md:mx-10">
        {/* Filter by Status */}
        <div className="mb-4 sm:mb-6">
          <label
            className="block text-gray-800 text-sm sm:text-lg font-medium mb-2"
            htmlFor="status"
          >
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="block w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="block">Blocked</option>
          </select>
        </div>
    
        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full table-auto text-sm sm:text-base">
            {/* Table Head */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-2 py-3 sm:px-4">Avatar</th>
                <th className="px-2 py-3 sm:px-4">User Name</th>
                <th className="px-2 py-3 sm:px-4">User Email</th>
                <th className="px-2 py-3 sm:px-4">Role</th>
                <th className="px-2 py-3 sm:px-4">Status</th>
                <th className="px-2 py-3 sm:px-4">Block</th>
                <th className="px-2 py-3 sm:px-4">Unblock</th>
                <th className="px-2 py-3 sm:px-4">Make Volunteer</th>
                <th className="px-2 py-3 sm:px-4">Make Admin</th>
                <th className="px-2 py-3 sm:px-4"></th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {filteredUsers?.map(item => (
                <tr key={item._id}>
                  <td className="px-2 py-3 sm:px-4">
                    <div className="mask mask-squircle w-10 h-10 sm:w-12 sm:h-12">
                      <img src={item?.photoURL} alt={item?.name} />
                    </div>
                  </td>
                  <td className="px-2 py-3 sm:px-4 text-gray-700">{item?.name}</td>
                  <td className="px-2 py-3 sm:px-4 text-gray-700">{item?.email}</td>
                  <td className="px-2 py-3 sm:px-4 text-gray-700">{item?.role}</td>
                  <td className="px-2 py-3 sm:px-4 text-gray-700">{item?.status}</td>
                  <td className="px-2 py-3 sm:px-4">
                    <button
                      onClick={() => handleBlock(item?._id, item?.status, item?.role)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm"
                      disabled={item?.status === 'block' || item?.role === 'admin'}
                    >
                      Block
                    </button>
                  </td>
                  <td className="px-2 py-3 sm:px-4">
                    <button
                      onClick={() => handleUnBlock(item?._id, item?.status, item?.role)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm"
                      disabled={item?.status === 'active' || item?.role === 'admin'}
                    >
                      Unblock
                    </button>
                  </td>
                  <td className="px-2 py-3 sm:px-4">
                    <button
                      onClick={() => handleVolunteer(item?._id, item?.role)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 text-xs sm:text-sm"
                    >
                      Volunteer
                    </button>
                  </td>
                  <td className="px-2 py-3 sm:px-4">
                    <button
                      onClick={() => handleAdmin(item?._id, item?.role)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                    >
                      Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
    
    
    
}

export default AllUsers;
