import { exec } from "child_process";
import path from "path";
import fs from "fs";
const scriptPath = "/home/charansrisai/bookmyevent/backend/controllers/app_metrics.sh"
const scriptPath2 = "/home/charansrisai/bookmyevent/backend/controllers/open_grafana.sh"
const logFilePath = "/home/charansrisai/bookmyevent/backend/logs/server.log"

const clearLogFile = (logFilePath) => {
    fs.writeFile(logFilePath, "", (err) => {
        if (err) {
            console.error("Error clearing log file:", err);
            return;
        }
        console.log("Log file cleared successfully.");
    });
};

const openGrafanaDashboards = () => {
    exec(scriptPath2, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};

export const pushDataToInflux = (req, res) => {
    exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ success: false, error: error.message });
        }
        // if (stderr) {
        //     console.error(`Script stderr: ${stderr}`);
        //     return res.status(500).json({ success: false, error: stderr });
        // }

        console.log(`Script output: ${stdout}`);

        openGrafanaDashboards();

        // clearLogFile(logFilePath);

        res.status(200).json({ success: true, message: "Data pushed to InfluxDB!" });
    });
};
