import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const PlusIcon: React.FC<SvgProps> = ({width, height, color}) => (
  <Svg
    width={width ? width : '30'}
    height={height ? height : '30'}
    viewBox="0 0 30 30"
    fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 17V30H17V17H30V13H17V0H13V13H0V17H13Z"
      fill={color ? color : 'white'}
    />
  </Svg>
);

export default PlusIcon;
