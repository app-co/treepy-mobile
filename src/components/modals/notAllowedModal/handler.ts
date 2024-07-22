import { MutableRefObject } from 'react';

import { NotAllowedModalRef } from './types';

export default class NotAllowedModalHandler {
  static ref: MutableRefObject<NotAllowedModalRef | undefined>;

  static setRef(ref: MutableRefObject<NotAllowedModalRef | undefined>) {
    this.ref = ref;
  }

  static showModal() {
    this.ref.current?.show();
  }

  static hideModal() {
    this.ref.current?.hide();
  }
}
