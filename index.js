import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

const TRIPADVISOR_API_KEY = process.env.API_KEY;

app.use(cors());

app.get("/api/tripadvisor/search", async (req, res) => {
  try {
    const { searchQuery = "addis ababa", language = "en" } = req.query;

    const url = `https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${encodeURIComponent(
      searchQuery
    )}&language=${language}&key=${"B4AF6CA23C674FA9998239496279832B"}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Referer: "https://line-trip-be.vercel.app",
        Origin: "https://line-trip-be.vercel.app",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from TripAdvisor" });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching data from TripAdvisor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/tripadvisor/detail", async (req, res) => {
  try {
    const { locationId } = req.query;

    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?language=en&currency=ETB&key=${"B4AF6CA23C674FA9998239496279832B"}`;
    const imageUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?language=en&key=${"B4AF6CA23C674FA9998239496279832B"}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Referer: "https://line-trip-be.vercel.app",
        Origin: "https://line-trip-be.vercel.app",
      },
    });
    const imageResponse = await fetch(imageUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Referer: "https://line-trip-be.vercel.app",
        Origin: "https://line-trip-be.vercel.app",
      },
    });

    console.log("response:", response);
    console.log("imageResponse:", imageResponse);

    if (!response.ok && !imageResponse.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from TripAdvisor" });
    }

    const data = await response.json();
    const imageData = await imageResponse.json();

    data.image = imageData.data[0].images.large.url;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from TripAdvisor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
