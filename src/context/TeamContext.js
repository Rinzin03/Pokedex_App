// src/context/TeamContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TeamContext = createContext();

const STORAGE_KEY = '@pokedex_team';

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
      }
    } catch (error) {
      console.error('Failed to load team', error);
    }
  };

  const saveTeam = async (newTeam) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTeam));
    } catch (error) {
      console.error('Failed to save team', error);
    }
  };

  const addToTeam = (pokemon) => {
    if (team.length >= 6) return; // Max 6 members
    if (team.some((p) => p.id === pokemon.id)) return; // No duplicates

    const updatedTeam = [...team, pokemon];
    setTeam(updatedTeam);
    saveTeam(updatedTeam);
  };

  const removeFromTeam = (id) => {
    const updatedTeam = team.filter((p) => p.id !== id);
    setTeam(updatedTeam);
    saveTeam(updatedTeam);
  };

  return (
    <TeamContext.Provider value={{ team, addToTeam, removeFromTeam }}>
      {children}
    </TeamContext.Provider>
  );
};