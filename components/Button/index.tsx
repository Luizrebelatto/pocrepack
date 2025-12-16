import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const MyButton = () => {
  const handleClick = () => {
    Alert.alert('Button clicked!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.text}>Click</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,         
    paddingHorizontal: 24,       
    borderRadius: 8,            
    elevation: 3,             
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,        
    shadowRadius: 3.5,          
  },
  text: {
    color: '#fff',              
    fontSize: 16,               
    fontWeight: 'bold',         
    textAlign: 'center',       
  },
});

export default MyButton;
