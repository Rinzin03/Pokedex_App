// src/screens/PokedexScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { fetchPokemonList, fetchAllPokemonNames } from '../api';
import PokemonCard from '../components/PokemonCard';

export default function PokedexScreen({ navigation }) {
  // Personalize start offset based on student number digits (e.g., student ID ending in 123 -> offset 123)
  const INITIAL_OFFSET = 169; 
  const [offset, setOffset] = useState(INITIAL_OFFSET);
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonList(offset, 20);
      setPokemonList(data);
      setFilteredList(data);
      const all = await fetchAllPokemonNames();
      setAllPokemon(all);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Debounced Search logic across all 1025 Pokémon[cite: 1]
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredList(pokemonList);
      } else {
        const query = searchQuery.toLowerCase();
        const results = allPokemon.filter((p) => p.name.includes(query) || String(p.id) === query);
        setFilteredList(results);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, pokemonList, allPokemon]);

  // Infinite Scroll Loader[cite: 1]
  const loadMore = async () => {
    if (searchQuery.trim() || loading) return;
    setLoading(true);
    try {
      const nextOffset = offset + 20;
      const moreData = await fetchPokemonList(nextOffset, 20);
      setOffset(nextOffset);
      setPokemonList((prev) => {
        const combined = [...prev, ...moreData];
        // Ensure no duplicates[cite: 1]
        return Array.from(new Set(combined.map(p => p.id)))
          .map(id => combined.find(p => p.id === id));
      });
      setFilteredList((prev) => {
        const combined = [...prev, ...moreData];
        return Array.from(new Set(combined.map(p => p.id)))
          .map(id => combined.find(p => p.id === id));
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && pokemonList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={loadInitialData} color="#1e037d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rinzin's Pokédex</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search all Pokémon..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#1e037d" style={{ margin: 20 }} />}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No Pokémon found!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#1e037d', paddingVertical: 16, alignItems: 'center', paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  searchContainer: { padding: 16 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#dc2626', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 },
});