import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

const NumberTemplate = ({ number, width = 300, height = 400 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <SvgText
          x={width / 2}
          y={height / 2 + 50}
          fill="#e0e0e0"
          fontSize="200"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="Arial"
        >
          {number}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});

export default NumberTemplate;