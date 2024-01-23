import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SettingsIcon: React.FC<SvgProps> = ({width, height}) => (
  <Svg
    width={width ? width : '24'}
    height={height ? height : '24'}
    viewBox="0 0 24 24"
    fill="none">
    <Path
      d="M4 21V14"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 10V3"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 21V12"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V3"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 21V16"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 12V3"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 14H7"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 8H15"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 16H23"
      stroke="#443662"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SettingsIcon;
