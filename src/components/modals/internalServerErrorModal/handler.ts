import { MutableRefObject } from 'react';

import { InternalServerErrorModalRef } from './types';

export default class InternalServerErrorModalHandler {
  static ref: MutableRefObject<InternalServerErrorModalRef | undefined>;

  static setRef(
    ref: MutableRefObject<InternalServerErrorModalRef | undefined>,
  ) {
    this.ref = ref;
  }

  static showModal() {
    this.ref.current?.show();
  }

  static hideModal() {
    this.ref.current?.hide();
  }
}
