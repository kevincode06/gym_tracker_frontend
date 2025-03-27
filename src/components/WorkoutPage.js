import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WorkoutPage = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkout(data);
        } else {
          console.error('Workout not found');
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    };

    fetchWorkout();
  }, [id]);

  if (!workout) {
    return <p>Loading workout...</p>;
  }

  return (
    <div className="workout-details">
      <h2>{workout.name} - {workout.exercise}</h2>
      <p>{workout.sets} sets x {workout.reps} reps @ {workout.weight} kg</p>
      <p>Date: {workout.date}</p>
    </div>
  );
};

export default WorkoutPage;
