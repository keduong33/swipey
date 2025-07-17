export function getAccessToken(headers: Headers) {
    const authHeader = headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Missing or malformed Authorization header');
    }

    return authHeader.split(' ')[1];
}
