import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express().use(express.json());

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://crm.sitniks.com/open-api/",
    changeOrigin: true,
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  })
);

app.get("/", (req, res) => {
  res.send("BestWishes API");
});

app.listen(process.env.PORT || 4444, (err) => {
  if (err) return console.log(err);
  console.log("Proxy server is running on http://localhost:4444");
});
