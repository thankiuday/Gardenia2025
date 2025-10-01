import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { API_ENDPOINTS } from '../../config/api';
import SkeletonLoader from '../../components/SkeletonLoader';
import useScrollToTop from '../../hooks/useScrollToTop';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Statistics state
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalGcuStudents, setTotalGcuStudents] = useState(0);
  const [totalExternalStudents, setTotalExternalStudents] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Scroll to top when component mounts or route changes
  useScrollToTop();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, filterType, searchTerm]);

  // Fetch statistics on component mount and when refresh is clicked
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Cleanup body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'ALL' && { studentType: filterType })
      });

      const response = await axios.get(`${API_ENDPOINTS.ADMIN.REGISTRATIONS}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRegistrations(response.data.data.registrations || []);
      setTotalPages(Math.ceil((response.data.data.total || 0) / itemsPerPage));
    } catch (error) {
      setError('We couldn\'t load the registrations. Please refresh the page to try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch all-time statistics from dedicated stats endpoint
      const response = await axios.get(API_ENDPOINTS.ADMIN.STATS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTotalRegistrations(response.data.data.totalRegistrations || 0);
        setTotalGcuStudents(response.data.data.gcuRegistrations || 0);
        setTotalExternalStudents(response.data.data.outsideRegistrations || 0);
      }
    } catch (error) {
      // Don't show error to user for stats, just keep existing values
    } finally {
      setStatsLoading(false);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getTypeColor = (type) => {
    return type === 'GCU' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter, value) => {
    if (filter === 'type') {
      setFilterType(value);
    }
    setCurrentPage(1);
  };

  const handleRegistrationClick = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
    // Prevent body scroll on mobile
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
    // Restore body scroll
    document.body.classList.remove('modal-open');
  };

  const exportToExcel = async () => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch all registrations for export (without pagination)
      const response = await axios.get(`${API_ENDPOINTS.ADMIN.REGISTRATIONS}?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allRegistrations = response.data.data.registrations || [];
      
      // Prepare data for Excel export
      const excelData = [];
      
      allRegistrations.forEach((registration, index) => {
        const baseData = {
          'S.No': index + 1,
          'Registration ID': registration.regId,
          'Event Title': registration.eventId?.title || 'N/A',
          'Event Type': registration.eventId?.type || 'N/A',
          'Registration Date': new Date(registration.createdAt).toLocaleDateString(),
          'Registration Time': new Date(registration.createdAt).toLocaleTimeString(),
          'Student Type': registration.isGardenCityStudent ? 'GCU Student' : 'External Participant',
          'Team Size': registration.teamMembers ? registration.teamMembers.length + 1 : 1,
          'Leader Name': registration.leader.name,
          'Leader Email': registration.leader.email,
          'Leader Phone': registration.leader.phone,
          'Leader Roll Number': registration.leader.registerNumber || registration.leader.collegeRegisterNumber || 'N/A'
        };

        // For individual registrations
        if (!registration.teamMembers || registration.teamMembers.length === 0) {
          excelData.push({
            ...baseData,
            'Team Member Names': '',
            'Team Member Roll Numbers': ''
          });
        } else {
          // For group registrations, combine all team members with comma separation
          const teamMemberNames = registration.teamMembers.map(member => member.name).join(', ');
          const teamMemberRollNumbers = registration.teamMembers.map(member => 
            member.registerNumber || member.collegeRegisterNumber || 'N/A'
          ).join(', ');

          excelData.push({
            ...baseData,
            'Team Member Names': teamMemberNames,
            'Team Member Roll Numbers': teamMemberRollNumbers
          });
        }
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for the new structure
      const colWidths = [
        { wch: 8 },   // S.No
        { wch: 15 },  // Registration ID
        { wch: 25 },  // Event Title
        { wch: 12 },  // Event Type
        { wch: 12 },  // Registration Date
        { wch: 12 },  // Registration Time
        { wch: 15 },  // Student Type
        { wch: 10 },  // Team Size
        { wch: 20 },  // Leader Name
        { wch: 25 },  // Leader Email
        { wch: 15 },  // Leader Phone
        { wch: 15 },  // Leader Roll Number
        { wch: 30 },  // Team Member Names (wider for comma-separated names)
        { wch: 30 }   // Team Member Roll Numbers (wider for comma-separated roll numbers)
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Gardenia2025_Registrations_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

    } catch (error) {
      alert('We couldn\'t export the data right now. Please try again in a few moments.');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SkeletonLoader className="h-8 w-64 mb-2" />
            <SkeletonLoader className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} className="h-20" />
            ))}
          </div>
          <SkeletonLoader className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Event Registrations
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track all event registrations
              </p>
            </div>
            <div className="flex gap-3 justify-center sm:justify-end">
              <button
                onClick={exportToExcel}
                disabled={exportLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Registration Statistics</h2>
            <button
              onClick={() => {
                fetchRegistrations();
                fetchStatistics();
              }}
              disabled={loading || statsLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${(loading || statsLoading) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {(loading || statsLoading) ? 'Refreshing...' : 'Refresh Stats'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            📊 Statistics show all-time registration data (total counts from the beginning) and are not affected by filters or search
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{totalRegistrations.toLocaleString()}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">External Participants</p>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">
                    {totalExternalStudents.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">GCU Students</p>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalGcuStudents.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or event..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>


            {/* Student Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Type</label>
              <select
                value={filterType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="ALL">All Types</option>
                <option value="GCU">GCU Students</option>
                <option value="EXTERNAL">External Participants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              💡 Click on any registration row to view detailed team member information
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr 
                    key={registration.regId} 
                    className="group hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRegistrationClick(registration)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{registration.leader.name}</div>
                          <div className="text-sm text-gray-500">{registration.leader.email}</div>
                          <div className="text-sm text-gray-500">{registration.leader.phone}</div>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.eventId?.title || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTypeColor(registration.isGardenCityStudent ? 'GCU' : 'EXTERNAL')}`}>
                        {registration.isGardenCityStudent ? 'GCU' : 'EXTERNAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(registration.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={fetchRegistrations}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Member Details Modal */}
        {showModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 lg:p-6">
            <div className="bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl sm:max-h-[90vh] sm:rounded-xl shadow-2xl sm:mx-2 sm:mx-4 sm:my-4 flex flex-col mobile-modal">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 mobile-modal-header">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">Registration Details</h3>
                  <p className="text-xs sm:text-sm text-gray-500 break-all mt-1">Registration ID: {selectedRegistration.regId}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0 p-2 -m-2 touch-manipulation"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-8 flex-1 overflow-y-auto min-h-0 mobile-modal-content">
                {/* Event Information */}
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Event Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Event Name</p>
                        <p className="text-gray-900 break-words">{selectedRegistration.eventId?.title || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Event Date</p>
                        <p className="text-gray-900 break-words">{selectedRegistration.finalEventDate || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Student Type</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedRegistration.isGardenCityStudent 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedRegistration.isGardenCityStudent ? 'GCU Student' : 'External Participant'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Registration Date</p>
                        <p className="text-gray-900 break-words">{formatDate(selectedRegistration.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Leader Information */}
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Team Leader</h4>
                  <div className="bg-emerald-50 rounded-lg p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p className="text-gray-900 font-medium break-words">{selectedRegistration.leader.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-gray-900 break-all">{selectedRegistration.leader.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900 break-words">{selectedRegistration.leader.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">
                          {selectedRegistration.isGardenCityStudent ? 'Register Number' : 'Institution Name'}
                        </p>
                        <p className="text-gray-900 break-words">
                          {selectedRegistration.isGardenCityStudent 
                            ? selectedRegistration.leader.registerNumber || 'N/A'
                            : selectedRegistration.leader.collegeName || 'N/A'
                          }
                        </p>
                      </div>
                      {!selectedRegistration.isGardenCityStudent && (
                        <div className="space-y-1 sm:col-span-2">
                          <p className="text-sm font-medium text-gray-600">Registration/Roll Number</p>
                          <p className="text-gray-900 break-words">{selectedRegistration.leader.collegeRegisterNumber || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                      Team Members ({selectedRegistration.teamMembers.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedRegistration.teamMembers.map((member, index) => (
                       <div key={index} className="bg-blue-50 rounded-lg p-3 sm:p-4">
                         <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Name</p>
                              <p className="text-gray-900 font-medium break-words">{member.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">
                                {selectedRegistration.isGardenCityStudent ? 'Register Number' : 'Institution Name'}
                              </p>
                              <p className="text-gray-900 break-words">
                                {selectedRegistration.isGardenCityStudent 
                                  ? member.registerNumber || 'N/A'
                                  : member.collegeName || 'N/A'
                                }
                              </p>
                            </div>
                            {!selectedRegistration.isGardenCityStudent && (
                              <div className="space-y-1 sm:col-span-2">
                                <p className="text-sm font-medium text-gray-600">Registration/Roll Number</p>
                                <p className="text-gray-900 break-words">{member.collegeRegisterNumber || 'N/A'}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QR Code Information */}
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">QR Code Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">QR Code Generated</p>
                        <p className="text-gray-900">
                          {selectedRegistration.qrPayload ? 'Yes' : 'No'}
                        </p>
                      </div>
                      {selectedRegistration.pdfUrl && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">PDF Generated</p>
                          <p className="text-gray-900">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-center sm:justify-end p-3 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white flex-shrink-0">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-base font-medium touch-manipulation"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Garden City University • Gardenia 2025 Admin Panel
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Developed by <a 
                href="https://nerdsandgeeks.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-500 font-bold text-base hover:text-emerald-400 transition-colors duration-200"
              >
                NerdsAndGeeks Private Limited
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
