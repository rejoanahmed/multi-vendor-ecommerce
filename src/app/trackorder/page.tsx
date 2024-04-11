import React from 'react'

function Trackorder() {
  // Basic styling for the message
  const messageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Adjust this value as needed
    fontSize: '20px', // Adjust font size as needed
    color: '#333', // This is a generic color, feel free to change it
    backgroundColor: '#f0f0f0', // Light grey background, feel free to change it
    fontFamily: 'Arial, sans-serif' // A generic font family
  }

  return <div style={messageStyle}>Your order is still being collected!</div>
}

export default Trackorder
