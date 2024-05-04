import React from "react";

function Trackorder() {
	const messageStyle = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		fontSize: "20px",
		color: "#333",
		backgroundColor: "#f0f0f0",
		fontFamily: "Arial, sans-serif",
	};

	return <div style={messageStyle}>Your order is still being collected!</div>;
}

export default Trackorder;
