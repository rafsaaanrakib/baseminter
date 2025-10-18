# 🚀 Quick Deployment Checklist

## Before You Start

- [ ] I have a Hostinger VPS or Cloud hosting account
- [ ] I have SSH access credentials
- [ ] My domain (baseminter.fun) is pointed to Hostinger
- [ ] I have tested the build locally (`npm run build` works)
- [ ] I have all environment variables ready

---

## Step-by-Step Deployment

### 1️⃣ Prepare Files (On Your Computer)

```powershell
# Run the preparation script
.\prepare-deployment.ps1
```

OR manually:
- [ ] Run `npm run build` to test
- [ ] Create `.env.local` with production values
- [ ] Compress your project folder (exclude node_modules and .next)

---

### 2️⃣ Set Up VPS (First Time Only)

Connect to VPS via SSH:
```bash
ssh root@your-vps-ip
```

Install software:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs build-essential

# Install PM2 and Nginx
npm install -g pm2
apt install -y nginx

# Install SSL certificate tool
apt install -y certbot python3-certbot-nginx
```

- [ ] System updated
- [ ] Node.js 20 installed (`node -v` shows v20.x.x)
- [ ] PM2 installed (`pm2 -v` works)
- [ ] Nginx installed (`nginx -v` works)

---

### 3️⃣ Upload Your Files

**Option A: FileZilla (Easiest)**
1. Download FileZilla: https://filezilla-project.org/
2. Connect with SFTP:
   - Host: `sftp://your-vps-ip`
   - Username: `root`
   - Password: your password
   - Port: `22`
3. Upload to: `/var/www/baseminter`

**Option B: Git**
```bash
cd /var/www
git clone https://github.com/yourusername/baseminter.git
```

- [ ] Files uploaded to `/var/www/baseminter`

---

### 4️⃣ Build and Start App

```bash
cd /var/www/baseminter

# Install dependencies
npm install --production

# Create environment file
nano .env.local
# Paste your environment variables, save with Ctrl+X, Y, Enter

# Build
npm run build

# Start with PM2
pm2 start npm --name "baseminter" -- start
pm2 save
pm2 startup
```

- [ ] Dependencies installed
- [ ] `.env.local` created with correct values
- [ ] Build completed successfully
- [ ] App running with PM2 (`pm2 status` shows online)

---

### 5️⃣ Configure Nginx

```bash
nano /etc/nginx/sites-available/baseminter
```

Paste the configuration from `HOSTINGER-DEPLOYMENT-GUIDE.md` (Section "Configure Nginx")

```bash
# Enable site
ln -s /etc/nginx/sites-available/baseminter /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

- [ ] Nginx configuration created
- [ ] Nginx test passed (`nginx -t` shows OK)
- [ ] Nginx restarted

---

### 6️⃣ Set Up SSL (HTTPS)

```bash
certbot --nginx -d baseminter.fun -d www.baseminter.fun
```

Follow prompts:
- Enter your email
- Agree to terms
- Choose option 2 (redirect HTTP to HTTPS)

- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS

---

### 7️⃣ Configure Firewall

```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

- [ ] Firewall configured
- [ ] SSH and web ports open

---

### 8️⃣ Test Everything

Visit your website: https://baseminter.fun

Test:
- [ ] Website loads
- [ ] Wallet connects
- [ ] Can deploy a token
- [ ] Token appears in "Recently Deployed Tokens"
- [ ] Profile page works
- [ ] All links functional

---

## Monitoring Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs baseminter

# Monitor resources
pm2 monit

# Restart app
pm2 restart baseminter

# Check Nginx
systemctl status nginx
```

---

## Quick Fix Commands

### App not responding:
```bash
pm2 restart baseminter
pm2 logs baseminter --lines 50
```

### Nginx issues:
```bash
nginx -t
systemctl restart nginx
tail -f /var/log/nginx/error.log
```

### Update app:
```bash
cd /var/www/baseminter
git pull  # If using Git
npm install
npm run build
pm2 restart baseminter
```

---

## 🆘 Getting Help

1. Check logs: `pm2 logs baseminter`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Hostinger support: https://www.hostinger.com/
4. Review `HOSTINGER-DEPLOYMENT-GUIDE.md` for detailed troubleshooting

---

## 🎉 You're Live!

Once all checkboxes are checked, your website is live and ready for users!

**Post-Launch:**
- [ ] Set up backups (see deployment guide)
- [ ] Monitor performance
- [ ] Set up error tracking (optional)
- [ ] Share your launch! 🚀

---

## Environment Variables Reminder

Make sure your `.env.local` on the server has:

```env
BASE_RPC=https://mainnet.base.org
FACTORY_ADDRESS=0x2c080712805487413E181Ac5A23c5fBa8Bd67631
NEXT_PUBLIC_WALLET_CONNECT_ID=0x91E8DDA2FCF07deDdc33e26dF415337FE6456cD1
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## Estimated Time

- First-time setup: **45-60 minutes**
- Subsequent updates: **5-10 minutes**

Good luck! 🍀
