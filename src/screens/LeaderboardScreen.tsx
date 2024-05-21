import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const LeaderboardScreen = ({ route, navigation }) => {
  const { score } = route.params;
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const loadScores = async () => {
      const savedScores = await AsyncStorage.getItem('scores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    };
    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <MaterialIcons name="leaderboard" size={40} color="#FFD700" />
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Your Score:</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
      <FlatList
        data={scores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.scoreText}>Attempt {index + 1}: {item}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Quiz')}>
        <Text style={styles.buttonText}>Back to Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginRight: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreItem: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
