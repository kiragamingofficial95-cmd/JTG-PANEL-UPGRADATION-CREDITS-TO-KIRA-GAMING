import express from 'express';

export function setupRoutes(router, context) {
  // Get current counter state
  router.get('/state', async (req, res) => {
    try {
      const config = context.config || { startValue: 0, maxValue: 1000 };
      const result = await context.database.query(
        `SELECT SUM(CASE WHEN action IN ('increment', 'install') THEN value ELSE -value END) as total FROM demo_counter_log`
      );
      const currentValue = (result[0]?.total || config.startValue);
      
      res.json({
        success: true,
        value: Math.min(currentValue, config.maxValue),
        config: config
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Increment counter
  router.post('/increment', async (req, res) => {
    try {
      const config = context.config || { incrementStep: 1, maxValue: 1000 };
      const step = config.incrementStep || 1;
      
      await context.database.query(
        `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
        ['increment', step]
      );
      
      res.json({
        success: true,
        message: 'Counter incremented',
        step: step
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Decrement counter
  router.post('/decrement', async (req, res) => {
    try {
      const config = context.config || { incrementStep: 1 };
      const step = config.incrementStep || 1;
      
      await context.database.query(
        `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
        ['decrement', step]
      );
      
      res.json({
        success: true,
        message: 'Counter decremented',
        step: step
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get activity log
  router.get('/log', async (req, res) => {
    try {
      const logs = await context.database.query(
        `SELECT * FROM demo_counter_log ORDER BY timestamp DESC LIMIT 20`
      );
      
      res.json({
        success: true,
        logs: logs
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Reset counter
  router.post('/reset', async (req, res) => {
    try {
      const config = context.config || { startValue: 0 };
      
      await context.database.query(
        `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
        ['reset', config.startValue]
      );
      
      res.json({
        success: true,
        message: 'Counter reset',
        value: config.startValue
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
