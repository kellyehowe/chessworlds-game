// src/data/games.js
import { getEffectiveGames } from "../source/sourceStore";

// Always reads the current effective bundle (defaults OR imported/edited).
export const getGames = () => getEffectiveGames();
