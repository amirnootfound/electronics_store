# SSL/HTTPS Setup Guide for Production

## Why SSL is Required

- **Security**: Encrypts data between user and server
- **Stripe Requirement**: Stripe requires HTTPS for all payment processing
- **Trust**: Users won't enter payment info on non-secure sites
- **SEO**: Google ranks HTTPS sites higher

## Option 1: Vercel (Recommended for Next.js)

Vercel provides **automatic SSL** for all deployments:

1. Deploy your app to Vercel
2. Vercel automatically:
   - Generates SSL certificate
   - Redirects HTTP to HTTPS
   - Handles certificate renewal
3. Your domain will be: `https://your-project.vercel.app`

**Custom Domain with Vercel:**
1. Add your custom domain in Vercel settings
2. Update DNS records (CNAME or A record)
3. Vercel provisions SSL automatically
4. Enable "Force HTTPS" in domain settings

## Option 2: Netlify

Netlify also provides **automatic SSL**:

1. Deploy to Netlify
2. Add custom domain in Netlify settings
3. Update DNS records
4. Netlify provisions Let's Encrypt SSL automatically
5. SSL auto-renews every 90 days

## Option 3: VPS (DigitalOcean, AWS, etc.)

### Using Certbot (Let's Encrypt)

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

2. Generate SSL Certificate:
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

3. Configure Nginx:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

4. Auto-renewal is configured automatically

### Using Cloudflare (Recommended)

1. Point your domain to Cloudflare
2. Add your server IP to Cloudflare DNS
3. Enable "Always Use HTTPS" in Cloudflare SSL/TLS settings
4. Cloudflare provides free SSL with auto-renewal

## Option 4: Cloudflare SSL (Universal)

Cloudflare works with ANY hosting provider:

1. Create free Cloudflare account
2. Add your domain to Cloudflare
3. Update nameservers to Cloudflare's nameservers
4. Enable "Full (Strict)" SSL mode
5. Enable "Always Use HTTPS"
6. Add your server IP as an A record
7. Cloudflare handles SSL termination

## Testing SSL

After setup, test your SSL:
```bash
curl -I https://yourdomain.com
```

Should return:
```
HTTP/2 200 
strict-transport-security: max-age=31536000
```

## Stripe-Specific Requirements

Stripe requires:
- Valid SSL certificate (not self-signed in production)
- HTTPS on all payment pages
- Valid TLS version (TLS 1.2+)
- Updated cipher suites

All modern SSL providers (Let's Encrypt, Cloudflare, Vercel, Netlify) meet these requirements.

## Next.js Environment Variables

Ensure `NEXT_PUBLIC_URL` is set correctly:
```bash
NEXT_PUBLIC_URL=https://yourdomain.com
```

This ensures:
- Links are generated with HTTPS
- Webhooks work correctly
- No mixed content warnings
