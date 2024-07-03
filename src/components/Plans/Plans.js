// Plans.js
import React, { useState, useEffect } from 'react';
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
  const [selectedPlanForNotes, setSelectedPlanForNotes] = useState('');
  const [note, setNote] = useState('');

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

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handlePlanSelectForNotes = (e) => {
    setSelectedPlanForNotes(e.target.value);
  };
  const handleNoteSubmit = async () => {
    const selectedPlan = plans.find(plan => plan._id === selectedPlanForNotes);
    if (selectedPlan) {
      try {
        await modifyPlan(selectedPlan._id, { notes: note });
        fetchData();
        setNote('');
        setSelectedPlanForNotes('');
      } catch (error) {
        console.error('Error submitting note:', error);
      }
    }
  };
  
  
  

  // Sort plans by date in descending order
  const sortedPlans = [...plans].sort((a, b) => new Date(b.Date) - new Date(a.Date));

  return (
    <div className="flex h-screen">
      <Dashboard title="Gérer les plans" />
      <div className="flex-1 container mx-auto p-6 relative flex flex-col pt-24">
        <div className="flex justify-between items-center mb-4">
          <Search setData={handleSearch} title={"Tous les plans"} />
          <button
            className="custom-color2 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setSelectedPlan({
                Date: '',
                market: '',
                secteurMatinal: [],
                secteurApresMidi: [],
                totalMatin: '',
                totalMidi: '',
                notes: '' // Add notes field
              });
            }}
          >
            Ajouter un plan
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-3/4 h-full overflow-auto">
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
            />
          </div>
          <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Add Notes to a Plan</h2>
            <div className="mb-4">
              <select
                className="w-full p-2 border rounded"
                value={selectedPlanForNotes}
                onChange={handlePlanSelectForNotes}
              >
                <option value="" disabled>Select a Plan</option>
                {sortedPlans.map(plan => (
                  <option key={plan._id} value={plan._id}>
                    {format(new Date(plan.Date), 'MMMM dd, yyyy')}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder="Add your notes here..."
              value={note}
              onChange={handleNoteChange}
            ></textarea>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleNoteSubmit}
              disabled={!selectedPlanForNotes || !note}
            >
              Submit Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
