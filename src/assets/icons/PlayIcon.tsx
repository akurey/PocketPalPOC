import * as React from 'react';
import Svg, {SvgProps, Path, G, Defs, ClipPath, Rect} from 'react-native-svg';

const PlayIcon: React.FC<SvgProps> = ({width, height}) => (
  <Svg
    width={width ? width : '20'}
    height={height ? height : '23'}
    viewBox="0 0 20 23"
    fill="none">
    <G clipPath="url(#clip0_22_1374)">
      <Path
        d="M0.869377 11.7297C0.869377 8.9622 0.826326 6.19467 0.877987 3.42713C0.929649 0.782207 1.93704 -0.636593 4.61482 1.00992C9.14378 3.80373 13.6469 6.65009 18.107 9.55775C20.3887 11.0466 19.9496 12.553 17.8659 13.8842C13.5005 16.6693 9.14378 19.4718 4.76119 22.2219C2.2384 23.8071 0.964089 22.8437 0.886597 20.0323C0.809106 17.2648 0.869377 14.4973 0.869377 11.7297Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_22_1374">
        <Rect
          width="18.7875"
          height="22.6745"
          fill="white"
          transform="translate(0.843994 0.30903)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export default PlayIcon;
