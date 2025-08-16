import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DrawingCanvas = React.forwardRef(({ width = screenWidth * 0.8, height = 400, strokeWidth = 3, strokeColor = '#000' }, ref) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentColor, setCurrentColor] = useState(strokeColor);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const locationX = evt.nativeEvent.locationX;
        const locationY = evt.nativeEvent.locationY;
        const newPath = [{ x: locationX, y: locationY }];
        setCurrentPath(newPath);
      },
      onPanResponderMove: (evt) => {
        const locationX = evt.nativeEvent.locationX;
        const locationY = evt.nativeEvent.locationY;
        setCurrentPath(prevPath => {
          const updatedPath = [...prevPath, { x: locationX, y: locationY }];
          return updatedPath;
        });
      },
      onPanResponderRelease: () => {
        setCurrentPath(prevPath => {
          setPaths((prevPaths) => [...prevPaths, { path: prevPath, color: currentColor }]);
          return [];
        });
      },
    })
  ).current;

  const createPath = (points) => {
    if (points.length < 1) {
      return '';
    }
    
    if (points.length === 1) {
      // 単一点の場合は小さな円を描画
      const point = points[0];
      return `M ${point.x-1},${point.y} A 1,1 0 1,1 ${point.x+1},${point.y} A 1,1 0 1,1 ${point.x-1},${point.y}`;
    }
    
    // 複数点の場合は直線で繋ぐ（シンプル版）
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`;
    }
    
    return path;
  };

  const clearCanvas = useCallback(() => {
    setPaths([]);
    setCurrentPath([]);
  }, []);

  React.useImperativeHandle(ref, () => ({
    clearCanvas,
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg height={height} width={width}>
          {paths.map((p, index) => (
            <Path
              key={index}
              d={createPath(p.path)}
              stroke={p.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.length > 0 && (
            <Path
              d={createPath(currentPath)}
              stroke={currentColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 10,
  },
});

export default DrawingCanvas;