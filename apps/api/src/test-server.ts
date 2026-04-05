import express from 'express';
import apiRoutes from './routes/index';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(apiRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[API-Test] Server running on http://localhost:${PORT}`);
});
