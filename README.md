# Jay Chakra Infra Properties LLP – Website

Live site: https://jahanvepoluru.github.io/jaychakra-website/

## Preview locally
```
python -m http.server 8000
```
Then open http://localhost:8000 (or just double-click `index.html`).

## Update content
- **Projects:** In `projects.js`. Put photos in `images\` and set `image: "images/photo.jpg"`.
- **WhatsApp number:** In `config.js` (country code + number, digits only).
- **Contact details & stats:** In `index.html` (search for `7032121512`, `pcpnaidu7@gmail.com`, and `data-count`).

## Publish changes
```
git add -A
git commit -m "Describe the change"
git push
```
GitHub Pages redeploys automatically in about 1 minute.

## Custom domain
1. Buy the domain (e.g. from GoDaddy, Hostinger or Cloudflare).
2. At the domain provider, add DNS records:
   - `A` record, host `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record, host `www` → `jahanvepoluru.github.io`
3. In GitHub: **repo → Settings → Pages → Custom domain**, enter the domain and save.
4. After DNS is verified, tick **Enforce HTTPS**.
