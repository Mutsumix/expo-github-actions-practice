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
        const updatedPath = [...currentPath, { x: locationX, y: locationY }];
        setCurrentPath(updatedPath);
      },
      onPanResponderRelease: () => {
        setPaths((prevPaths) => [...prevPaths, { path: currentPath, color: currentColor }]);
        setCurrentPath([]);
      },
    })
  ).current;

  const createPath = (points) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const xMid = (points[i].x + points[i - 1].x) / 2;
      const yMid = (points[i].y + points[i - 1].y) / 2;
      path += ` Q ${points[i - 1].x},${points[i - 1].y} ${xMid},${yMid}`;
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
          <Path
            d={createPath(currentPath)}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default DrawingCanvas;