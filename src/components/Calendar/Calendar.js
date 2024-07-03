// CalendarComponent.js
import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import './CalendarComponent.css';

const CalendarComponent = ({ plans, onClickDay, handleChange, selectedPlan }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showListView, setShowListView] = useState(false); // State to toggle view

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const toggleView = () => {
    setShowListView(!showListView);
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            &laquo;
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            &raquo;
          </div>
        </div>
        <div className="col col-today">
          <button className="btn-today" onClick={goToToday}>
            Aujourd'hui
          </button>
        </div>
        <div className="col col-toggle">
          <button className="btn-toggle" onClick={toggleView}>
            {showListView ? 'View Calendar' : 'View Events List'}
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eee";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center day-name" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const plansForDay = plans.filter(plan => {
          const planDate = new Date(plan.Date);
          return planDate.toDateString() === cloneDay.toDateString();
        });

        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : isSameDay(day, selectedDate) ? "selected" : ""}`}
            key={day}
            onClick={() => {
              setSelectedDate(cloneDay);
              onClickDay(cloneDay);
            }}
          >
            <span className="number">{formattedDate}</span>
            {plansForDay.map((plan, index) => (
              <div key={index} className="event">
                {Array.isArray(plan.secteurMatinal) && plan.secteurMatinal.map((secteur, idx) => (
                  <div key={`matinal-${idx}`} className="secteur-matinal">
                    {secteur.name} - 8:00 AM
                  </div>
                ))}
                {Array.isArray(plan.secteurApresMidi) && plan.secteurApresMidi.map((secteur, idx) => (
                  <div key={`apresMidi-${idx}`} className="secteur-apres-midi">
                    {secteur.name} - 12:00 PM
                  </div>
                ))}
                {plan.notes && (
                  <div className="notes">
                    Notes: {plan.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderEventsList = () => {
    return (
      <div className="events-list">
        <h2 className="events-list-title">All Events</h2>
        <ul className="events-list-items">
          {plans.map((plan, index) => (
            <li key={index} className="events-list-item">
              <strong className="events-list-date">{new Date(plan.Date).toDateString()}</strong>
              <ul className="events-list-details">
                {Array.isArray(plan.secteurMatinal) && plan.secteurMatinal.map((secteur, idx) => (
                  <li key={`matinal-${idx}`} className="events-list-detail">
                    Matinal: {secteur.name} - 8:00 AM
                  </li>
                ))}
                {Array.isArray(plan.secteurApresMidi) && plan.secteurApresMidi.map((secteur, idx) => (
                  <li key={`apresMidi-${idx}`} className="events-list-detail">
                    Apres Midi: {secteur.name} - 12:00 PM
                  </li>
                ))}
                {plan.notes && (
                  <li className="events-list-detail">
                    Notes: {plan.notes}
                  </li>
                )}
              </ul>
              {selectedPlan._id === plan._id && (
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Add your notes here..."
                  value={selectedPlan.notes}
                  onChange={(e) => handleChange({ target: { name: 'notes', value: e.target.value } })}
                ></textarea>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {showListView ? (
        renderEventsList() // Render the events list directly
      ) : (
        <>
          {renderDays()}
          {renderCells()}
        </>
      )}
    </div>
  );
};

export default CalendarComponent;
