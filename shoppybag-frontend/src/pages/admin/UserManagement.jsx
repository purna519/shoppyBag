// Refactored User Management with extracted components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../hooks/useNotification';
import UserTableRow from '../../components/admin/UserTableRow';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import '../../styles/admin/user-management.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8080/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleUpdateRole = async (user, newRole) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('http://localhost:8080/api/users/update', {
        email: user.email,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.status === 'success') {
        showSuccess('User role updated successfully');
        fetchUsers();
      } else {
        showError('Failed to update role', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showError('Failed to update user role', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete('http://localhost:8080/api/users/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { email: userToDelete.email }
      });
      
      if (response.data && response.data.status === 'success') {
        showSuccess('User deleted successfully');
        setUserToDelete(null);
        fetchUsers();
      } else {
        showError('Failed to delete user', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user', error.response?.data?.message || error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>User Management</h1>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container user-management-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                onViewDetails={setSelectedUser}
                onUpdateRole={handleUpdateRole}
                onDeleteUser={setUserToDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {userToDelete && (
        <DeleteConfirmModal
          item={{ id: userToDelete.id, name: userToDelete.fullname }}
          itemType="user"
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
