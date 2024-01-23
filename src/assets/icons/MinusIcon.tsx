import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const MinusIcon: React.FC<SvgProps> = ({width, height, color}) => (
  <Svg
    width={width ? width : '21'}
    height={height ? height : '4'}
    viewBox="0 0 21 4"
    fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 0.666626H20.5V3.33329H0.5V0.666626Z"
      fill={color ? color : '#443662'}
    />
  </Svg>
);

export default MinusIcon;
