import { MutableRefObject } from 'react';

import { ConnectionErrorModalRef } from './types';

export default class ConnectionErrorModalHandler {
  static ref: MutableRefObject<ConnectionErrorModalRef | undefined>;

  static setRef(ref: MutableRefObject<ConnectionErrorModalRef | undefined>) {
    this.ref = ref;
  }

  static showModal() {
    this.ref.current?.show();
  }

  static hideModal() {
    this.ref.current?.hide();
  }
}
