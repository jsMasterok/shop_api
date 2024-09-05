import express from "express";
import cors from "cors";
import axios from "axios";

const app = express().use(express.json()).use(cors());

app.get("/", (req, res) => {
  res.send("BestWishesAPI");
});

app.get("/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://crm.sitniks.com/open-api/products",
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`, // Токен передается здесь
          "Content-Type": "application/json", //
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send("Error fetching data");
  }
});

// app.use(
//   "/",
//   createProxyMiddleware({
//     proxyTimeout: 30000,
//     timeout: 30000,

//     target: {
//       href: "https://crm.sitniks.com/open-api",
//       auth: "Bearer ${process.env.BEARER_TOKEN}`",
//     },
//     changeOrigin: true,
//     headers: {
//       Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     onProxyReq: (proxyReq, req) => {
//       proxyReq.setHeader("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
//     },
//   })
// );

app.listen(process.env.PORT || 4444, (err) => {
  if (err) return console.log(err);
  console.log("Proxy server is running");
});
