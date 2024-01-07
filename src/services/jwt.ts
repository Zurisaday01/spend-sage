// utils/authUtils.js
import jwt, { JwtPayload } from 'jsonwebtoken';

export const isTokenExpired = (token: string | null) => {
	if (!token) {
		// Token is missing, consider it expired
		return true;
	}

	try {
		const decodedToken: null | JwtPayload = jwt.decode(token, {
			complete: true,
		});

		if (!decodedToken || typeof decodedToken.payload.exp !== 'number') {
			// Decoding failed or 'exp' field is missing, consider it expired
			return true;
		}

		// Compare the expiration time with the current time
		return decodedToken.payload.exp < Date.now() / 1000;
	} catch (error) {
		// Decoding failed, consider it expired
		return true;
	}
};
