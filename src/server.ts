import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600, // 10 minutes
};

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Apply middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(express.json());

// Dynamic route loading
const apiPath = path.join(__dirname, 'api');
const versions = fs.readdirSync(apiPath);

versions.forEach((version) => {
  const versionPath = path.join(apiPath, version);
  const features = fs.readdirSync(versionPath);

  features.forEach((feature) => {
    const featurePath = path.join(versionPath, feature);
    const apiFile = path.join(featurePath, `${feature}.api.ts`);

    if (fs.existsSync(apiFile)) {
      let router;
      import(apiFile)
        .then((module) => {
          router = module.default;
          app.use(`/api/${version}/${feature}`, router);
        })
        .catch((err) => {
          console.error(`Failed to load API file ${apiFile}:`, err);
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
