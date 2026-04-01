import { useState, useEffect } from 'react';
import { fetchStandings } from '../utils/nhlApi';
import { computePlayoffPicture } from '../utils/playoffEngine';

export function useStandings() {
  const [standings, setStandings] = useState(null);
  const [playoffPicture, setPlayoffPicture] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStandings()
      .then(({ standings, updated_at }) => {
        setStandings(standings);
        setPlayoffPicture(computePlayoffPicture(standings));
        setUpdatedAt(updated_at);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { standings, playoffPicture, updatedAt, loading, error };
}
