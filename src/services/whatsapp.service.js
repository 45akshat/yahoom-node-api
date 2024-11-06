const axios = require('axios');

const sendTemplateMessage = async (whatsappNumber, templateName, broadcastName, parameters) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmI0MGY0YS1hOTNhLTQ0NzYtYThkNC1lYmIzN2QzMDg0MjIiLCJ1bmlxdWVfbmFtZSI6ImluZm9AeWFob29tLmluIiwibmFtZWlkIjoiaW5mb0B5YWhvb20uaW4iLCJlbWFpbCI6ImluZm9AeWFob29tLmluIiwiYXV0aF90aW1lIjoiMDkvMTQvMjAyNCAxNTowMzo1OCIsInRlbmFudF9pZCI6IjM0NjU5NyIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.NHw0Oodc3Boe2GdyRJhAGFDejw40ZexOjeaRA9gGtV4';

  const url = `https://live-mt-server.wati.io/346597/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`;

  const data = {
    template_name: templateName,
    broadcast_name: broadcastName,
    parameters: parameters
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
        'accept': '*/*'
      }
    });
    //console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Export the function
module.exports = { sendTemplateMessage };
