const fs = require("fs");
module.exports.order_array_get = (req, res) => {
  try {
    // Read the JSON file and parse the data
    const data = JSON.parse(fs.readFileSync("./order.json"));

    // Extract the allowedOrderArray from the data
    const allowedOrderArray = data.allowedOrderArray || [];

    // Send the array as a JSON response
    res.json({ allowedOrderArray });
  } catch (error) {
    console.error("Error reading data from file:", error);
    res.status(500).json({ error: "Error reading data from file" });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.order_array_post = (req, res) => {
  try {
    const updatedArray = req.body.allowedOrderArray;

    // Ensure the updatedArray is an array
    if (!Array.isArray(updatedArray)) {
      return res.status(400).json({ error: "Invalid array format" });
    }

    // Update the array in the JSON file
    const updatedData = {
      allowedOrderArray: updatedArray,
    };
    fs.writeFile(
      "./order.json",
      JSON.stringify(updatedData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).json({ error: "Error writing to file" });
        }

        console.log("Array updated successfully:", updatedArray);
        res.json({ success: true, updatedArray });
      }
    );
  } catch (error) {
    console.error("Error updating array:", error);
    res.status(500).json({ error: "Error updating array" });
  }
};