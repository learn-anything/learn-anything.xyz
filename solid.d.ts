declare module "solid-js" {
	namespace JSX {
		/*
        Makes all HTML events available in JSX
        as on:eventname and oncapture:eventname attributes.
    */
		interface CustomEvents extends HTMLElementEventMap {}
		interface CustomCaptureEvents extends HTMLElementEventMap {}
	}
}

export type {}
