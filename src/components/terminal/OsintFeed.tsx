'use client';

import React from 'react';

interface OsintItem {
  src: string;
  text: string;
}

export const OsintFeed = ({ events }: { events: OsintItem[] }) => {
  return (
    <footer style={{ 
      border: '1px solid #ff003c', 
      padding: '20px', 
      background: '#0a0000', 
      marginTop: '30px' 
    }}>
      <h3 style={{ 
        color: '#ff003c', 
        fontSize: '11px', 
        margin: '0 0 15px 0', 
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        // VERIFIED OSINT INTELLIGENCE FEED
      </h3>
      
      {events.map((o, idx) => (
        <div key={idx} style={{ 
          marginBottom: '8px', 
          fontSize: '12px', 
          lineHeight: '1.4',
          color: '#fff',
          borderLeft: '2px solid #300',
          paddingLeft: '10px'
        }}>
          <span style={{ color: '#666', fontWeight: 'bold' }}>SOURCE: {o.src} // </span> 
          {o.text}
        </div>
      ))}
      
      <div style={{ 
        fontSize: '9px', 
        color: '#444', 
        marginTop: '15px', 
        textAlign: 'right' 
      }}>
        STATUS: MONITORING_LIVE_SIGNALS...
      </div>
    </footer>
  );
};
