import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { fetchPlans, deletePlan, addPlan, modifyPlan } from '../../api/plansService';
import { fetchMagasins } from '../../api/marketService';
import { fetchSectures } from '../../api/sectureService';
import PlanForm from './PlansForm';
import 'react-calendar/dist/Calendar.css'; 
import './Plans.css'; 

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

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
  };

  const handleDayClick = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedPlan({ Date: localDate.toISOString().split('T')[0] });
    setShowForm(true);
    setIsEditMode(false);
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

  const handleDeletePlan = async () => {
    await deletePlan(selectedPlan._id);
    fetchData();
    setShowForm(false);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        tileContent={({ date }) => {
          const dayPlans = plans.filter(plan => new Date(plan.Date).toDateString() === date.toDateString());
          return (
            <div>
              {dayPlans.map(plan => (
                <div key={plan._id} onClick={() => handlePlanSelect(plan)}>
                  {plan.secteurMatinal ? <div className="event">{plan.secteurMatinal.name}</div> : null}
                  {plan.secteurApresMidi ? <div className="event">{plan.secteurApresMidi.name}</div> : null}
                </div>
              ))}
            </div>
          );
        }}
        onClickDay={handleDayClick}
      />
      {showForm && (
        <PlanForm
          newPlan={selectedPlan}
          handleChange={handleChange}
          handleAddPlan={handleAddPlan}
          handleEditPlan={handleEditPlan}
          handleDeletePlan={handleDeletePlan}
          setShowForm={setShowForm}
          isEditMode={isEditMode}
          markets={markets}
          secteurs={secteurs}
        />
      )}
    </div>
  );
};

export default Plans;
