async function readStream2u8Array(stream: ReadableStream<Uint8Array>): Promise<ArrayBuffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    try {
        while (true) {
            // 读取下一块数据
            const { done, value } = await reader.read();

            // 如果 done 为 true，说明流已结束
            if (done) {
                break;
            }

            // value 就是当前的 Uint8Array chunk
            if (value) {
                chunks.push(value);
            }
        }
    } finally {
        // 确保释放锁
        reader.releaseLock();
    }

    // 使用上面同样的逻辑合并数据
    return mergeChunks(chunks); 
}

function mergeChunks(chunks: Uint8Array[]): ArrayBuffer {
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result.buffer;
}

export default readStream2u8Array;