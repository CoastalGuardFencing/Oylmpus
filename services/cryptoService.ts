// A simple service for cryptographic-like operations to support the mythos.
// In a real-world scenario, proper cryptographic libraries should be used.

// Helper to convert a string to an ArrayBuffer for the Web Crypto API
function str2ab(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// Helper to convert an ArrayBuffer to a hex string
function ab2hex(ab: ArrayBuffer): string {
    return Array.prototype.map.call(new Uint8Array(ab), x => ('00' + x.toString(16)).slice(-2)).join('');
}

interface ApiKeyOptions {
  manifest: string;
  glyph: string;
  emotionalState: string;
  expiresIn?: number; // in milliseconds
};

export async function generateApiKey(options: ApiKeyOptions): Promise<string> {
    const { manifest, glyph, emotionalState } = options;
    const rawKey = `${manifest}:${glyph}:${emotionalState}:${Date.now()}`;
    
    try {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', str2ab(rawKey));
        const hash = ab2hex(hashBuffer);
        const apiKey = `${glyph.replace(/\s+/g, '-')}-${hash.slice(0, 24)}`;
        return apiKey;
    } catch(e) {
        console.error("Crypto API failed, falling back to simple hash", e);
        // Fallback for environments where SubtleCrypto might not be available (e.g., insecure contexts)
        let simpleHash = 0;
        for (let i = 0; i < rawKey.length; i++) {
            const char = rawKey.charCodeAt(i);
            simpleHash = ((simpleHash << 5) - simpleHash) + char;
            simpleHash |= 0; // Convert to 32bit integer
        }
        const apiKey = `${glyph.replace(/\s+/g, '-')}-${Math.abs(simpleHash).toString(16).slice(0, 24)}`;
        return apiKey;
    }
}