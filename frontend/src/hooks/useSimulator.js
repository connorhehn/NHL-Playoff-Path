import { useState, useEffect, useMemo } from 'react';
import { fetchSchedule } from '../utils/nhlApi';
import { runMonteCarlo } from '../utils/monteCarlo';

export function useSimulator(standings) {
  const [games, setGames] = useState([]);
  const [overrides, setOverrides] = useState({}); // { [gameId]: 'away' | 'home' }
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    if (!standings) return;
    fetchSchedule()
      .then(setGames)
      .finally(() => setLoadingGames(false));
  }, [standings]);

  // Re-run Monte Carlo whenever standings, games, or overrides change
  const odds = useMemo(() => {
    if (!standings || games.length === 0) return {};
    return runMonteCarlo(standings, games, overrides);
  }, [standings, games, overrides]);

  function toggleOverride(gameId, side) {
    setOverrides((prev) => {
      // Clicking the active side resets to undecided
      if (prev[gameId] === side) {
        const next = { ...prev };
        delete next[gameId];
        return next;
      }
      return { ...prev, [gameId]: side };
    });
  }

  function resetOverrides() {
    setOverrides({});
  }

  const overrideCount = Object.keys(overrides).length;

  return { games, overrides, odds, loadingGames, overrideCount, toggleOverride, resetOverrides };
}
