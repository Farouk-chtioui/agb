import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format } from 'date-fns';
import { fetchPlans, deletePlan, addPlan, modifyPlan } from '../../api/plansService';
import { fetchMagasins } from '../../api/marketService';
import { fetchSectures } from '../../api/sectureService';
import PlanForm from './PlansForm';
import Dashboard from '../dashboard/Dashboard';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import CalendarComponent from '../Calendar/Calendar';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    Date: '',
    market: '',
    secteurMatinal: [],
    secteurApresMidi: [],
    totalMatin: '',
    totalMidi: '',
    notes: '' // Add notes field
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [showAllNotes, setShowAllNotes] = useState(false);

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
      setSelectedPlan({
        Date: localDate.toISOString().split('T')[0],
        market: '',
        secteurMatinal: [],
        secteurApresMidi: [],
        totalMatin: '',
        totalMidi: '',
        notes: '' // Add notes field
      });
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
    const { name, value } = e.target;
    const [fieldName, index] = name.split('_');
    
    if (index !== undefined) {
      setSelectedPlan(prevPlan => {
        const updatedArray = [...(prevPlan[fieldName] || [])];
        updatedArray[Number(index)] = value;
        return { ...prevPlan, [fieldName]: updatedArray };
      });
    } else {
      setSelectedPlan(prevPlan => ({ ...prevPlan, [name]: value }));
    }
  };

  const handleAddPlan = async (plan) => {
    await addPlan(plan);
    fetchData();
    setShowForm(false);
  };

  const handleEditPlan = async (planId, plan) => {
    try {
      await modifyPlan(planId, plan);
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error('Error editing plan:', error);
    }
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
      updatedPlan.Date = newDate.toISOString().split('T')[0];
      await modifyPlan(updatedPlan._id, updatedPlan);
      fetchData();
    }
  };

  const handleEditFormClose = () => {
    setShowForm(false);
    setSelectedPlan({
      Date: '',
      market: '',
      secteurMatinal: [],
      secteurApresMidi: [],
      totalMatin: '',
      totalMidi: '',
      notes: '' // Add notes field
    });
    setIsEditMode(false);
  };

  const toggleShowAllNotes = () => {
    setShowAllNotes(!showAllNotes);
  };

  const today = new Date().toDateString();
  const todayNotes = plans.filter(plan => new Date(plan.Date).toDateString() === today && plan.notes);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Dashboard title="Gérer les plans" />
        <div className="flex-1 container mx-auto p-6 relative flex flex-col pt-24">
          <div className="flex flex-1 overflow-hidden">
            <div className="w-4/5 h-full overflow-auto"> {/* Adjust width to make the calendar bigger */}
              {showForm && (
                <PlanForm
                  newPlan={selectedPlan}
                  handleChange={handleChange}
                  handleAddPlan={handleAddPlan}
                  handleEditPlan={handleEditPlan}
                  handleDeletePlan={handleDeletePlan}
                  setShowForm={handleEditFormClose}
                  isEditMode={isEditMode}
                  markets={markets}
                  secteurs={secteurs}
                />
              )}

              <CalendarComponent
                plans={plans}
                onEdit={handlePlanSelect}
                onDrop={handleDrop}
                onClickDay={handleDayClick}
                handleChange={handleChange}
                selectedPlan={selectedPlan}
                fetchData={fetchData}  // Pass the fetchData function to CalendarComponent
              />
            </div>
            <div className="w-1/5 p-4 bg-gray-100 border-l border-gray-300 overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Today's Notes</h2>
              {todayNotes.length > 0 ? (
                todayNotes.map(note => (
                  <div key={note._id} className="sticky-note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                    <strong>{format(new Date(note.Date), 'MMM dd, yyyy')}</strong>
                    <p>{note.notes}</p>
                  </div>
                ))
              ) : (
                <p>No notes for today</p>
              )}
              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
                onClick={toggleShowAllNotes}
              >
                {showAllNotes ? 'Hide All Notes' : 'Show All Notes'}
              </button>
              {showAllNotes && (
                <div className="mt-4">
                  {plans.filter(plan => plan.notes).map(note => (
                    <div key={note._id} className="note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                      <strong>{format(new Date(note.Date), 'MMM dd, yyyy')}</strong>
                      <p>{note.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Plans;
