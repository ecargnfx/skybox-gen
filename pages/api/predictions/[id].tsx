import Replicate from "replicate";
import type { NextApiRequest, NextApiResponse } from 'next';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the type for the prediction object
type Prediction = {
  error?: string;
  // Add other properties of prediction here
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prediction: Prediction = await replicate.predictions.get(req.query.id as string);

  if (prediction?.error) {
    res.statusCode = 500;
    res.json({ detail: prediction.error });
    return;
  }

  res.json(prediction);
}
