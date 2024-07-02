// Calendar.js
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarComponent.css';

const localizer = momentLocalizer(moment);

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
      {Array.isArray(plan.secteurMatinal) && plan.secteurMatinal.map((secteur, index) => (
        <div key={`matinal-${index}`} className="event bg-blue-200 text-blue-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 8:00 AM
        </div>
      ))}
      {Array.isArray(plan.secteurApresMidi) && plan.secteurApresMidi.map((secteur, index) => (
        <div key={`apresMidi-${index}`} className="event bg-green-200 text-green-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 12:00 PM
        </div>
      ))}
      {Array.isArray(plan.secteurSoir) && plan.secteurSoir.map((secteur, index) => (
        <div key={`soir-${index}`} className="event bg-orange-200 text-orange-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 4:00 PM
        </div>
      ))}
      {Array.isArray(plan.secteurNuit) && plan.secteurNuit.map((secteur, index) => (
        <div key={`nuit-${index}`} className="event bg-gray-200 text-gray-800 px-2 py-1 rounded-md mt-1">
          {secteur.name} - 8:00 PM
        </div>
      ))}
    </div>
  );
};

const CustomEvent = ({ event }) => {
  return (
    <div>
      {event.title.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

const CalendarComponent = ({ plans, onEdit, onDrop, onClickDay }) => {
  const events = plans.map(plan => {
    const title = [
      ...Array.isArray(plan.secteurMatinal) ? plan.secteurMatinal.map(secteur => `${secteur.name} - 8:00 AM`) : [],
      ...Array.isArray(plan.secteurApresMidi) ? plan.secteurApresMidi.map(secteur => `${secteur.name} - 12:00 PM`) : [],
      ...Array.isArray(plan.secteurSoir) ? plan.secteurSoir.map(secteur => `${secteur.name} - 4:00 PM`) : [],
      ...Array.isArray(plan.secteurNuit) ? plan.secteurNuit.map(secteur => `${secteur.name} - 8:00 PM`) : []
    ].join('\n');
    return {
      title: title || 'Plan',
      start: new Date(plan.Date),
      end: new Date(plan.Date),
      plan
    };
  });

  const handleSelectEvent = event => {
    onEdit(event.plan);
  };

  const handleSelectSlot = slotInfo => {
    onClickDay(slotInfo.start);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="custom-calendar">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          views={['month']}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent
          }}
          popup
          style={{ height: '100vh' }}
        />
      </div>
    </DndProvider>
  );
};

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        <b>{date.format('MMMM')}</b> {date.format('YYYY')}
      </span>
    );
  };

  return (
    <div className="rbc-toolbar">
      <button type="button" onClick={goToBack}>
        &laquo;
      </button>
      <button type="button" onClick={goToNext}>
        &raquo;
      </button>
      <button type="button" onClick={goToCurrent}>
        Today
      </button>
      <span className="rbc-toolbar-label">{label()}</span>
    </div>
  );
};

export default CalendarComponent;
