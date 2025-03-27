import React, { useState, useEffect } from 'react';
import '../styles/Exercise.css';

const exerciseOptions = {
  "Chest Exercises": ["Bench Press", "Push-Ups", "Incline Bench Press", "Chest Flyes", "Cable Crossovers", "Dips"],
  "Back Exercises": ["Pull-Ups", "Deadlifts", "Bent-Over Rows", "Lat Pulldowns", "Seated Cable Rows"],
  "Leg Exercises": ["Squats", "Leg Press", "Lunges", "Romanian Deadlifts", "Leg Extensions", "Calf Raises"],
  "Shoulder Exercises": ["Military Press", "Lateral Raises", "Front Raises", "Arnold Press", "Upright Rows"],
  "Arm Exercises": ["Bicep Curls", "Hammer Curls", "Tricep Pushdowns", "Overhead Tricep Extensions"],
  "Core Exercises": ["Planks", "Crunches", "Russian Twists", "Leg Raises", "Mountain Climbers"],
};

const Exercise = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [editWorkoutId, setEditWorkoutId] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [showWorkoutHistory, setShowWorkoutHistory] = useState(false);

  // Fetch workouts from backend
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Update available exercises when category changes
  useEffect(() => {
    setAvailableExercises(category ? exerciseOptions[category] : []);
    setExercise(''); // Reset exercise when category changes
  }, [category]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that all required fields are provided
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }
    if (!exercise) {
      alert("Please select an exercise");
      return;
    }

    const workout = { 
      name: name.trim(), 
      category, 
      exercise, 
      reps: reps || 0, 
      sets: sets || 0, 
      weight: weight || 0, 
      date: date || new Date().toISOString().split('T')[0] 
    };

    try {
      const url = editWorkoutId 
        ? `http://localhost:5000/api/workouts/${editWorkoutId}` 
        : 'http://localhost:5000/api/workouts';

      const method = editWorkoutId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (response.ok) {
        await fetchWorkouts();  // Refresh workouts
        setEditWorkoutId(null);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout');
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setExercise('');
    setReps('');
    setSets('');
    setWeight('');
    setDate('');
  };

  const handleEdit = (workout) => {
    setEditWorkoutId(workout._id);
    setName(workout.name);
    setCategory(workout.category);
    
    // Set available exercises for the selected category
    const categoryExercises = exerciseOptions[workout.category] || [];
    setAvailableExercises(categoryExercises);
    
    setExercise(workout.exercise);
    setReps(workout.reps);
    setSets(workout.sets);
    setWeight(workout.weight);
    setDate(workout.date);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchWorkouts(); // Refresh workouts after deletion
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const toggleWorkoutHistory = () => {
    setShowWorkoutHistory(!showWorkoutHistory);
  };

  return (
    <div className="exercise-wrapper">
      <div className="exercise-container">
        <div className="exercise-content">
          <h2 className="exercise-title">Workout Tracker</h2>
          
          <form onSubmit={handleSubmit} className="exercise-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                <option value="">Select Category</option>
                {Object.keys(exerciseOptions).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="form-input"
                disabled={!category}
              >
                <option value="">Select Exercise</option>
                {availableExercises.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <button type="submit" className="submit-button">
              {editWorkoutId ? 'Update Workout' : 'Save Workout'}
            </button>
          </form>

          <div className="workout-history-toggle">
            <button onClick={toggleWorkoutHistory} className="toggle-history-button">
              {showWorkoutHistory ? 'Hide Workout History' : 'Show Workout History'}
            </button>
          </div>

          {showWorkoutHistory && (
            <div className="workout-history">
              <h3>Workout History</h3>
              <div className="history-list">
                {workouts.map(workout => (
                  <div key={workout._id} className="history-item">
                    <div className="history-details">
                      <div className="exercise-name">{workout.name}</div>
                      <div className="exercise-stats">
                        {workout.category} | {workout.exercise} | {workout.sets} sets x {workout.reps} reps
                      </div>
                    </div>
                    <div className="history-actions">
                      <button onClick={() => handleEdit(workout)}>Edit</button>
                      <button onClick={() => handleDelete(workout._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercise;