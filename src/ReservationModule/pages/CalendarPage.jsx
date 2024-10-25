import React from 'react';
import Calendar from "../components/Calendar/Calendar.jsx";

function CalendarPage() {
    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>Calendar</h1>
            <Calendar />
        </div>
    );
}

export default CalendarPage;
