import { useState, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";

// Define the structure of the prediction object
interface Prediction {
  id?: string;
  status?: string;
  output?: string;
  detail?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: target.prompt.value,
      }),
    });
    let predictionData: Prediction = await response.json();
    if (response.status !== 201) {
      setError(predictionData.detail);
      return;
    }
    setPrediction(predictionData);

    while (
      predictionData.status !== "succeeded" &&
      predictionData.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + predictionData.id);
      predictionData = await response.json();
      if (response.status !== 200) {
        setError(predictionData.detail);
        return;
      }
      console.log({ predictionData });
      setPrediction(predictionData);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Skybox Gen</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/sdxl?utm_source=project&utm_project=getting-started">
          SDXL
        </a>
      </h1>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <button className="button" type="submit">
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div>
              <Image
                src={prediction.output} //URL
                alt="output"
                layout="fill"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}
