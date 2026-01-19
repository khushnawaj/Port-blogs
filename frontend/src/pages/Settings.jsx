import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Settings.scss';

const Settings = () => {
    const { currentUser, logout } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await api.put('/users/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password updated successfully");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            try {
                await api.delete('/users/delete-me'); // Assuming this endpoint exists or should exist
                toast.success("Account deleted");
                logout();
            } catch (err) {
                toast.error("Failed to delete account");
            }
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1>Account Settings</h1>

                <section className="settings-section">
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </section>

                <section className="settings-section danger-zone">
                    <h2>Danger Zone</h2>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={handleDeleteAccount} className="btn-danger">
                        Delete Account
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Settings;
