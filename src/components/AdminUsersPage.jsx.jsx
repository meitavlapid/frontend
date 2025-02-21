import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  toggleLockUser,
} from "../services/adminService";
import "../css/adminUsersPage.css";

import { useUser } from "../hooks/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateBizNumber } from "../services/userServices";

function AdminUsersPage() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (!user.isAdmin && user.role !== "Admin")) {
      toast.error("Access denied!");
      navigate("/home");
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log("📢 Users received from server:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("🚨 Error fetching users:", error);
      toast.error("Failed to load users.");
      setUsers([]); // ✅ אם יש שגיאה, הגדר את `users` כערך ריק
    }
  };
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleLockToggle = async (userId, isLocked) => {
    try {
      await toggleLockUser(userId, !isLocked);
      toast.success(`User ${isLocked ? "unlocked" : "locked"} successfully!`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isLocked: !isLocked } : user
        )
      );
    } catch (error) {
      toast.error("Failed to update user lock status.");
    }
  };
  const handleBizNumberChange = (userId, newBizNumber) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, bizNumber: newBizNumber } : user
      )
    );
  };
  const handleBizNumberSave = async (userId, newBizNumber) => {
    try {
      await updateBizNumber(userId, newBizNumber);
      toast.success("Biz number updated successfully!");
    } catch (error) {
      toast.error("Failed to update biz number.");
    }
  };

  return (
    <div className="container ">
      <h2>Admin Panel - Manage Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Business</th>
            <th>Locked</th>
            <th>Role</th>
            <th>Biz Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{`${user.name.first} ${user.name.last}`}</td>
                <td>{user.email}</td>
                <td>{user.isBusiness ? "Yes" : "No"}</td>
                <td>Locked: {user.isLocked ? "Yes" : "No"}</td>
                <td>{user.role}</td>
                <td>
                  <input
                    type="text"
                    value={user.bizNumber || ""}
                    onChange={(e) =>
                      handleBizNumberChange(user._id, e.target.value)
                    }
                    onBlur={() => handleBizNumberSave(user._id, user.bizNumber)}
                    className="form-control"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger "
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleLockToggle(user._id, user.isLocked)}
                  >
                    {user.isLocked ? "Unlock" : "Lock"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersPage;
