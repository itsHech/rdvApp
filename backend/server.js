const app = require("./app"); // Import your main app (your app.js)
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
