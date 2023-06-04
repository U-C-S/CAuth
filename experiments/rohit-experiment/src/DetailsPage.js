import React, { useState } from 'react';
import './DetailsPage.css'; // Import the CSS file for styling

const DetailsPage = ({ handleLogout }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform further actions with the entered details
    // Example: Save the details to a database
    console.log(name, address, age, occupation);
  };

  return (
    <div className="details-page-container"> {/* Add a container class */}
      <h1>Details Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />
        <br />
        <button type="submit">Save</button>
        <button onClick={handleLogout}>Logout</button>
      </form>
    </div>
  );
};

export default DetailsPage;
