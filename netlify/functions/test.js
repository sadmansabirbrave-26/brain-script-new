exports.handler = async (event, context) => {
  console.log('Test function called');
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      message: "Netlify functions are working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  };
};
