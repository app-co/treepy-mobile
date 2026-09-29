import type { RefObject } from "react";

import type { GlobalRef, T } from "./types";

let ref: RefObject<GlobalRef | null>;

function setRef(newRef: RefObject<GlobalRef | null>) {
	ref = newRef;
}

function show(item: T) {
	ref.current?.show(item);
}

function hide() {
	ref.current?.hide();
}

const Alert = { setRef, show, hide };
export default Alert;
