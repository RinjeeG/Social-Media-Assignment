import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Profile {
    user: number;
    profile_img: string | null;
    bio: string | null;
    location: string | null;
    birthday: string | null;
}

const ProfilePage: React.FC = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!token) {
            setError('Please log in to view your profile.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        fetch('http://localhost:8000/api/profile/', {
            headers: {'Authorization': `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            setProfile(data);
            setBio(data.bio || '');
            setLocation(data.location || '');
            setBirthday(data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '');
            setLoading(false);
        })
        .catch(error => {
            console.error('Profile fetch error:', error);
            setError(error.message);
            setLoading(false);
        });
    }, [token]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('location', location);
        if (birthday) formData.append('birthday', birthday);
        if (image) formData.append('profile_img', image);

        try {
            const response = await fetch('http://localhost:8000/api/profile/update/', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`},
                body: formData,
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setError(null);
            } else {
                const errorData = await response.json();
                console.error('Profile update failed:', errorData);
                setError('Update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Update failed');
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="profile-page">
        <h1>My Profile</h1>
        {profile && (
            <>
            <p><strong>Username:</strong> {profile.user}</p>
            {profile.profile_img && <img src={profile.profile_img} alt="Profile" style={{ maxWidth: '200px' }} />}
            <form onSubmit={handleUpdate}>
                <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                maxLength={500}
                />
                <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                maxLength={50}
                />
                <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                />
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <button type="submit">Update Profile</button>
            </form>
            </>
            )}
        </div>
    );
};

export default ProfilePage;