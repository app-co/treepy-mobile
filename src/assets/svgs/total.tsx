import { Path, Svg } from 'react-native-svg';

interface I {
  size?: number;
}

export function TotalSvg({ size = 84 }: I) {
  return (
    <Svg width={size} height={size - 10} viewBox="0 0 84 72" fill="none">
      <Path
        d="M83.8556 68.7273C83.8556 69.5953 83.5158 70.4277 82.911 71.0414C82.3062 71.6552 81.4858 72 80.6304 72H3.22522C2.36984 72 1.54949 71.6552 0.944644 71.0414C0.339799 70.4277 0 69.5953 0 68.7273V3.27273C0 2.40475 0.339799 1.57232 0.944644 0.95856C1.54949 0.344805 2.36984 0 3.22522 0C4.0806 0 4.90094 0.344805 5.50579 0.95856C6.11063 1.57232 6.45043 2.40475 6.45043 3.27273V41.8786L26.9023 23.7273C27.4589 23.2329 28.1659 22.9477 28.9051 22.9194C29.6442 22.8911 30.3704 23.1214 30.9621 23.5718L54.6715 41.6168L78.5058 20.4545C78.8183 20.1406 79.1908 19.8949 79.6003 19.7324C80.0098 19.5699 80.4478 19.4941 80.8873 19.5097C81.3267 19.5253 81.7584 19.6318 82.1558 19.8229C82.5531 20.014 82.9078 20.2854 83.198 20.6207C83.4882 20.9559 83.7077 21.3479 83.8432 21.7724C83.9786 22.1969 84.0271 22.645 83.9856 23.0892C83.9441 23.5334 83.8136 23.9643 83.6019 24.3555C83.3903 24.7466 83.1021 25.0897 82.755 25.3636L56.9533 48.2727C56.3968 48.7671 55.6897 49.0523 54.9506 49.0806C54.2115 49.1089 53.4852 48.8786 52.8936 48.4282L29.1842 30.3914L6.45043 50.5759V65.4545H80.6304C81.4858 65.4545 82.3062 65.7993 82.911 66.4131C83.5158 67.0269 83.8556 67.8593 83.8556 68.7273Z"
        fill="#1D5C41"
      />
    </Svg>
  );
}