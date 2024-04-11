import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// Function to get all riders
export async function getRiders() {
  const [rows] = await pool.query("SELECT * FROM riders");
  return rows;
}

// Function to get a single rider by ID
export async function getRiderById(riderId) {
  const [rows] = await pool.query("SELECT * FROM riders WHERE rider_id = ?", riderId);
  return rows[0]; // Return the first row (or null if not found)
}

// Function to add a rider
export async function addRider(riderData) {
  const [result] = await pool.query("INSERT INTO riders SET ?", riderData);
  return result.insertId;
}

// Function to edit a rider
export async function editRider(riderId, riderData) {
  const [result] = await pool.query("UPDATE riders SET ? WHERE rider_id = ?", [
    riderData,
    riderId,
  ]);
  return result.affectedRows > 0;
}

// Function to delete a rider
export async function deleteRider(riderId) {
  const [result] = await pool.query(
    "DELETE FROM riders WHERE rider_id = ?",
    riderId
  );
  return result.affectedRows > 0;
}

// Function to deactivate or activate a rider
export async function toggleRiderStatus(riderId, newStatus) {
  const [result] = await pool.query(
    "UPDATE riders SET status = ? WHERE rider_id = ?",
    [newStatus, riderId]
  );
  return result.affectedRows > 0;
}

// Function to add a rating and feedback for a rider
export async function addRating(riderId, rating, feedback) {
  const [result] = await pool.query(
    "INSERT INTO rider_ratings (rider_id, rating, feedback) VALUES (?, ?, ?)",
    [riderId, rating, feedback]
  );
  return result.insertId;
}

//function to optimize routes
export async function optimizeRoutes() {
  //optimization logic here
  // This function could involve querying the database, calculating distances, finding the best route, etc.
  // For simplicity, let's assume it returns a list of optimized routes
  return [
    { start: 'Location A', end: 'Location B', waypoints: ['Waypoint 1', 'Waypoint 2'], distance_km: 2.5, estimated_time_minutes: 20 },
  ];
}

// Async function to fetch order status
export async function getOrderStatus(orderId) {
  const [rows] = await pool.query("SELECT status_name FROM order_status WHERE status_id = ?", orderId);
  if (rows.length > 0) {
    return rows[0].status_name;
  } else {
    return null; // Order not found
  }
}

// Function to fetch pending orders from the database
export async function getPendingOrders() {
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE status = 'pending'");
    return rows;
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    throw error;
  }
}

// Function to fetch available riders from the database
export async function getAvailableRiders() {
  try {
    const [rows] = await pool.query("SELECT * FROM riders WHERE status = 'active'");
    return rows;
  } catch (error) {
    console.error('Error fetching available riders:', error);
    throw error;
  }
}

// Function to assign a rider to an order
export async function assignRiderToOrder(riderId, orderId) {
  try {
    await pool.query("UPDATE orders SET rider_id = ? WHERE order_id = ?", [riderId, orderId]);
    console.log(`Rider ${riderId} assigned to order ${orderId}`);
  } catch (error) {
    console.error(`Error assigning rider ${riderId} to order ${orderId}:`, error);
    throw error;
  }
}

// Function to automate dispatch by assigning available riders to pending orders
export async function automateDispatch() {
  try {
    // Retrieve pending orders from the database
    const pendingOrders = await getPendingOrders();

    // Retrieve available riders from the database
    const availableRiders = await getAvailableRiders();

    // Iterate through each pending order
    for (const order of pendingOrders) {
      // Iterate through each available rider
      for (const rider of availableRiders) {
        // Assign the order to the rider if the rider is active
        if (rider.status === 'active') {
          await assignRiderToOrder(rider.rider_id, order.order_id);
          break; // Break out of the loop to assign the order to only one rider
        }
      }
    }

    return 'Dispatch automation completed';
  } catch (error) {
    console.error('Error automating dispatch:', error);
    throw error;
  }
}

// Async function for customer communication
export async function communicateWithCustomer(customerId, message) {
  try {
    // Insert communication record into the customer_communication table
    const [result] = await pool.query(
      "INSERT INTO customer_communication (customer_id, message) VALUES (?, ?)",
      [customerId, message]
    );

    // Check if the insertion was successful
    if (result.affectedRows === 1) {
      // Return a success message or any relevant data
      return 'Communication sent successfully';
    } else {
      throw new Error('Failed to insert communication record');
    }
  } catch (error) {
    // Handle any errors that occur during communication
    console.error('Error communicating with customer:', error);
    throw error;
  }
}

// Async function to update the order status
export async function updateOrderStatus(orderId, newStatus) {
  try {
    // Update the order status in the database
    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [newStatus, orderId]
    );

    // Check if the update was successful
    if (result.affectedRows === 1) {
      // Return a success message or any relevant data
      return 'Order status updated successfully';
    } else {
      throw new Error('Failed to update order status');
    }
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Async function for confirming delivery receipt
export async function confirmDelivery(orderId) {
  try {
    // Update the order status to 'delivered' in the order_status table
    const [result] = await pool.query(
      "UPDATE order_status SET status_name = ? WHERE status_id = ?",
      ['delivered', orderId]
    );

    // Check if the update was successful
    if (result.affectedRows === 1) {
      // Return a success message or any relevant data
      return 'Delivery confirmed successfully';
    } else {
      throw new Error('Failed to confirm delivery');
    }
  } catch (error) {
    // Handle any errors that occur during confirmation
    console.error('Error confirming delivery:', error);
    throw error;
  }
}

// Function to get total number of deliveries
async function getTotalDeliveries() {
  // Perform a query to fetch the total number of deliveries from the database
  const [result] = await pool.query('SELECT COUNT(*) AS totalDeliveries FROM deliveries');
  return result[0].totalDeliveries;
}

// Function to get average delivery time
async function getAverageDeliveryTime() {
  // Perform a query to calculate the average delivery time from the database
  const [result] = await pool.query('SELECT AVG(delivery_time) AS averageDeliveryTime FROM deliveries');
  return result[0].averageDeliveryTime;
}

// Function to get customer satisfaction rating
async function getCustomerSatisfactionRating() {
  // Perform a query to calculate the average customer satisfaction rating from the database
  const [result] = await pool.query('SELECT AVG(rating) AS customerSatisfactionRating FROM rider_ratings');
  return result[0].customerSatisfactionRating;
}

// Function to get total delivery cost
async function getTotalDeliveryCost() {
  // Perform a query to calculate the total delivery cost from the database
  const [result] = await pool.query('SELECT SUM(delivery_cost) AS totalDeliveryCost FROM deliveries');
  return result[0].totalDeliveryCost;
}

// Async function for delivery analytics
export async function deliveryAnalytics() {
  try {
    // Fetch data from the database or external services to perform analytics
    const totalDeliveries = await getTotalDeliveries();
    const averageDeliveryTime = await getAverageDeliveryTime();
    const customerSatisfactionRating = await getCustomerSatisfactionRating();
    const totalDeliveryCost = await getTotalDeliveryCost();

    // Perform additional analytics calculations or processing as needed

    // Return the analytics data
    return {
      totalDeliveries,
      averageDeliveryTime,
      customerSatisfactionRating,
      totalDeliveryCost
      // Add more analytics metrics as needed
    };
  } catch (error) {
    // Handle any errors that occur during analytics
    console.error('Error performing delivery analytics:', error);
    throw error;
  }
}
