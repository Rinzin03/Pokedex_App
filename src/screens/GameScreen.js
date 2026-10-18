// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchPokemonList } from '../api';

export default function GameScreen() {
  const [generation1, setGeneration1] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- HINT STATE ---
  const [hintVisible, setHintVisible] = useState(false);
  const [hintText, setHintText] = useState('');

  const loadGameData = async () => {
    setLoading(true);
    try {
      const data = await fetchPokemonList(0, 151); // First 151 Pokémon
      setGeneration1(data);
      setupNewRound(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  const setupNewRound = (pokemonPool) => {
    const pool = pokemonPool || generation1;
    if (pool.length === 0) return;

    // Pick correct answer
    const correct = pool[Math.floor(Math.random() * pool.length)];

    // Pick 3 random wrong answers
    let wrongs = [];
    while (wrongs.length < 3) {
      const randomPoke = pool[Math.floor(Math.random() * pool.length)];
      if (randomPoke.id !== correct.id && !wrongs.some(w => w.id === randomPoke.id)) {
        wrongs.push(randomPoke);
      }
    }

    // Shuffle options
    const allOptions = [correct, ...wrongs].sort(() => Math.random() - 0.5);

    setCurrentPokemon(correct);
    setOptions(allOptions);
    setSelectedAnswer(null);

    // Reset Hint for the new round
    setHintVisible(false);
    setHintText('');
  };

  const handleGuess = (pokemon) => {
    if (selectedAnswer !== null) return; // Prevent multiple guesses

    setSelectedAnswer(pokemon);
    if (pokemon.id === currentPokemon.id) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  // --- HINT HANDLER ---
  const handleShowHint = () => {
    if (!currentPokemon) return;
    
    const name = currentPokemon.name;
    const firstLetter = name.charAt(0).toUpperCase();
    const length = name.length;
    
    console.log(`[Game] Hint revealed for ID ${currentPokemon.id}: Starts with ${firstLetter}`);
    
    setHintText(`Starts with '${firstLetter}' and has ${length} letters.`);
    setHintVisible(true);
  };

  if (loading || !currentPokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who's That Pokémon?</Text>
        <Text style={styles.scoreText}>
          Score {score} · Streak {streak} · Best {bestStreak}
        </Text>
      </View>

      <View style={styles.gameCard}>
        <Image
          source={{ uri: currentPokemon.image }}
          style={[
            styles.silhouette,
            { tintColor: selectedAnswer === null ? '#000' : undefined }, // Silhouette logic
          ]}
        />
      </View>

      {/* --- HINT SECTION --- */}
      <View style={styles.hintContainer}>
        {!hintVisible && selectedAnswer === null && (
          <TouchableOpacity 
            style={styles.hintButton} 
            onPress={handleShowHint}
            activeOpacity={0.7}
          >
            <Text style={styles.hintButtonText}>💡 Need a Hint?</Text>
          </TouchableOpacity>
        )}

        {hintVisible && (
          <View style={styles.hintBox}>
            <Text style={styles.hintBoxText}>💡 Hint: {hintText}</Text>
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          let btnStyle = styles.optionButton;
          if (selectedAnswer !== null) {
            if (option.id === currentPokemon.id) {
              btnStyle = [styles.optionButton, styles.correctButton]; // Green for correct
            } else if (option.id === selectedAnswer.id) {
              btnStyle = [styles.optionButton, styles.wrongButton]; // Red for wrong
            }
          }

          return (
            <TouchableOpacity
              key={option.id}
              style={btnStyle}
              onPress={() => handleGuess(option)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>
                {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedAnswer !== null && (
        <View style={styles.nextContainer}>
          <Button title="Next Round" onPress={() => setupNewRound()} color="#0284c7" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#1e037d', paddingVertical: 16, alignItems: 'center', paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scoreText: { color: '#e0f2fe', fontSize: 13, marginTop: 4, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gameCard: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2 },
  silhouette: { width: 180, height: 180 },
  
  // Hint Styles
  hintContainer: { paddingHorizontal: 16, marginBottom: 8, alignItems: 'center' },
  hintButton: { backgroundColor: '#e0f2fe', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#38bdf8' },
  hintButtonText: { color: '#1e037d', fontWeight: '600', fontSize: 13 },
  hintBox: { backgroundColor: '#fef3c7', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#f59e0b' },
  hintBoxText: { color: '#92400e', fontSize: 13, fontWeight: '600' },

  optionsContainer: { paddingHorizontal: 16 },
  optionButton: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginVertical: 6, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  correctButton: { backgroundColor: '#bbf7d0', borderColor: '#22c55e' },
  wrongButton: { backgroundColor: '#fecaca', borderColor: '#ef4444' },
  optionText: { fontSize: 16, fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' },
  nextContainer: { paddingHorizontal: 16, marginTop: 10 },
});