// src/components/PokemonCard.js
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

// Dynamic color mapping for Pokémon types
const TYPE_COLORS = {
  fire: '#ef4444',
  water: '#3b82f6',
  grass: '#10b981',
  electric: '#f59e0b',
  ice: '#06b6d4',
  fighting: '#d97706',
  poison: '#8b5cf6',
  ground: '#b45309',
  flying: '#6366f1',
  psychic: '#ec4899',
  bug: '#84cc16',
  rock: '#78350f',
  ghost: '#6b21a8',
  dragon: '#4338ca',
  dark: '#374151',
  steel: '#64748b',
  fairy: '#f472b6',
  default: '#1e037d',
};

export default function PokemonCard({ pokemon, onPress }) {
  const formattedId = String(pokemon.id).padStart(4, '0');

  // Extract primary type for dynamic border accent
  const primaryType = pokemon.types && pokemon.types.length > 0 
    ? pokemon.types[0].type ? pokemon.types[0].type.name : pokemon.types[0]
    : 'default';

  const accentColor = TYPE_COLORS[primaryType] || TYPE_COLORS.default;

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: accentColor }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.infoContainer}>
        <Text style={styles.id}>#{formattedId}</Text>
        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        {/* Dynamic Type Badges */}
        {pokemon.types && pokemon.types.length > 0 && (
          <View style={styles.typeContainer}>
            {pokemon.types.map((typeObj, index) => {
              const typeName = typeof typeObj === 'string' ? typeObj : typeObj.type.name;
              const badgeColor = TYPE_COLORS[typeName] || TYPE_COLORS.default;

              return (
                <View key={index} style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.typeText}>{typeName}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
  },
  image: {
    width: 65,
    height: 65,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  id: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 2,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});