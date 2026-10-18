// src/screens/TeamScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { TeamContext } from '../context/TeamContext';
import PokemonCard from '../components/PokemonCard';

export default function TeamScreen({ navigation }) {
  const { team, removeFromTeam } = useContext(TeamContext);

  // Calculate combined base stats
  const combinedStats = team.reduce((total, pokemon) => {
    // If stats are fetched or stored, sum them up
    return total + (pokemon.stats ? pokemon.stats.reduce((acc, s) => acc + s.value, 0) : 400);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Team</Text>
        <Text style={styles.subHeader}>
          {team.length}/6 Pokémon · Combined base stats: {combinedStats}
        </Text>
      </View>

      <FlatList
        data={team}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <PokemonCard
              pokemon={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
            <View style={styles.removeContainer}>
              <Button
                title="Remove"
                color="#dc2626"
                onPress={() => removeFromTeam(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your team is empty. Add up to 6 Pokémon!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#1e037d', paddingVertical: 16, alignItems: 'center', paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subHeader: { color: '#e0f2fe', fontSize: 14, marginTop: 4, fontWeight: '600' },
  removeContainer: { marginHorizontal: 16, marginBottom: 12, alignItems: 'flex-end' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 60, fontSize: 16, paddingHorizontal: 20 },
});