

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post('http://localhost:3001/bfhl', parsedInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || err.response.data.error}`);
      } else if (err.request) {
        setError('No response received from server. Please check if the server is running.');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check your internet connection and ensure the server is running.');
      } else if (err instanceof SyntaxError) {
        setError('Invalid JSON input. Please check your input format.');
      } else {
        setError('Error in processing request: ' + err.message);
      }
      console.error('Full error:', err);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredResponse = {};
    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>;
  };

  return (
    <div className="App">
      <h1>BFHL API Tester</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON data (e.g., {"data": ["A","1","B","2","C","3"]})'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <h2>Full Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <h2>Filter Response:</h2>
          <select
            multiple
            value={selectedOptions}
            onChange={(e) => setSelectedOptions(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          <h2>Filtered Response:</h2>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;