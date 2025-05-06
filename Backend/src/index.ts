import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import ManageDepartmentRoutes from "./routes/ManageDepartmentRoutes";
import ManageEmployeeRoutes from "./routes/ManageEmployeeRoutes";
import ManageEmployeeSystemImagesRoutes from "./routes/ManageEmployeeSystemImagesRoutes";
import ManageEmployeeWorkingHoursRoutes from "./routes/ManageEmployeeWorkingHoursRoutes";
import ManageLiveStreamingSetupRoutes from "./routes/ManageLiveStreamingSetupRoutes";
import ManageDesignationRoutes from "./routes/ManageDesignationRoutes";
import ManageDashboardRoutes from "./routes/ManageDashboardRoutes";
import ManageLoginRoutes from "./routes/ManageLoginRoutes";
import ManageHotelRoutes from "./routes/ManageHotelRoutes";
import ManageHotelRoomRoutes from "./routes/ManageHotelRoomRoutes";
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const swaggerDocument = require("./docs/swagger.json"); 
app.use("/app", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/live-streaming-setup", ManageLiveStreamingSetupRoutes);
// app.use("/working-hours", ManageEmployeeWorkingHoursRoutes);
// app.use("/images", ManageEmployeeSystemImagesRoutes);
app.use("/employee", ManageEmployeeRoutes);
// app.use("/department", ManageDepartmentRoutes);
// app.use("/designation", ManageDesignationRoutes);
// app.use("/dashboard", ManageDashboardRoutes);
app.use("/hotel", ManageHotelRoutes);
app.use("/hotelroom", ManageHotelRoomRoutes);
app.use("/login", ManageLoginRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Socket.IO server running");
});
