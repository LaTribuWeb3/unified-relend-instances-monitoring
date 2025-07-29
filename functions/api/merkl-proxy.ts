export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const chainId = url.searchParams.get('chainId');

  if (!chainId) {
    return new Response('Missing chainId parameter', { status: 400 });
  }

  try {
    // Make the request to Merkl API from the server side
    const merklResponse = await fetch(`https://api.merkl.xyz/v4/opportunities?chainId=${chainId}`, {
      headers: {
        'User-Agent': 'relend-monitoring/1.0.0',
        'Accept': 'application/json',
      },
    });

    if (!merklResponse.ok) {
      throw new Error(`Merkl API responded with status: ${merklResponse.status}`);
    }

    const data = await merklResponse.json();

    // Return the data with CORS headers (return just the array of opportunities)
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching from Merkl API:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch opportunities' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 