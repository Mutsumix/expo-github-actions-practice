import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import DrawingCanvas from './components/DrawingCanvas';
import NumberTemplate from './components/NumberTemplate';

export default function App() {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const canvasRef = useRef(null);

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const handleClear = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleNumberSelect = (number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedNumber(number);
    handleClear();
  };

  const { width: screenWidth, height: screenHeight } = dimensions;
  const isLandscape = screenWidth > screenHeight;
  const isTablet = screenWidth > 768;
  
  // iPad向けに最適化されたキャンバスサイズ
  let canvasSize;
  if (isTablet) {
    canvasSize = isLandscape ? Math.min(screenHeight * 0.7, 600) : Math.min(screenWidth * 0.7, 500);
  } else {
    canvasSize = Math.min(screenWidth * 0.85, screenHeight * 0.5);
  }

  if (isLandscape && isTablet) {
    // iPad横向きレイアウト
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.landscapeContainer}>
          <View style={styles.landscapeLeftPanel}>
            <View style={styles.header}>
              <Text style={[styles.title, { fontSize: 24 }]}>数字書き取り練習</Text>
            </View>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={styles.numberSelectorVertical}
              contentContainerStyle={styles.numberSelectorVerticalContent}
            >
              {numbers.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberButton,
                    selectedNumber === num && styles.selectedNumberButton
                  ]}
                  onPress={() => handleNumberSelect(num)}
                >
                  <Text style={[
                    styles.numberButtonText,
                    selectedNumber === num && styles.selectedNumberButtonText
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={[styles.clearButton, { marginTop: 20 }]} onPress={handleClear}>
              <Text style={styles.clearButtonText}>クリア</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.landscapeRightPanel}>
            <View style={[styles.canvasContainer, { width: canvasSize, height: canvasSize }]}>
              <NumberTemplate 
                number={selectedNumber} 
                width={canvasSize} 
                height={canvasSize} 
              />
              <DrawingCanvas 
                ref={canvasRef}
                width={canvasSize} 
                height={canvasSize}
                strokeWidth={10}
                strokeColor="#2196F3"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 通常のレイアウト（縦向きまたはスマートフォン）
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>数字書き取り練習</Text>
        <Text style={styles.subtitle}>練習したい数字を選んで、なぞってみよう！</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.numberSelector}
        contentContainerStyle={styles.numberSelectorContent}
      >
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              selectedNumber === num && styles.selectedNumberButton
            ]}
            onPress={() => handleNumberSelect(num)}
          >
            <Text style={[
              styles.numberButtonText,
              selectedNumber === num && styles.selectedNumberButtonText
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.canvasWrapper}>
        <View style={[styles.canvasContainer, { width: canvasSize, height: canvasSize }]}>
          <NumberTemplate 
            number={selectedNumber} 
            width={canvasSize} 
            height={canvasSize} 
          />
          <DrawingCanvas 
            ref={canvasRef}
            width={canvasSize} 
            height={canvasSize}
            strokeWidth={isTablet ? 10 : 8}
            strokeColor="#2196F3"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>クリア</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  numberSelector: {
    maxHeight: 80,
    marginVertical: 20,
  },
  numberSelectorContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  numberButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedNumberButton: {
    backgroundColor: '#2196F3',
    elevation: 4,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedNumberButtonText: {
    color: '#fff',
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    position: 'relative',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  clearButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 横向きレイアウト用のスタイル
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeLeftPanel: {
    width: 200,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  landscapeRightPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberSelectorVertical: {
    flex: 1,
    marginTop: 20,
  },
  numberSelectorVerticalContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
