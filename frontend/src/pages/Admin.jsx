import { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', loginData);
      
      if (response.data.success) {
        setToken(response.data.data.token);
        setIsLoggedIn(true);
        localStorage.setItem('adminToken', response.data.data.token);
        await fetchDashboardData(response.data.data.token);
      } else {
        alert('Login failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (authToken) => {
    try {
      const [statsRes, registrationsRes, contactsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get('http://localhost:5000/api/admin/registrations', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get('http://localhost:5000/api/admin/contacts', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      setStats(statsRes.data.data);
      setRegistrations(registrationsRes.data.data.registrations);
      setContacts(contactsRes.data.data.contacts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const updatePaymentStatus = async (regId, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/registrations/${regId}/payment`,
        { paymentStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update local state
        setRegistrations(prev => 
          prev.map(reg => 
            reg.regId === regId 
              ? { ...reg, paymentStatus: status }
              : reg
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingPayments: status === 'DONE' ? prev.pendingPayments - 1 : prev.pendingPayments + 1,
          completedPayments: status === 'DONE' ? prev.completedPayments + 1 : prev.completedPayments - 1
        }));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken('');
    localStorage.removeItem('adminToken');
    setStats(null);
    setRegistrations([]);
    setContacts([]);
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full">
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-600">Gardenia 2025 Dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="input-field"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gardenia 2025 Admin Dashboard</h1>
            <button
              onClick={logout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'registrations', label: 'Registrations' },
              { key: 'contacts', label: 'Contact Queries' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">GCU Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.gcuRegistrations}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Outside Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.outsideRegistrations}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event-wise Registrations */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrations by Event</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.registrationsPerEvent.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">All Registrations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.regId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.eventId?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.leader.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.isGardenCityStudent ? 'GCU' : 'Outside'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registration.paymentStatus === 'DONE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {registration.paymentStatus === 'PENDING' ? (
                          <button
                            onClick={() => updatePaymentStatus(registration.regId, 'DONE')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => updatePaymentStatus(registration.regId, 'PENDING')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Mark as Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Queries</h3>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> {contact.email} | <strong>Phone:</strong> {contact.phone}
                  </div>
                  <p className="text-gray-700">{contact.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
