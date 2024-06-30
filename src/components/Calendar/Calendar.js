import React from 'react';
import Calendar from 'react-calendar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css';

const ItemType = {
  PLAN: 'plan',
};

const Plan = ({ plan, onEdit }) => {
  const [, ref] = useDrag({
    type: ItemType.PLAN,
    item: { id: plan._id, originalDate: plan.Date },
  });

  const handleEditClick = () => {
    onEdit(plan);
  };

  return (
    <div ref={ref} className="cursor-pointer" onClick={handleEditClick}>
      {plan.secteurMatinal?.map((secteur, index) => (
        <div key={`matinal-${index}`} className="event bg-blue-200 text-blue-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 8:00 AM
        </div>
      ))}
      {plan.secteurApresMidi?.map((secteur, index) => (
        <div key={`apresMidi-${index}`} className="event bg-green-200 text-green-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 12:00 PM
        </div>
      ))}
    </div>
  );
};

const CalendarTile = ({ date, plans, onEdit, onDrop }) => {
  const [, ref] = useDrop({
    accept: ItemType.PLAN,
    drop: (item) => onDrop(item.id, date),
  });

  return (
    <div ref={ref} className="tile">
      {plans.map(plan => (
        <Plan key={plan._id} plan={plan} onEdit={onEdit} />
      ))}
    </div>
  );
};

const CalendarComponent = ({ plans, onEdit, onDrop, onClickDay }) => (
  <DndProvider backend={HTML5Backend}>
    <div className="calendar-container">
      <Calendar
        className="custom-calendar"
        tileContent={({ date }) => {
          const dayPlans = plans.filter(plan => new Date(plan.Date).toDateString() === date.toDateString());
          return (
            <CalendarTile
              date={date}
              plans={dayPlans}
              onEdit={onEdit}
              onDrop={onDrop}
            />
          );
        }}
        onClickDay={onClickDay}
      />
    </div>
  </DndProvider>
);

export default CalendarComponent;
