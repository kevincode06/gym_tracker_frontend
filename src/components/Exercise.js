import React, { useState } from 'react';
import { Dumbbell, Save, Calendar, Weight } from 'lucide-react';
import '../styles/Exercise.css';

const exerciseOptions = {
  "Chest Exercises": [
    "Bench Press (Barbell and Dumbbell)",
    "Push-Ups",
    "Incline Bench Press",
    "Chest Flyes",
    "Cable Crossovers",
    "Dips"
  ],
  "Back Exercises": [
    "Pull-Ups",
    "Deadlifts",
    "Bent-Over Rows",
    "Lat Pulldowns",
    "Seated Cable Rows",
    "T-Bar Rows",
    "Single-Arm Dumbbell Rows"
  ],
  "Leg Exercises": [
    "Squats (Barbell and Dumbbell)",
    "Leg Press",
    "Lunges",
    "Romanian Deadlifts",
    "Leg Extensions",
    "Leg Curls",
    "Calf Raises"
  ],
  "Shoulder Exercises": [
    "Military Press",
    "Lateral Raises",
    "Front Raises",
    "Shoulder Shrugs",
    "Arnold Press",
    "Upright Rows"
  ],
  "Arm Exercises": [
    "Bicep Curls (Barbell and Dumbbell)",
    "Hammer Curls",
    "Tricep Pushdowns",
    "Overhead Tricep Extensions",
    "Preacher Curls",
    "Skull Crushers"
  ],
  "Core Exercises": [
    "Planks",
    "Crunches",
    "Russian Twists",
    "Leg Raises",
    "Mountain Climbers",
    "Cable Woodchoppers"
  ]
};

const Exercise = () => {
  const [category, setCategory] = useState('');
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { 
      category, 
      exercise, 
      reps, 
      sets, 
      weight, 
      date 
    };

    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workout),
      });

      if (response.ok) {
        const newWorkout = await response.json();
        setWorkouts([...workouts, newWorkout]); // Add the saved workout to the state
      } else {
        console.error('Error posting workout');
      }
    } catch (error) {
      console.error('Error posting workout:', error);
    }

    // Reset form
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
          {/* Exercise Category */}
          <div className="form-group">
            <label>Exercise Category</label>
            <select 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value);
                setExercise('');
              }}
              required
            >
              <option value="">Select Category</option>
              {Object.keys(exerciseOptions).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Exercise Name */}
          {category && (
            <div className="form-group">
              <label>Exercise Name</label>
              <select 
                value={exercise} 
                onChange={(e) => setExercise(e.target.value)}
                required
              >
                <option value="">Select Exercise</option>
                {exerciseOptions[category].map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
          )}

          {/* Workout Details */}
          <div className="form-row">
            <div className="form-group">
              <label>Reps</label>
              <input 
                type="number" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Sets</label>
              <input 
                type="number" 
                value={sets} 
                onChange={(e) => setSets(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <div className="input-icon">
                <Weight className="icon" />
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <div className="input-icon">
                <Calendar className="icon" />
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
          >
            <Save className="button-icon" />
            Log Workout
          </button>
        </form>

        {/* Workout History */}
        {workouts.length > 0 && (
          <div className="workout-history">
            <h3>Workout History</h3>
            <div className="history-list">
              {workouts.map((workout) => (
                <div 
                  key={workout.id} 
                  className="history-item"
                >
                  <div className="history-details">
                    <p className="exercise-name">{workout.exercise}</p>
                    <p className="exercise-stats">
                      {workout.sets} sets x {workout.reps} reps @ {workout.weight} kg
                    </p>
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
