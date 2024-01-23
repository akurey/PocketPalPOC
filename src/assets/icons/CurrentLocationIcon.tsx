import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const CurrentLocationIcon: React.FC<SvgProps> = ({width, height, color}) => (
  <Svg
    width={width ? width : '16'}
    height={height ? height : '16'}
    viewBox="0 0 16 16"
    fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1381 0.861922C15.3373 1.06114 15.3898 1.3641 15.2692 1.61872L9.26915 14.2854C9.14861 14.5399 8.88118 14.6912 8.60097 14.6634C8.32076 14.6357 8.08819 14.4349 8.0199 14.1617L6.78358 9.21641L1.83831 7.98009C1.56513 7.91179 1.36432 7.67923 1.33657 7.39902C1.30883 7.11881 1.46013 6.85138 1.71461 6.73083L14.3813 0.730835C14.6359 0.610225 14.9388 0.6627 15.1381 0.861922ZM3.9689 7.13837L7.49502 8.0199C7.73388 8.07961 7.92038 8.26611 7.98009 8.50497L8.86162 12.0311L13.2651 2.73491L3.9689 7.13837Z"
      fill={color ? color : '#443662'}
    />
  </Svg>
);

export default CurrentLocationIcon;
