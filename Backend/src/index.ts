import express from "express";
var cors = require('cors');
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import ManageEmployeeRoutes from "./routes/ManageEmployeeRoutes";
import ManageDashboardRoutes from "./routes/ManageDashboardRoutes";
import ManageLoginRoutes from "./routes/ManageLoginRoutes";
import ManageHotelRoutes from "./routes/ManageHotelRoutes";
import ManageHotelRoomRoutes from "./routes/ManageHotelRoomRoutes";
import ManageHotelBookingRoutes from "./routes/ManageHotelBookingRoutes";
import ManageFlightBookingRoutes from "./routes/ManageFlightBookingRoutes";
import ManageCarBookingRoutes from "./routes/ManageCarBookingRoutes";
import ManageBusBookingRoutes from "./routes/ManageBusBookingRoutes";
import ManageTrainBookingRoutes from "./routes/ManageTrainBookingRoute";
import ManageBillingRoutes from "./routes/ManageBillingRoutes";
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


const swaggerDocument = require("./docs/swagger.json"); 
app.use("/app", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/employee", ManageEmployeeRoutes);
app.use("/dashboard", ManageDashboardRoutes);
app.use("/hotel", ManageHotelRoutes);
app.use("/hotelbooking", ManageHotelBookingRoutes);
app.use("/hotelroom", ManageHotelRoomRoutes);
app.use("/login", ManageLoginRoutes);
app.use("/flightbooking", ManageFlightBookingRoutes);
app.use("/busbooking", ManageBusBookingRoutes);
app.use("/carbooking", ManageCarBookingRoutes);
app.use("/trainbooking", ManageTrainBookingRoutes);
app.use("/billings", ManageBillingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
