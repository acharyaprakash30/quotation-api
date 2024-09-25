import compression from 'compression';
import cors from 'cors';
import express from "express";
import helmet from 'helmet';
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'deployment') {
  app.use('/api/v1/uploads', express.static('dist/uploads'));
} else {
  app.use('/api/v1/uploads', express.static('uploads'));
}

app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
