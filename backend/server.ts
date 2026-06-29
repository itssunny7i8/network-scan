import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import scanRouter from './scanRouter';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Apply Helmet security headers
app.use(helmet());

// 2. Enable CORS with specific options
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Render health checks) or matched origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Configure Rate Limiter to prevent brute-forcing scans
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many scan requests. Please wait a moment and try again.'
  }
});

app.use('/api/', apiLimiter);

// 4. Body parser middleware
app.use(express.json());

// 5. Setup Routes
app.use('/api', scanRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', simulator: 'active' });
});

// 6. Global error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Nmap Scanner Educational Simulator Backend Active`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔒 Security: Helmet, CORS, and Rate Limiting enabled`);
  console.log(`=================================================`);
});
