import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#000000",
			contrastText: "#CC0000",
		},
		secondary: {
			main: "#CC0000",
			contrastText: "#000000",
		},
		text: {
			primary: "#000000",
			secondary: "#CC0000",
		},
	},
	typography: {
		fontFamily: "Roboto",
		h1: {
			fontSize: "3rem",
			fontWeight: 700,
			lineHeight: 1.167,
			letterSpacing: "-0.01562em",
		},
		h2: {
			fontSize: "2.5rem",
			fontWeight: 700,
			lineHeight: 1.2,
			letterSpacing: "-0.00833em",
		},
		h3: {
			fontSize: "2rem",
			fontWeight: 700,
			lineHeight: 1.167,
			letterSpacing: "0em",
		},
		button: {
			fontSize: "1rem",
			fontWeight: 700,
			lineHeight: 1.75,
		},
		body1: {
			fontSize: "1rem",
			fontWeight: 400,
			lineHeight: 1.5,
		},
		body2: {
			fontSize: "0.875rem",
			fontWeight: 400,
			lineHeight: 1.43,
		},
     },
     zIndex: {
          appBar: 1200,
          drawer: 1100,
          modal: 1300,
     }
});
