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
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    passwordHash: '',
    role: 'USER'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', formData);
      
      if (response.data && response.data.status === 'success') {
        if (profileImage) {
          const imageFormData = new FormData();
          imageFormData.append('file', profileImage);
          imageFormData.append('email', formData.email);
          
          try {
            await axios.post('http://localhost:8080/api/profile-image/upload', imageFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            });
          } catch (imgError) {
            console.error('Error uploading profile image:', imgError);
            showError('User created but failed to upload profile image');
          }
        }
        
        showSuccess('User added successfully');
        setShowAddModal(false);
        setFormData({ fullname: '', email: '', passwordHash: '', role: 'USER' });
        setProfileImage(null);
        setImagePreview(null);
        fetchUsers();
      } else {
        showError('Failed to add user', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showError('Failed to add user', error.response?.data?.message || error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add User
          </button>
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

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleAddUser} className="user-form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                  required
                />
                
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.passwordHash}
                  onChange={(e) => setFormData({...formData, passwordHash: e.target.value})}
                  required
                />
                
                <div className="form-group">
                  <label style={{color: '#ffffff', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block'}}>
                    Profile Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{marginBottom: '0.5rem'}}
                  />
                  {imagePreview && (
                    <div style={{marginTop: '0.5rem'}}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          maxWidth: '150px', 
                          maxHeight: '150px', 
                          borderRadius: '8px',
                          border: '2px solid #ffffff'
                        }} 
                      />
                    </div>
                  )}
                </div>
                
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-plus"></i>
                    Add User
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
