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
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    exercise: '',
    reps: '',
    sets: '',
    weight: '',
    date: ''
  });
  const [workouts, setWorkouts] = useState([]);
  const [editWorkoutId, setEditWorkoutId] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [showWorkoutHistory, setShowWorkoutHistory] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      exercise: '',
      reps: '',
      sets: '',
      weight: '',
      date: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    setAvailableExercises(formData.category ? exerciseOptions[formData.category] : []);
    if (editWorkoutId === null) {
      setFormData(prevState => ({
        ...prevState,
        exercise: ''
      }));
    }
  }, [formData.category, editWorkoutId]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('https://gym-tracker-backend-nxai.onrender.com/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      } else {
        throw new Error('Failed to fetch workouts');
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
      alert("Failed to fetch workouts. Please check your connection.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'category', 'exercise'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    const workout = { 
      ...formData,
      reps: Number(formData.reps) || 0,
      sets: Number(formData.sets) || 0,
      weight: Number(formData.weight) || 0,
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    try {
      const url = editWorkoutId 
        ? `https://gym-tracker-backend-nxai.onrender.com/api/workouts/${editWorkoutId}`
        : 'https://gym-tracker-backend-nxai.onrender.com/api/workouts';
      const method = editWorkoutId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });

      if (response.ok) {
        alert(editWorkoutId ? 'Workout updated successfully!' : 'Workout saved successfully!');
        await fetchWorkouts();
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to save workout: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      alert('An error occurred while saving the workout. Please try again.');
    }
  };

  const handleEditWorkout = (workout) => {
    setFormData({
      name: workout.name,
      category: workout.category,
      exercise: workout.exercise,
      reps: workout.reps.toString(),
      sets: workout.sets.toString(),
      weight: workout.weight.toString(),
      date: new Date(workout.date).toISOString().split('T')[0]
    });
    setEditWorkoutId(workout._id);
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      const response = await fetch(`https://gym-tracker-backend-nxai.onrender.com/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Workout deleted successfully!');
        await fetchWorkouts();
        if (editWorkoutId === id) {
          resetForm();
        }
      } else {
        alert('Failed to delete workout');
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert('An error occurred while deleting the workout. Please try again.');
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString(); 
  };

  return (
    <div className="exercise-container">
      <h1>Gym Workout Tracker</h1>

      <form onSubmit={handleSubmit} className="exercise-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(exerciseOptions).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Exercise</label>
          <select
            name="exercise"
            value={formData.exercise}
            onChange={handleInputChange}
            required
            disabled={!formData.category}
          >
            <option value="">Select Exercise</option>
            {availableExercises.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Reps</label>
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleInputChange}
            placeholder="Reps"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Sets</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleInputChange}
            placeholder="Sets"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Weight"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editWorkoutId ? 'Update Workout' : 'Save Workout'}
          </button>
          {editWorkoutId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="cancel-edit"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="workout-history">
        <button onClick={() => setShowWorkoutHistory(!showWorkoutHistory)}>
          {showWorkoutHistory ? 'Hide' : 'Show'} Workout History
        </button>

        {showWorkoutHistory && (
          <ul className="workout-list">
            {workouts.map((workout) => (
              <li key={workout._id}>
                <div>
                  <h4>{workout.name}</h4>
                  <p>{workout.category} - {workout.exercise}</p>
                  <p>{workout.reps} Reps x {workout.sets} Sets</p>
                  <p>Weight: {workout.weight} kg</p>
                  <p>Date: {formatDate(workout.date)}</p>
                  <div className="workout-actions">
                    <button onClick={() => handleEditWorkout(workout)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteWorkout(workout._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Exercise;
