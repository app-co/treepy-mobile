import { MutableRefObject } from 'react';

import { UnauthorizedModalRef } from './types';

export default class UnauthorizedModalHandler {
  static ref: MutableRefObject<UnauthorizedModalRef | undefined>;

  static setRef(ref: MutableRefObject<UnauthorizedModalRef | undefined>) {
    this.ref = ref;
  }

  static showModal() {
    this.ref.current?.show();
  }

  static hideModal() {
    this.ref.current?.hide();
  }
}
