/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';

interface I {
  size?: number;
}
export function LogoSvg({ size = 230 }: I) {
  return (
    <Svg width={size} height={size - 110} viewBox="0, 0 330 130" fill="none">
      <G clip-path="url(#clip0_92_571)">
        <Path
          d="M55.1309 77.0521C55.1309 62.4509 63.8886 55.4966 76.7344 55.4966C89.5801 55.4966 98.2613 62.451 98.2613 77.2327V77.5187H86.5026V77.0371C86.5026 69.1946 82.5065 66.3647 76.7344 66.3647C70.9622 66.3647 66.9661 69.2096 66.9661 77.0521V105.171H55.1309V77.0521Z"
          fill="white"
        />
        <Path
          d="M142.906 75.7502C141.008 69.2925 135.634 66.0562 129.157 66.0562C122.482 66.0562 117.307 69.3829 115.408 75.7652H142.906V75.7502ZM102.654 80.9584C102.654 66.2669 113.602 55.4892 129.142 55.4741C144.682 55.4741 155.446 66.2368 155.461 80.9283V85.0377L115.117 85.0528C116.71 92.0975 122.191 95.8305 129.173 95.8155C134.455 95.8155 138.344 94.3403 140.824 91.2093H153.471C149.796 100.407 140.824 106.398 129.173 106.398C113.632 106.398 102.67 95.6348 102.654 80.9434"
          fill="white"
        />
        <Path
          d="M201.502 75.7062C199.604 69.2486 194.229 66.0123 187.753 66.0123C181.077 66.0123 175.902 69.3389 174.004 75.7213H201.502V75.7062ZM161.25 80.9145C161.25 66.223 172.197 55.4452 187.738 55.4302C203.278 55.4302 214.042 66.1929 214.057 80.8844V84.9938L173.713 85.0088C175.305 92.0535 180.787 95.7866 187.768 95.7715C193.05 95.7715 196.939 94.2964 199.42 91.1654H212.082C208.392 100.363 199.435 106.354 187.768 106.354C172.228 106.354 161.265 95.5909 161.25 80.8994"
          fill="white"
        />
        <Path
          d="M247.988 49.8779C258.246 49.8779 266.759 53.8066 272.225 60.4449C274.996 56.1248 276.864 51.2326 276.864 45.9039C276.864 25.0258 248.233 -0.0219727 248.233 -0.0219727C248.233 -0.0219727 219.602 25.0107 219.602 45.9039C219.602 51.1574 221.424 55.9592 224.134 60.2342C229.492 53.6712 237.867 49.8779 247.988 49.8779Z"
          fill="white"
        />
        <Path
          d="M262.947 70.8633C260.222 65.7002 254.909 62.4639 248.095 62.4639C241.359 62.4639 236.122 65.6551 233.428 70.7278C240.777 77.1252 248.31 80.7981 248.31 80.7981C248.31 80.7981 255.69 77.1704 262.947 70.8633Z"
          fill="white"
        />
        <Path
          d="M282.802 110.343H294.653C296.643 114.844 300.532 116.906 306.518 116.891C314.587 116.891 319.165 113.068 319.165 103.66V97.5934C316.18 102.877 310.989 105.722 304.513 105.737C293.152 105.737 282.389 98.4966 282.389 81.2612V56.6801H294.239V81.2612C294.239 90.4735 299.231 94.8689 306.702 94.8689C313.975 94.8689 319.15 90.2628 319.15 81.2462V56.665H331V103.389C331.031 120.233 320.176 127.007 306.518 127.007C295.066 127.007 285.589 121.828 282.802 110.358"
          fill="white"
        />
        <Path
          d="M262.671 80.8774C262.671 72.3576 256.792 66.2913 248.111 66.2913C239.445 66.2913 233.673 72.3726 233.673 80.8925C233.673 89.4123 239.46 95.4786 248.126 95.4786C256.792 95.4786 262.671 89.3973 262.671 80.8774ZM221.822 81.2839C221.822 65.614 232.57 55.4233 248.019 55.4082C263.667 55.4082 274.629 65.9752 274.629 81.3591C274.629 97.9171 262.09 106.347 250.132 106.347C243.058 106.347 237.179 103.411 233.688 98.0225V125.75H221.838V81.2688L221.822 81.2839Z"
          fill="white"
        />
        <Path
          d="M20.3454 52.7796H0.916016V41.1287L52.5287 41.0986V52.7645H33.0993L33.1299 105.178H20.376L20.3454 52.7796Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_92_571">
          <Rect
            width="330.116"
            height="127"
            fill="white"
            transform="translate(0.917969)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
