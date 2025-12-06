// User Table Row Component with Clear Action Buttons
import React from 'react';

const UserTableRow = ({ user, onViewDetails, onUpdateRole, onDeleteUser }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.fullname}</td>
      <td>{user.email}</td>
      <td>
        <select
          value={user.role}
          onChange={(e) => onUpdateRole(user, e.target.value)}
          className="role-select"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td>
        <button
          className="btn-action btn-view"
          onClick={() => onViewDetails(user)}
          title="View user details"
        >
          <i className="fas fa-eye"></i>
          <span>View</span>
        </button>
        <button
          className="btn-action btn-delete"
          onClick={() => onDeleteUser(user)}
          title="Delete user"
        >
          <i className="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
