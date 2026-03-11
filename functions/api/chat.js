export async function onRequestPost(context) {
    const { request, env } = context;

    const HF_URL = env.HF_ENDPOINT_URL;
    const HF_TOKEN = env.HF_API_TOKEN;

    try {
        const requestBody = await request.json();

        const hfResponse = await fetch(HF_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await hfResponse.json();

        return new Response(JSON.stringify(data), {
            status: hfResponse.status,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server Error connecting to AI" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}