
import express from "express";

const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// Sample vehicle records
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "DL8CAF1234",
        type: "Sedan",
        price: 1200000
    },
    {
        id: 3,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5678",
        type: "Hatchback",
        price: 750000
    }
];

// Validate vehicle details
function validateVehicle(vehicle) {
    const { id, vehicleName, vehicleNumber, type, price } = vehicle;

    return (
        id !== undefined &&
        id !== null &&
        String(id).trim() !== "" &&
        typeof vehicleName === "string" &&
        vehicleName.trim() !== "" &&
        typeof vehicleNumber === "string" &&
        vehicleNumber.trim() !== "" &&
        typeof type === "string" &&
        type.trim() !== "" &&
        price !== undefined &&
        price !== null &&
        price !== "" &&
        Number.isFinite(Number(price)) &&
        Number(price) > 0
    );
}

// GET: Retrieve all vehicles
app.get("/vehicles", (req, res) => {

    res.status(200).json({
        message: "All vehicles retrieved successfully",
        vehicles: vehicles
    });

});

// GET: Retrieve vehicle by ID
app.get("/vehicles/:id", (req, res) => {

    const id = req.params.id;

    const vehicle = vehicles.find(
        v => String(v.id) === id
    );

    if (!vehicle) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    res.status(200).json(vehicle);

});

// POST: Add a new vehicle
app.post("/vehicles", (req, res) => {

    const newVehicle = req.body;

    if (!newVehicle || typeof newVehicle !== "object" ||
        Array.isArray(newVehicle) || !validateVehicle(newVehicle)) {

        return res.status(400).json({
            message: "Missing or invalid vehicle details"
        });
    }

    const existingVehicle = vehicles.find(
        v => String(v.id) === String(newVehicle.id)
    );

    if (existingVehicle) {
        return res.status(400).json({
            message: "Vehicle ID already exists"
        });
    }

    const vehicle = {
        id: newVehicle.id,
        vehicleName: newVehicle.vehicleName.trim(),
        vehicleNumber: newVehicle.vehicleNumber.trim(),
        type: newVehicle.type.trim(),
        price: Number(newVehicle.price)
    };

    vehicles.push(vehicle);

    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: vehicle
    });

});

// PUT: Update vehicle details
app.put("/vehicles/:id", (req, res) => {

    const id = req.params.id;

    const index = vehicles.findIndex(
        v => String(v.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const updatedVehicle = req.body;

    if (
        !updatedVehicle ||
        typeof updatedVehicle !== "object" ||
        Array.isArray(updatedVehicle) ||
        !validateVehicle({
            ...updatedVehicle,
            id: vehicles[index].id
        })
    ) {
        return res.status(400).json({
            message: "Invalid or missing vehicle details"
        });
    }

    vehicles[index] = {
        id: vehicles[index].id,
        vehicleName: updatedVehicle.vehicleName.trim(),
        vehicleNumber: updatedVehicle.vehicleNumber.trim(),
        type: updatedVehicle.type.trim(),
        price: Number(updatedVehicle.price)
    };

    res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle: vehicles[index]
    });

});

// DELETE: Delete vehicle
app.delete("/vehicles/:id", (req, res) => {

    const id = req.params.id;

    const index = vehicles.findIndex(
        v => String(v.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const deletedVehicle = vehicles[index];

    vehicles.splice(index, 1);

    res.status(200).json({
        message: "Vehicle deleted successfully",
        vehicle: deletedVehicle
    });

});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });

});

// Handle invalid routes
app.use((req, res) => {

    res.status(404).json({
        message: "404 - Route Not Found"
    });

});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
