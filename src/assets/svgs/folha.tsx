import { Path, Svg } from 'react-native-svg';

interface I {
  sizes?: number;
}
export function Folha({ sizes = 41 }: I) {
  return (
    <Svg width={sizes} height={sizes - 3} viewBox="0 0 41 38" fill="none">
      <Path
        d="M19.4194 7V10.102H18.0079V7H19.4194ZM19.2475 24.1714V27H17.836V24.1714H19.2475ZM20.2428 20.7224C20.2428 20.3228 20.1794 19.9828 20.0528 19.7024C19.9321 19.422 19.7331 19.1732 19.4556 18.9558C19.1841 18.7385 18.8162 18.5282 18.3517 18.3249C17.5676 17.9744 16.8769 17.6029 16.2797 17.2103C15.6886 16.8107 15.2272 16.3165 14.8954 15.7277C14.5636 15.1318 14.3978 14.3782 14.3978 13.4669C14.3978 12.5976 14.5757 11.844 14.9316 11.2061C15.2875 10.5682 15.7791 10.0775 16.4064 9.73396C17.0398 9.38346 17.7757 9.2082 18.6141 9.2082C19.2535 9.2082 19.8326 9.32036 20.3513 9.54469C20.8701 9.76201 21.3165 10.0845 21.6904 10.5121C22.0644 10.9327 22.3509 11.4479 22.55 12.0578C22.749 12.6677 22.8486 13.3652 22.8486 14.1504H20.2518C20.2518 13.7298 20.2126 13.3582 20.1342 13.0358C20.0558 12.7133 19.9412 12.4434 19.7904 12.2261C19.6456 12.0088 19.4707 11.8475 19.2656 11.7424C19.0605 11.6302 18.8343 11.5741 18.587 11.5741C18.219 11.5741 17.9174 11.6583 17.6822 11.8265C17.4469 11.9947 17.275 12.2226 17.1664 12.51C17.0639 12.7904 17.0126 13.1129 17.0126 13.4774C17.0126 13.8349 17.0669 14.1469 17.1755 14.4132C17.2901 14.6796 17.4861 14.925 17.7636 15.1493C18.0411 15.3666 18.4211 15.591 18.9037 15.8223C19.6878 16.1728 20.3755 16.5513 20.9666 16.9579C21.5577 17.3645 22.0192 17.8623 22.3509 18.4511C22.6827 19.04 22.8486 19.79 22.8486 20.7014C22.8486 21.6057 22.6676 22.3768 22.3057 23.0147C21.9438 23.6456 21.4371 24.1293 20.7856 24.4658C20.1342 24.7953 19.3802 24.96 18.5236 24.96C17.9687 24.96 17.4168 24.8759 16.8679 24.7077C16.319 24.5324 15.8213 24.252 15.375 23.8665C14.9286 23.4809 14.5727 22.9692 14.3073 22.3312C14.0419 21.6863 13.9092 20.8941 13.9092 19.9548H16.515C16.515 20.4665 16.5723 20.8941 16.6869 21.2376C16.8015 21.5741 16.9523 21.844 17.1393 22.0473C17.3323 22.2436 17.5495 22.3838 17.7908 22.4679C18.032 22.5521 18.2763 22.5941 18.5236 22.5941C18.9097 22.5941 19.2264 22.5135 19.4737 22.3523C19.727 22.191 19.917 21.9702 20.0437 21.6898C20.1764 21.4024 20.2428 21.0799 20.2428 20.7224Z"
        fill="white"
      />
      <Path
        d="M1.39355 37L7.35315 30.5144C10.5813 31.5954 16.7326 34.7092 22.9971 31.8065C28.9567 29.045 32.4837 22.0781 33.4264 15.9228C34.5944 8.29627 33.4264 3.76237 37.1511 1.33028C31.6882 0.789819 19.4213 0.519587 14.0577 3.76237C7.35315 7.81586 2.88345 15.1112 3.6284 25.6502"
        stroke="white"
        stroke-width="2"
      />
    </Svg>
  );
}
