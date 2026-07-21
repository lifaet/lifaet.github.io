export async function onRequest({ request, env }) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const cv = params.get('token');

    if (cv && cv.length === 20 && isValidRandomNumber(cv, env.RANDOM_NUMBER)) {
        const html = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>Curriculum Vitae</title>
                <style>
                    html, body { margin: 0; padding: 0; height: 100%; font-family: sans-serif; }
                    .toolbar {
                        display: flex;
                        gap: 10px;
                        padding: 10px;
                        background: #f2f2f2;
                        border-bottom: 1px solid #ddd;
                    }
                    .toolbar button {
                        padding: 8px 16px;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                        background: #fff;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .toolbar button.active {
                        background: #333;
                        color: #fff;
                        border-color: #333;
                    }
                    .iframe-container {
                        position: relative;
                        overflow: hidden;
                        width: 100%;
                        height: calc(100vh - 53px);
                    }
                    .responsive-iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <div class="toolbar">
                    <button id="btn-cv" class="active" onclick="showDoc('cv')">CV</button>
                    <button id="btn-europass" onclick="showDoc('europass')">Europass CV</button>
                </div>
                <div class="iframe-container">
                    <iframe id="viewer" src="${env.DRIVE_URL}" seamless class="responsive-iframe"></iframe>
                </div>
                <script>
                    const sources = {
                        cv: ${JSON.stringify(env.DRIVE_URL)},
                        europass: ${JSON.stringify(env.DRIVE_URL_EUROPASS)}
                    };
                    function showDoc(which) {
                        document.getElementById('viewer').src = sources[which];
                        document.getElementById('btn-cv').classList.toggle('active', which === 'cv');
                        document.getElementById('btn-europass').classList.toggle('active', which === 'europass');
                    }
                </script>
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