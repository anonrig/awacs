# Security

We take security seriously in Awacs. We believe that security & privacy is a human right, and should be done properly.

## Practices

### Authorization

Every active application in Awacs has a unique authorization token to tell the server where the information belongs to. This token is sent using the `x-socketkit-key` HTTP header. It's **recommended** to have an SSL certificate in between the client and server to make it harder for an attacker to read the application authorization token.

### Signature

It's required that every request sent to Awacs public API should be signed with ed25519 on the client side. This digital signature algorithm enables us that the information did not get manipulated in the transit between client and server. Signed payload is sent through the `x-signature` HTTP header.

## Encryption

### In-transit encryption

It's recommended to use SSL encryption while sending requests to Awacs public API. Due to the configuration, it's developer's responsability to put an SSL certificate in front of their load balancer.

If you don't have a valid SSL certificate or don't have to budget for it, please use a Let's Encrypt certificate. Remember that if you go with this option, it would be impossible to have a SSL pinning on your communication.

### Storage

It is important that your PostgreSQL database is properly configured and only accepts SSL connections.

## External Solutions

### Cloudflare

In order to reduce latency and improve performance as well as understanding the origin of the request, it's recommended to use Cloudflare as your CDN, which provides `cf-ipcountry` header to understand where your customers are coming from.
