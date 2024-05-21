import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { questions } from '../utils/data';
import { shuffleArray } from '../utils/shuffle';
import { MaterialIcons } from '@expo/vector-icons';

const QuizScreen = ({ navigation }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const savedQuestions = await AsyncStorage.getItem('shuffledQuestions');
    if (savedQuestions) {
      setShuffledQuestions(JSON.parse(savedQuestions));
    } else {
      shuffleAndSaveQuestions();
    }
  };

  const shuffleAndSaveQuestions = async () => {
    const shuffled = shuffleArray([...questions]);
    const uniqueQuestions = getUniqueQuestions(shuffled, 20);
    uniqueQuestions.forEach((q) => {
      q.answers = shuffleArray(q.answers);
    });
    setShuffledQuestions(uniqueQuestions);
    await AsyncStorage.setItem('shuffledQuestions', JSON.stringify(uniqueQuestions));
  };

  const getUniqueQuestions = (questionsArray, numQuestions) => {
    const uniqueQuestionsSet = new Set();
    const uniqueQuestions = [];

    while (uniqueQuestions.length < numQuestions && questionsArray.length > 0) {
      const question = questionsArray.pop();
      if (!uniqueQuestionsSet.has(question.question)) {
        uniqueQuestionsSet.add(question.question);
        uniqueQuestions.push(question);
      }
    }

    return uniqueQuestions;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    const question = shuffledQuestions[questionIndex];
    const isCorrect = question.correctAnswer === answer;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleSubmit = async () => {
    await saveScore(score);
    navigation.navigate('Leaderboard', { score });
  };

  const saveScore = async (score) => {
    const savedScores = await AsyncStorage.getItem('scores');
    const scores = savedScores ? JSON.parse(savedScores) : [];
    scores.push(score);
    await AsyncStorage.setItem('scores', JSON.stringify(scores));
  };

  const handleRestart = async () => {
    setScore(0);
    setSelectedAnswers({});
    await shuffleAndSaveQuestions();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shuffledQuestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question}</Text>
            {item.answers.map((answer, answerIndex) => {
              const isSelected = selectedAnswers[index] === answer;
              return (
                <TouchableOpacity
                  key={answerIndex}
                  style={[styles.answerButton, isSelected && styles.selectedAnswerButton]}
                  onPress={() => handleAnswerSelect(index, answer)}
                >
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>Restart</Text>
          <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  answerButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedAnswerButton: {
    backgroundColor: '#FFD700',
  },
  answerText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default QuizScreen;
