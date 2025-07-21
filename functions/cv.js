export async function onRequest({ request, env }) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const cv = params.get('token');

    if (cv && cv.length === 20 && isValidRandomNumber(cv, env.RANDOM_NUMBER)) {
        const html = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>Curriculum Vitae (CV)</title>
                <style>
                    .iframe-container { position: relative; overflow: hidden; width: 100%; height: 100vh; }
                    .responsive-iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100vh; border: none; }
                    html, body { margin: 0; padding: 0; }
                </style>
            </head>
            <body>
                <div class="iframe-container">
                    <iframe src="${env.DRIVE_URL}" seamless class="responsive-iframe"></iframe>
                </div>
            </body>
        </html>`;
        return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Redirect to same origin with query param
    const redirectUrl = `https://lifaet.github.io/#cv?res=wrong-key`;
    return Response.redirect(redirectUrl, 302);
}

function isValidRandomNumber(randomNumber, allowedChars) {
    return [...randomNumber].every(char => allowedChars.includes(char));
}
