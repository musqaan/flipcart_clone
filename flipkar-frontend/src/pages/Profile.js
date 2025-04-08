import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  if (!user) return <div className="text-center p-6">Loading Profile...</div>;

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="mb-2"><span className="font-semibold">User Type:</span> {user.userType}</p>
        <p className="mb-2"><span className="font-semibold">Joined On:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;
