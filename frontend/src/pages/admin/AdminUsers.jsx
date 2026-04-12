import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { Search, Edit2, Trash2, Power, UserCheck, UserX, ChevronLeft, ChevronRight, Loader2, Shield, User, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Check if current admin is Super Admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/admin/super-admin-info`, {
          withCredentials: true
        });
        setIsSuperAdmin(response.data.isSuperAdmin);
      } catch (err) {
        console.error(err);
      }
    };
    checkSuperAdmin();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/admin/users`, {
        params: { search, role: roleFilter, page: currentPage, limit: 10 },
        withCredentials: true
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, currentPage]);

  const handleToggleStatus = async (userId, currentStatus, userRole) => {
    // Check if trying to deactivate an admin without super admin rights
    if (userRole === 'admin' && !isSuperAdmin) {
      toast.error('Only Super Admin can deactivate other admins');
      return;
    }
    
    try {
      await axios.put(`${serverUrl}/api/admin/users/${userId}/toggle-status`, {}, {
        withCredentials: true
      });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    // Check if trying to delete an admin without super admin rights
    if (userRole === 'admin' && !isSuperAdmin) {
      toast.error('Only Super Admin can delete other admins');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`${serverUrl}/api/admin/users/${userId}`, {
          withCredentials: true
        });
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    // Only Super Admin can change roles
    if (!isSuperAdmin) {
      toast.error('Only Super Admin can change user roles');
      setShowRoleModal(false);
      return;
    }
    
    try {
      await axios.put(`${serverUrl}/api/admin/users/${selectedUser._id}/role`, { role: selectedRole }, {
        withCredentials: true
      });
      toast.success('User role updated successfully');
      setShowRoleModal(false);
      setSelectedUser(null);
      setSelectedRole('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'educator': return <GraduationCap className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'educator': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">View, edit, and manage all platform users</p>
        {!isSuperAdmin && (
          <p className="text-amber-600 text-sm mt-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            You have limited permissions. Only Super Admin can change roles and manage admins.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="educator">Educators</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="ml-3 font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {/* Only show edit role button for Super Admin */}
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.role);
                          setShowRoleModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Change Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleStatus(user._id, user.isActive, user.role)}
                      className={`p-1.5 rounded-lg transition ${
                        user.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      } ${user.role === 'admin' && !isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      disabled={user.role === 'admin' && !isSuperAdmin}
                    >
                      {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.role)}
                      className={`p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition ${
                        user.role === 'admin' && !isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete"
                      disabled={user.role === 'admin' && !isSuperAdmin}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Change Modal - Only shown for Super Admin */}
      {showRoleModal && selectedUser && isSuperAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Change User Role</h2>
            <p className="text-gray-500 text-sm mb-4">
              User: <span className="font-semibold text-gray-900">{selectedUser.name}</span>
            </p>
            <div className="space-y-2 mb-6">
              {['student', 'educator', 'admin'].map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                    selectedRole === role 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">{role}</p>
                    <p className="text-xs text-gray-500">
                      {role === 'admin' && 'Full platform access and control'}
                      {role === 'educator' && 'Can create and manage courses'}
                      {role === 'student' && 'Can enroll and learn'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;