import express from 'express'

import { 
    getRiders,
    getRiderById,
    addRider, 
    editRider, 
    deleteRider, 
    toggleRiderStatus, 
    addRating, 
    optimizeRoutes,
    getOrderStatus,
    updateOrderStatus,
    automateDispatch,
    communicateWithCustomer,
    confirmDelivery, 
    deliveryAnalytics
} from './database.js'


const app = express()
app.use(express.json()) // for parsing application/json

// Route to get all riders
app.get('/riders', async (req, res) => {
    try {
      const riders = await getRiders();
      res.json(riders);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Route to get a single rider by ID
app.get('/riders/:id', async (req, res) => {
  const riderId = req.params.id;
  try {
    const rider = await getRiderById(riderId);
    if (rider) {
      res.json(rider);
    } else {
      res.status(404).send('Rider not found');
    }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })


  // Route to add a rider
  app.post('/riders', async (req, res) => {
    const riderData = req.body;
    try {
      const newRiderId = await addRider(riderData);
      res.status(201).json({ rider_id: newRiderId, message: 'Rider added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to edit a rider
  app.put('/riders/:id', async (req, res) => {
    const riderId = req.params.id;
    const riderData = req.body;
    try {
      const result = await editRider(riderId, riderData);
      if (result) {
        res.status(200).send('Rider updated successfully');
      } else {
        res.status(404).send('Rider not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to delete a rider
  app.delete('/riders/:id', async (req, res) => {
    const riderId = req.params.id;
    try {
      const result = await deleteRider(riderId);
      if (result) {
        res.status(200).send('Rider deleted successfully');
      } else {
        res.status(404).send('Rider not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to toggle rider status (activate/deactivate)
  app.patch('/riders/:id/status', async (req, res) => {
    const riderId = req.params.id;
    const newStatus = req.body.status;
    try {
      const result = await toggleRiderStatus(riderId, newStatus);
      if (result) {
        res.status(200).send('Rider status updated successfully');
      } else {
        res.status(404).send('Rider not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to add a rating for a rider
  app.post('/riders/:id/ratings', async (req, res) => {
    const riderId = req.params.id;
    const { rating, feedback } = req.body;
    try {
      const newRatingId = await addRating(riderId, rating, feedback);
      res.status(201).json({ rating_id: newRatingId, message: 'Rating added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Route to optimize routes
  app.get('/optimize-routes', async (req, res) => {
    try {
      const optimizedRoutes = await optimizeRoutes();
      res.json(optimizedRoutes);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Route to get order status by ID
app.get('/order-status/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const status = await getOrderStatus(orderId);
    if (status) {
      res.json({ status: status });
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

// Route to update the order status
app.put('/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const result = await updateOrderStatus(orderId, newStatus);
    res.json({ message: result });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Route to automate dispatch
app.post('/automate-dispatch', async (req, res) => {
  try {
    const result = await automateDispatch();
    res.json({ message: result });
  } catch (error) {
    console.error('Error automating dispatch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/communicate', async (req, res) => {
  const { customerId, message } = req.body;

  try {
    const result = await communicateWithCustomer(customerId, message);
    res.json({ message: result });
  } catch (error) {
    console.error('Error communicating with customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Route to confirm delivery receipt
app.put('/orders/:orderId/confirm-delivery', async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await confirmDelivery(orderId);
    res.json({ message: result });
  } catch (error) {
    console.error('Error confirming delivery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Route to fetch delivery analytics
app.get('/delivery-analytics', async (req, res) => {
  try {
    const analyticsData = await deliveryAnalytics();
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching delivery analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke 💩')
  })
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })

