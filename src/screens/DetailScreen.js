// src/screens/DetailScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchPokemonDetails } from '../api';
import { TeamContext } from '../context/TeamContext';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { team, addToTeam, removeFromTeam } = useContext(TeamContext);

  useEffect(() => {
    fetchPokemonDetails(id)
      .then((data) => setPokemon(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !pokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e037d" />
      </View>
    );
  }

  const isInTeam = team.some((p) => p.id === pokemon.id);
  const isTeamFull = team.length >= 6;

  const handleTeamAction = () => {
    if (isInTeam) {
      removeFromTeam(pokemon.id);
    } else {
      addToTeam(pokemon);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Image source={{ uri: pokemon.image }} style={styles.artwork} />
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.idNumber}>#{String(pokemon.id).padStart(4, '0')}</Text>

        <View style={styles.typeContainer}>
          {pokemon.types.map((type, index) => (
            <View key={index} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.metricsRow}>
          <Text style={styles.metricText}>Height: {pokemon.height} m</Text>
          <Text style={styles.metricText}>Weight: {pokemon.weight} kg</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {pokemon.stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>{stat.name}</Text>
            <View style={styles.statBarBackground}>
              <View style={[styles.statBarFill, { width: `${Math.min(stat.value, 100)}%` }]} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.teamButton,
          isInTeam ? styles.removeButton : isTeamFull && !isInTeam ? styles.disabledButton : styles.addButton,
        ]}
        onPress={handleTeamAction}
        disabled={isTeamFull && !isInTeam}
      >
        <Text style={styles.teamButtonText}>
          {isInTeam ? 'Remove from Team' : isTeamFull ? 'Team is Full (6/6)' : 'Add to Team'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  artwork: { width: 160, height: 160, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  idNumber: { fontSize: 14, color: '#6b7280', marginBottom: 10 },
  typeContainer: { flexDirection: 'row', marginBottom: 15 },
  typeBadge: { backgroundColor: '#1e037d', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginHorizontal: 4 },
  typeText: { color: '#fff', fontWeight: 'bold', textTransform: 'capitalize' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 },
  metricText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  statsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1f2937' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  statName: { width: 110, fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'capitalize' },
  statBarBackground: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  statBarFill: { height: '100%', backgroundColor: '#1e037d' },
  statValue: { width: 30, fontSize: 12, fontWeight: 'bold', textAlign: 'right', color: '#1f2937' },
  teamButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  addButton: { backgroundColor: '#1e037d' },
  removeButton: { backgroundColor: '#dc2626' },
  disabledButton: { backgroundColor: '#9ca3af' },
  teamButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});