import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express().use(express.json());

const BEARER_TOKEN = "DGoEUHrr1gCqM9j6syfSJP4yhYTOjlL3PZFSi16USXq";

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://crm.sitniks.com/open-api/",
    changeOrigin: true,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  })
);

app.get("/", (req, res) => {
  res.send("BestWishes API");
});

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log("Proxy server is running on http://localhost:4444");
});
