import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [calendlyLinks, setCalendlyLinks] = useState([
    "https://calendly.com/travisse-radiant/30min",
    "https://calendly.com/travisse-hansen/30min"
  ]);
  const [availableTimes, setAvailableTimes] = useState([]); // Updated state to hold available times
  const [isLoading, setIsLoading] = useState(false); // New loading state

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

  //console.log

  // const url = process.env.REACT_APP_BACKEND_URL

  const url = `https://calendly-combine-40f6d62fe7a0.herokuapp.com/`

  const fetchAvailableDays = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${url}/fetch-calendly`, {
        method: 'POST',
        mode: 'cors', // Ensure this is set to 'cors'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendlyUrls: calendlyLinks }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setAvailableTimes(data.availableTimes); // No change needed here, but ensure data structure is compatible
    } catch (error) {
      console.error('Error fetching available times:', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
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
            <button onClick={() => removeLinkInput(index)} className="remove" style={{alignSelf: 'center', marginLeft: '8px'}}>-</button>
          )}
        </div>
      ))}
      <button onClick={addLinkInput} className="link-button" style={{background: 'none', color: 'blue', textDecoration: 'underline'}}>Add another link</button>
      <div className="button-container">
        <button onClick={fetchAvailableDays}>Find Shared Times</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && availableTimes.length > 0 && (
        <>
          <hr /> {/* Divider */}
          <section>
            <h3>Shared Available Times</h3>
            {availableTimes.map(({ dayDate, times }, index) => (
              <div key={index}>
                <h4>{dayDate}</h4>
                <ul>
                  {times.map((time, timeIndex) => (
                    <li key={timeIndex}>{time}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

