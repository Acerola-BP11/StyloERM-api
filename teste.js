import * as jwt from 'jose'
import crypto from 'crypto'

async function main() {
    const key = await jwt.generateSecret('HS256')
    const alg = 'HS256'

    const token = await new jwt.EncryptJWT({ 'urn:example:claim': true })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')

    const decodedToken = await jwt.jwtDecrypt(token)
    console.log(decodedToken)
}

main()