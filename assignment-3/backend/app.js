

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const admin = require("firebase-admin");

const serviceAccount = require("./service-account.json");

const session = require("express-session");

try {
	/**
	 * Initializes Firebase Admin SDK with credentials from the service account.
	 * Used for managing Firestore and authentication.
	 */
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
} catch (error) {
	console.error("Error initializing Firebase Admin SDK:", error);
}

const db = admin.firestore();

const driverRoutes = require("./routes/driver_routes");

const packageRoutes = require("./routes/package_routes");

const driverAppRoutes = require("./routes/driver_app_routes");

const packageAppRoutes = require("./routes/package_app_routes");

const authRoutes = require("./routes/auth_routes");

const authAppRoutes = require("./routes/auth_app_routes");

const Driver = require("./models/Driver");

const Package = require("./models/Package");

const cors = require("cors");

const PORT_NUMBER = 8081;

const app = express();
let url = "mongodb://127.0.0.1:27017/Assignment3DB";
// internal ip
// "mongodb://10.192.0.7:27017/Assignment2DB";
//external ip
// "mongodb://34.129.185.112:27017/Assignment2DB";
/**
 * Asynchronously connects to the MongoDB database using Mongoose.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
async function connect() {
	await mongoose.connect(url);
}
connect().catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({
	keyFilename: "./fit2095.json",
});
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const fs = require("fs");
const path = require("path");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
const textToSpeechClient = new TextToSpeechClient({
	keyFilename: "./fit2095.json",
});
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini_api_key = "AIzaSyA29UzlQUPxc9Kt2AjBGrDEJji0ZBA8N8Q";
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
	temperature: 0.9,
	topP: 1,
	topK: 1,
	maxOutputTokens: 4096,
};
// Create an async function to use await
async function generateGeminiResponse(data) {
	const geminiModel = googleAI.getGenerativeModel({
		model: "gemini-pro",
		...geminiConfig,
	});

	const result = await geminiModel.generateContent(
		`calculate the distance from melbourne to ${data} in KM,answer in this format 'distance km'`
	);
	return JSON.stringify(result.response.candidates[0].content.parts[0].text);
}

io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	// Translation event
	// Listen for 'translatePackage' events
	socket.on("translatePackage", async (data) => {
		console.log("Received translation request:", data);
		const { description, language } = data;

		try {
			// Use Google Cloud Translate API to translate the description
			const [translatedText] = await translate.translate(description, language);
			console.log("Translated text:", translatedText);
			// Emit the translated text back to the frontend
			socket.emit("translatedDescription", {
				packageId: data.packageId,
				translatedText,
			});
		} catch (error) {
			console.error("Error translating text:", error);
			socket.emit("errorTranslation", "Translation failed.");
		}
	});

	// Text-to-Speech conversion event
	socket.on("convertToSpeech", async (data) => {
		console.log("Received t2s request:", data);
		const { driverLicence, language, driverId } = data;
		const request = {
			input: { text: driverLicence },
			voice: { languageCode: language, ssmlGender: "NEUTRAL" },
			audioConfig: { audioEncoding: "MP3" },
		};

		try {
			const [response] = await textToSpeechClient.synthesizeSpeech(request);
			const fileName = `output-${driverId}.mp3`;
			const filePath = path.join(__dirname, "audio", fileName);

			// Save the MP3 file
			fs.writeFileSync(filePath, response.audioContent, "binary");
			console.log("Audio content written to file:", fileName + filePath);

			// Send the filename to the frontend for downloading or playing
			socket.emit("audioReady", {
				url: `/audio/${fileName}`,
				driverId: driverId,
			});
		} catch (error) {
			console.error("Error with Text-to-Speech:", error);
			socket.emit("error", "Text-to-Speech failed");
		}
	});

	socket.on("calculateDistance", async (data) => {
		console.log("Received destination:", data.destination);
		try {
			const response = await generateGeminiResponse(data.destination);
			socket.emit("distanceCalculated", { response });
		} catch (error) {
			console.error("Error calculating distance:", error);
			socket.emit("distanceCalculated", {
				error: "Failed to calculate distance",
			});
		}
	});
});
app.use("/audio", express.static(path.join(__dirname, "/audio")));

app.use(express.static("../dist/assignment-3/browser"));

app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

const { isAuthenticated, isAppsAuthenticated } = require("./middlewares/auth");

app.get("/32758324/tzeying/api/v1/statistics", async (req, res) => {
	const statsRef = db.collection("operation_data").doc("crud_counts");
	try {
		const doc = await statsRef.get();
		const counters = doc.data();

		res.json({
			insertCount: counters.insert || 0,
			retrieveCount: counters.retrieve || 0,
			updateCount: counters.update || 0,
			deleteCount: counters.delete || 0,
		});

		await statsRef.update({
			retrieve: admin.firestore.FieldValue.increment(1),
		});
	} catch (error) {
		console.error("Error fetching stats:", error);
		res.status(400).json({ error: "Error fetching stats" });
	}
});

//Login and Sign up endpoint
app.use("/32758324/tzeying/users", authRoutes);
app.use("/32758324/tzeying/api/v1/users", authAppRoutes);

// HTML endpoint
app.use("/32758324/tzeying/drivers", isAuthenticated, driverRoutes);
app.use("/32758324/tzeying/packages", isAuthenticated, packageRoutes);

// Apps RESTful endpoint
app.use(
	"/32758324/tzeying/api/v1/drivers",
	// isAppsAuthenticated,
	driverAppRoutes
);
app.use(
	"/32758324/tzeying/api/v1/packages",
	// isAppsAuthenticated,
	packageAppRoutes
);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist/assignment-3/browser/index.html"));
});

/**
 * Starts the Express app on the specified port.
 * Logs the port number on successful start.
 */
server.listen(PORT_NUMBER, () => {
	console.log(`Listening on port ${PORT_NUMBER}`);
});
