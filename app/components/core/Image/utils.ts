/**
 * @Project Summarised
 * @File LazyModalRenderer.tsx
 * @Path app/components/core/Image
 * @Author BRICE ZELE
 * @Date 21/03/2023
 */
export const uriToHttp = (uri: string): string[] => {
    if (!uri) return []

    const protocol = uri.split(':')[0]?.toLowerCase()
    if (protocol === 'https') {
        return [uri]
    }
    if (protocol === 'http') {
        return ['https' + uri.slice(4), uri]
    }
    if (protocol === 'ipfs') {
        const hash = uri.match(/^ipfs:(\/\/)?(ipfs\/)?(.*)$/i)?.[3]
        return [`https://cloudflare-ipfs.com/ipfs/${hash}`, `https://ipfs.io/ipfs/${hash}`]
    }
    if (protocol === 'ipns') {
        const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
        return [`https://cloudflare-ipfs.com/ipns/${name}`, `https://ipfs.io/ipns/${name}`]
    }

    return []
}
