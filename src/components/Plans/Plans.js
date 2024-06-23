import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { fetchPlans, deletePlan, addPlan, modifyPlan } from '../../api/plansService';
import { fetchMagasins } from '../../api/marketService';
import { fetchSectures } from '../../api/sectureService';
import PlanForm from './PlansForm';
import Dashboard from '../dashboard/Dashboard';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-calendar/dist/Calendar.css';
import './Plans.css';

const ItemType = {
  PLAN: 'plan',
};

const Plan = ({ plan, onDelete, onDrop, onEdit }) => {
  const [, ref] = useDrag({
    type: ItemType.PLAN,
    item: { id: plan._id, originalDate: plan.Date },
  });

  const handleEditClick = () => {
    onEdit(plan);
  };

  return (
    <div ref={ref} className="cursor-pointer" onClick={handleEditClick}>
      {plan.secteurMatinal ? (
        <div className="event bg-blue-200 text-blue-800 px-2 py-1 rounded-md mt-1">
          {plan.secteurMatinal.name} - 8:00 AM
        </div>
      ) : null}
      {plan.secteurApresMidi ? (
        <div className="event bg-green-200 text-green-800 px-2 py-1 rounded-md mt-1">
          {plan.secteurApresMidi.name} - 12:00 PM
        </div>
      ) : null}
    </div>
  );
};

const CalendarTile = ({ date, plans, onDelete, onDrop, onEdit }) => {
  const [, ref] = useDrop({
    accept: ItemType.PLAN,
    drop: (item) => onDrop(item.id, date),
  });

  return (
    <div ref={ref}>
      {plans.map(plan => (
        <Plan key={plan._id} plan={plan} onDelete={onDelete} onDrop={onDrop} onEdit={onEdit} />
      ))}
    </div>
  );
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [plansData, marketsData, secteursData] = await Promise.all([
      fetchPlans(),
      fetchMagasins(),
      fetchSectures(),
    ]);
    setPlans(plansData);
    setMarkets(marketsData);
    setSecteurs(secteursData);
    setFilteredPlans(plansData);
  };

  const handleDayClick = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const existingPlan = plans.find(plan => new Date(plan.Date).toDateString() === localDate.toDateString());
    
    if (existingPlan) {
      setSelectedPlan(existingPlan);
      setShowForm(true);
      setIsEditMode(true);
    } else {
      setSelectedPlan({ Date: localDate.toISOString().split('T')[0] });
      setShowForm(true);
      setIsEditMode(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setIsEditMode(true);
  };

  const handleChange = (e) => {
    setSelectedPlan({ ...selectedPlan, [e.target.name]: e.target.value });
  };

  const handleAddPlan = async (plan) => {
    await addPlan(plan);
    fetchData();
    setShowForm(false);
  };

  const handleEditPlan = async (plan) => {
    await modifyPlan(plan);
    fetchData();
    setShowForm(false);
  };

  const handleDeletePlan = async (planId) => {
    await deletePlan(planId);
    fetchData();
    setShowForm(false);
  };

  const handleSearch = (searchResults) => {
    setFilteredPlans(searchResults);
    setIsSearchActive(true);
  };

  const handleDrop = async (planId, newDate) => {
    const updatedPlan = plans.find(plan => plan._id === planId);
    if (updatedPlan) {
      updatedPlan.Date = newDate;
      await modifyPlan(updatedPlan);
      fetchData();
    }
  };

  const handleEditFormClose = () => {
    setShowForm(false);
    setSelectedPlan({});
    setIsEditMode(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <Dashboard title="Gérer les plans" />
        <div className="flex-1 container mx-auto p-9 relative mt-20">
          <Search setData={handleSearch} title={"Tous les plans"} />
          <button
            className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setSelectedPlan({
                Date: '',
                market: '',
                secteurMatinal: '',
                secteurApresMidi: '',
                totalMatin: '',
                totalMidi: ''
              });
            }}
          >
            Ajouter un plan
          </button>

          {showForm && (
            <PlanForm
              newPlan={selectedPlan}
              handleChange={handleChange}
              handleAddPlan={handleAddPlan}
              handleEditPlan={handleEditPlan}
              handleDeletePlan={handleDeletePlan}
              setShowForm={handleEditFormClose} // Close form on submit or cancel
              isEditMode={isEditMode}
              markets={markets}
              secteurs={secteurs}
            />
          )}

          <div className="mt-6">
            <Calendar
              className="custom-calendar"
              tileContent={({ date }) => {
                const dayPlans = plans.filter(plan => new Date(plan.Date).toDateString() === date.toDateString());
                return (
                  <CalendarTile
                    date={date}
                    plans={dayPlans}
                    onDelete={handleDeletePlan} // Pass handleDeletePlan to open modify form
                    onDrop={handleDrop}
                    onEdit={handlePlanSelect} // Pass handlePlanSelect to handle edit click
                  />
                );
              }}
              onClickDay={handleDayClick}
            />
          </div>

          {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        </div>
      </div>
    </DndProvider>
  );
};

export default Plans;
