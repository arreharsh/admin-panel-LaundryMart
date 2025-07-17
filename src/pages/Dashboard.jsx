import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadset } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  
  const routeChange = () =>{  
    navigate("/chat");
  }

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(`/admin/bookings/${id}/status`, {
        status: statusMap[id],
      });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchStatus = filterStatus === 'All' || booking.status === filterStatus;
    const matchDate = !selectedDate || booking.pickupDate === selectedDate;
    const matchSearch =
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.mobile.includes(searchQuery);
    const matchSource = sourceFilter === 'All' || booking.source === sourceFilter;

    return matchStatus && matchDate && matchSearch && matchSource;
  });

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Flat No', key: 'flatNo' },
    { label: 'Address', key: 'address' },
    { label: 'Service', key: 'services' },
    { label: 'Pickup Date', key: 'pickupDate' },
    { label: 'Pickup Time', key: 'pickupTime' },
    { label: 'Status', key: 'status' },
    { label: 'Source', key: 'source' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔝 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      

      {/* 🔘 Filters */}
      <div className="flex flex-wrap gap-3 mb-3 items-center">

        {['All', 'Pending', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilterStatus(status);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              filterStatus === status
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {status}
          </button>
        ))}

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded text-sm"
        />

        <input
          type="text"
          placeholder="Search by name or mobile"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded text-sm"
        />

        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="All">All Sources</option>
          <option value="app">App</option>
          <option value="website">Website</option>
        </select>

        <CSVLink
          headers={headers}
          data={filteredBookings}
          filename={`bookings_${new Date().toISOString().slice(0, 10)}.csv`}
          className="bg-green-600 text-white text-sm px-4 py-1 rounded hover:bg-green-700"
        >
          Export CSV
        </CSVLink>

        
         <button
          onClick={routeChange}
          className="text-lg bg-orange-600 text-white px-4 py-1 rounded-3xl hover:bg-red-600 fab fa-x-twitter"
        >
          <FontAwesomeIcon icon={faHeadset} />
          
        </button>

      </div>

      {/* 🔢 Order Count */}
      <p className="text-sm mb-3 font-medium text-gray-700">
        📦 Total Orders: {filteredBookings.length}
      </p>

      {/* 📋 Booking Table */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Service</th>
                <th className="p-3">Status</th>
                <th className="p-3">Pickup Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Source</th>
                <th className="p-3">Update</th>
                <th className="p-3">View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking._id} className="border-t text-sm">
                  <td className="p-3">{booking.name}</td>
                  <td className="p-3">{booking.services}</td>
                  <td className="p-3">
                    <select
                      value={statusMap[booking._id] || booking.status || 'Pending'}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">{booking.pickupDate}</td>
                  <td className="p-3">{booking.pickupTime}</td>
                  <td className="p-3 capitalize">{booking.source || 'app'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdateStatus(booking._id)}
                      className="text-white bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="text-blue-600 underline text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedBookings.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No bookings found.</p>
          )}
        </div>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 🔍 Booking Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedBooking.name}</p>
              <p><strong>Mobile:</strong> {selectedBooking.mobile}</p>
              <p><strong>Flat No:</strong> {selectedBooking.flatNo}</p>
              <p><strong>Address:</strong> {selectedBooking.address}</p>
              <p><strong>Service:</strong> {selectedBooking.services}</p>
              <p><strong>Pickup Date:</strong> {selectedBooking.pickupDate}</p>
              <p><strong>Pickup Time:</strong> {selectedBooking.pickupTime}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Source:</strong> {selectedBooking.source || 'app'}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;