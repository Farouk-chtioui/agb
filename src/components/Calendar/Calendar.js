// Calendar.js
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

const CalendarComponent = ({ plans, onClickDay }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
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
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eee";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
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

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarComponent;
