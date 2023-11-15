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

// Define the type for the request body
type RequestBody = {
  prompt: string;
  // Add other properties of the request body here
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const versionId = "76acc4075d0633dcb3823c1fed0419de21d42001b65c816c7b5b9beff30ec8cd";

  const prediction: Prediction = await replicate.predictions.create({
    version: versionId,
    input: req.body as RequestBody,
    // Add any other required input parameters for the new model here
    // webhook here
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.json({ detail: prediction.error });
    return;
  }

  res.statusCode = 201;
  res.json(prediction);
}
