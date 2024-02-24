import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [calendlyLinks, setCalendlyLinks] = useState(['', '']);
  const [availableTimes, setAvailableTimes] = useState([]); // Updated state to hold available times

  const handleLinkChange = (index, event) => {
    const newLinks = [...calendlyLinks];
    newLinks[index] = event.target.value;
    setCalendlyLinks(newLinks);
  };

  const addLinkInput = () => {
    setCalendlyLinks([...calendlyLinks, '']);
  };

  const removeLinkInput = (index) => {
    const newLinks = calendlyLinks.filter((_, idx) => idx !== index);
    setCalendlyLinks(newLinks);
  };

  const handleSubmit = () => {
    console.log('Submitted Calendly Links:', calendlyLinks);
    alert('Submitted. Implement fetching and processing of Calendly links.');
  };

  const fetchAvailableDays = async () => {
    const calendlyUrl = "https://calendly.com/travisse-radiant/30min?month=2022-06";
    
    try {
      const response = await fetch('http://localhost:3001/fetch-calendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendlyUrl: calendlyUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setAvailableTimes(data.availableTimes); // Update state with fetched available times
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  return (
    <main className="main-container">
      <h2>Find Shared Calendly Times</h2>
      {calendlyLinks.map((link, index) => (
        <div key={index} className="input-container">
          <input
            type="text"
            value={link}
            onChange={(e) => handleLinkChange(index, e)}
            placeholder="Enter Calendly Link"
          />
          {index > 1 && (
            <button onClick={() => removeLinkInput(index)} className="remove">-</button>
          )}
        </div>
      ))}
      <button onClick={addLinkInput} className="link-button">Add More Links</button>
      <button onClick={fetchAvailableDays}>Find Shared Times</button>
      <hr /> {/* Divider */}
      <section>
        <h3>Shared Available Times</h3>
        <ul>
          {availableTimes.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}