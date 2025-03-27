import React, { useState, useEffect } from 'react';
import { Dumbbell, Save, Edit, Trash2 } from 'lucide-react';
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

  // Fetch workouts from backend
  useEffect(() => {
    fetchWorkouts();
  }, []);

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
    const workout = { name, category, exercise, reps, sets, weight, date };

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
        await fetchWorkouts(); // Refresh workouts
        setEditWorkoutId(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleEdit = (workout) => {
    setEditWorkoutId(workout._id);
    setName(workout.name);
    setCategory(workout.category);
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
        await fetchWorkouts();
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
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

  return (
    <div className="exercise-container">
      <div className="exercise-card">
        <div className="exercise-header">
          <Dumbbell className="exercise-icon" />
          <h2>Workout Tracker</h2>
        </div>

        <form onSubmit={handleSubmit} className="exercise-form">
          {/* Name Input */}
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Exercise Category */}
          <div className="form-group">
            <label>Exercise Category</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setExercise(''); }} required>
              <option value="">Select Category</option>
              {Object.keys(exerciseOptions).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Exercise Name */}
          {category && (
            <div className="form-group">
              <label>Exercise Name</label>
              <select value={exercise} onChange={(e) => setExercise(e.target.value)} required>
                <option value="">Select Exercise</option>
                {exerciseOptions[category].map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
          )}

          {/* Workout Details */}
          <div className="form-row">
            <div className="form-group">
              <label>Reps</label>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Sets</label>
              <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <button type="submit" className="submit-button">
            <Save className="button-icon" />
            {editWorkoutId ? "Update Workout" : "Log Workout"}
          </button>
        </form>

        {/* Workout History */}
        {workouts.length > 0 && (
          <div className="workout-history">
            <h3>Workout History</h3>
            <div className="history-list">
              {workouts.map(workout => (
                <div key={workout._id} className="history-item">
                  <div className="history-details">
                    <p className="exercise-name">{workout.name} - {workout.exercise}</p>
                    <p className="exercise-stats">
                      {workout.sets} sets x {workout.reps} reps @ {workout.weight} kg
                    </p>
                  </div>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(workout)} className="edit-button">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(workout._id)} className="delete-button">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <span className="exercise-date">{workout.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
