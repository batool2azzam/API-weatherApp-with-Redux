import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

moment.locale("ar");

const theme = createTheme({
	typography: {
		fontFamily: ["IBM"],
	},
});

let cancelAxios = null;

function App() {
	const { t, i18n } = useTranslation();

	const [dateAndTime, setDateAndTime] = useState("");
	const [temp, setTemp] = useState({
		number: null,
		description: "",
		min: null,
		max: null,
		icon: null,
	});
	const [locale, setLocale] = useState("ar");

	const direction = locale === "ar" ? "rtl" : "ltr";

	function handleLanguageClick() {
		if (locale === "en") {
			setLocale("ar");
			i18n.changeLanguage("ar");
			moment.locale("ar");
		} else {
			setLocale("en");
			i18n.changeLanguage("en");
			moment.locale("en");
		}

		setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
	}
	useEffect(() => {
		i18n.changeLanguage(locale);
	}, []);
	useEffect(() => {
		setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
		axios
			.get(
				"https://api.openweathermap.org/data/2.5/weather?lat=27.56&lon=18&appid=e43a43020176ceae954196fd3ab8b15f",
				{
					cancelToken: new axios.CancelToken((c) => {
						cancelAxios = c;
					}),
				}
			)
			.then(function (response) {

				const responseTemp = Math.round(
					response.data.main.temp - 272.15
				);
				const min = Math.round(response.data.main.temp_min - 272.15);
				const max = Math.round(response.data.main.temp_max - 272.15);
				const description = response.data.weather[0].description;
				const responseIcon = response.data.weather[0].icon;

				setTemp({
					number: responseTemp,
					min: min,
					max: max,
					description: description,
					icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
				});

				console.log(response);
			})
			.catch(function (error) {

				console.log(error);
			});			  

		return () => {
			console.log("canceling");
			cancelAxios();
		};
	}, []);
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<Container maxWidth="sm">
					<div
						style={{
							height: "100vh",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<div
							dir={direction}
							style={{
								width: "100%",
								background: "rgb(28 52 91 / 36%)",
								color: "white",
								padding: "10px",
								borderRadius: "15px",
								boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
							}}
						>
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "end",
										justifyContent: "start",
									}}
									dir={direction}
								>
									<Typography
										variant="h2"
										style={{
											marginRight: "20px",
											fontWeight: "600",
										}}
									>
										{t("Jenin")}
									</Typography>

									<Typography
										variant="h5"
										style={{ marginRight: "20px" }}
									>
										{dateAndTime}
									</Typography>
								</div>
								<hr />

								<div
									style={{
										display: "flex",
										justifyContent: "space-around",
									}}
								>
									<div>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Typography
												variant="h1"
												style={{ textAlign: "right" }}
											>
												{temp.number}
											</Typography>

											<img src={temp.icon} alt="wetherIcon"/>
										</div>

										<Typography variant="h6">
											{t(temp.description)}
										</Typography>

										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<h5>
												{t("min")}: {temp.min}
											</h5>
											<h5 style={{ margin: "0px 5px" }}>
												|
											</h5>
											<h5>
												{t("max")}: {temp.max}
											</h5>
										</div>
									</div>

									<CloudIcon
										style={{
											fontSize: "200px",
											color: "white",
										}}
									/>
								</div>
							</div>
						</div>
					
						<div
							dir={direction}
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "end",
								marginTop: "20px",
							}}
						>
							<Button
								style={{ color: "white" }}
								variant="text"
								onClick={handleLanguageClick}
							>
								{locale === "en" ? "Arabic" : "إنجليزي"}
							</Button>
						</div>
					</div>
				</Container>
			</ThemeProvider>
		</div>
	);
}

export default App;
