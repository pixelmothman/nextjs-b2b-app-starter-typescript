export async function buffer(readableStream){
    const chunks = [];
    for await (const chunk of readableStream){
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);

}