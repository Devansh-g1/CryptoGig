import React from 'react';

function TestPage() {
  return (
    <div style={{ padding: '50px', background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ React Works!</h1>
      <p style={{ fontSize: '24px' }}>If you see this, React is rendering correctly.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{ 
          padding: '15px 30px', 
          fontSize: '18px', 
          marginTop: '20px',
          cursor: 'pointer',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Click Me to Test
      </button>
    </div>
  );
}

export default TestPage;
