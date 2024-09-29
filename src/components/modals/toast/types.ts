export type T = {
  title: string;
  description: string;
  tipo: 'success' | 'warning' | 'error';
};

export type GlobalErrorModalRef = {
  show: () => void;
  hide: () => void;
  item: (obj: T) => void;
};
