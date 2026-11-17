
import http from "http";
import fs from "fs";

const PORT = 3000;

// Vehicle records
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

// Create HTTP server
const server = http.createServer((req, res) => {

    // Welcome route
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Vehicle Management System</h1>
            <p>Welcome to our Vehicle Management Application.</p>
            <a href="/vehicles">View Vehicles</a>
        `);
    }

    // Get all vehicles
    else if (req.method === "GET" && req.url === "/vehicles") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(vehicles));
    }

    // About route
    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>About Application</h1>
            <p>This is a Vehicle Management Web Application.</p>
            <p>Created using Node.js HTTP and FS modules.</p>
        `);
    }

    // Serve static info.html using FS module
    else if (req.method === "GET" && req.url === "/info") {
        fs.readFile("./public/info.html", "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error: Unable to read info.html file.");
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        });
    }

    // Add vehicle using POST
    else if (req.method === "POST" && req.url === "/add-vehicle") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const newVehicle = JSON.parse(body);

                const { id, vehicleName, vehicleNumber, type, price } =
                    newVehicle;

                if (
                    id === undefined ||
                    !vehicleName ||
                    !vehicleNumber ||
                    !type ||
                    price === undefined ||
                    !Number.isFinite(Number(price)) ||
                    Number(price) <= 0
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Invalid or missing vehicle details"
                    }));

                    return;
                }

                if (vehicles.some(vehicle => vehicle.id === id)) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Vehicle ID already exists"
                    }));

                    return;
                }

                const vehicle = {
                    id,
                    vehicleName,
                    vehicleNumber,
                    type,
                    price: Number(price)
                };

                vehicles.push(vehicle);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Vehicle added successfully",
                    vehicle: vehicle
                }));

            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON format"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "404 - Route Not Found"
        }));
    }

});

// Start server
server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
