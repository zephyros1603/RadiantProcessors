const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors()); // allow frontend to access this API
function cleanHTML(rawHTML) {
    return rawHTML
      // Remove commented-out <script> tags
      .replace(/<!--[\s\S]*?script[\s\S]*?-->/gi, '')
      // Fix common typos in attributes
      .replace(/meta propery=/gi, 'meta property=')
      // Remove broken <scrip tag (as seen in the input)
      .replace(/<scrip[^>]*>/gi, '')
      // Trim excessive newlines and spaces
      .replace(/\r\n/g, '\n')
      .replace(/\n{2,}/g, '\n\n')
      .trim();
  }
app.get('/api/endpoint', async (req, res) => {
  try {
    const response = await axios.get('https://github.com/');
    // res.json(response.data);
    // Cleaning script
    const cleanedHTML = cleanHTML(response.data);
    res.send(cleanedHTML);
    // releases.slice(0, 5).forEach(release => {
    //     const listItem = document.createElement("li");
    //     listItem.innerHTML = `
    //       <strong>${release.name || release.tag_name}</strong> - 
    //       <a href="${release.html_url}" target="_blank">${release.tag_name}</a>
    //       <br><small>Published on: ${new Date(release.published_at).toLocaleDateString()}</small>
    //     `;
    //     releaseList.appendChild(listItem);
    //   });
    }


   catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to fetch GitHub data');
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));