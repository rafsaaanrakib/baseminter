# Hostinger Deployment Guide for BaseMinter.fun

## Overview
This guide will help you deploy your Next.js application to Hostinger using their VPS or Cloud hosting.

---

## Prerequisites

Before deploying, make sure you have:
- ✅ Hostinger VPS or Cloud Hosting plan
- ✅ Domain name (baseminter.fun) pointed to Hostinger
- ✅ SSH access to your server
- ✅ All environment variables ready

---

## Option 1: Deploy with Hostinger VPS (Recommended)

### Step 1: Prepare Your Local Project

1. **Build your project locally to test**
   ```bash
   npm run build
   ```

2. **Create a production environment file**
   - Copy `.env.production` to `.env.local`
   - Update with your production values:
     ```env
     BASE_RPC=https://mainnet.base.org
     FACTORY_ADDRESS=0x2c080712805487413E181Ac5A23c5fBa8Bd67631
     NEXT_PUBLIC_WALLET_CONNECT_ID=0x91E8DDA2FCF07deDdc33e26dF415337FE6456cD1
     NODE_ENV=production
     NEXT_TELEMETRY_DISABLED=1
     ```

### Step 2: Connect to Your Hostinger VPS

1. **Get your VPS credentials from Hostinger panel**
   - IP Address
   - Root password or SSH key

2. **Connect via SSH** (use PuTTY on Windows or Terminal on Mac/Linux)
   ```bash
   ssh root@your-vps-ip-address
   ```

### Step 3: Install Required Software on VPS

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (v20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install npm and build tools
apt install -y build-essential

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx

# Install Git
apt install -y git
```

### Step 4: Set Up Your Application

```bash
# Create app directory
mkdir -p /var/www/baseminter
cd /var/www/baseminter

# Option A: Upload files via SFTP (recommended)
# Use FileZilla or WinSCP to upload your entire project folder
# Skip to Step 5 after uploading

# Option B: Clone from Git (if you have a repository)
# git clone https://github.com/yourusername/baseapp.git .
```

### Step 5: Install Dependencies and Build

```bash
# Navigate to your project
cd /var/www/baseminter

# Install dependencies
npm install --production

# Create .env.local file with production variables
nano .env.local
# Paste your environment variables, then save (Ctrl+X, Y, Enter)

# Build the application
npm run build
```

### Step 6: Configure PM2 to Run Your App

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

**Paste this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'baseminter',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/baseminter',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

**Start the app with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 7: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/baseminter
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name baseminter.fun www.baseminter.fun;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

**Enable the site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/baseminter /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 8: Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d baseminter.fun -d www.baseminter.fun

# Follow the prompts and enter your email
# Choose option 2 to redirect HTTP to HTTPS
```

### Step 9: Set Up Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

---

## Option 2: Deploy with Hostinger Cloud Hosting

If you have Hostinger's Cloud hosting (not VPS), follow these steps:

### Method A: Using Hostinger's Node.js Hosting

1. **Access Hostinger Control Panel (hPanel)**
2. **Go to "Advanced" → "Node.js"**
3. **Create New Application:**
   - Node.js version: 20.x
   - Application mode: Production
   - Application root: public_html/baseminter
   - Application URL: baseminter.fun

4. **Upload your files via FTP:**
   - Use FileZilla with SFTP credentials from hPanel
   - Upload entire project folder

5. **Set up via SSH (if available):**
   ```bash
   cd public_html/baseminter
   npm install --production
   npm run build
   ```

6. **Configure in hPanel:**
   - Set environment variables in Node.js settings
   - Set startup command: `npm start`
   - Restart application

---

## Upload Methods

### Method 1: FileZilla (Recommended for large projects)

1. **Download FileZilla Client**
2. **Connect with SFTP:**
   - Host: Your VPS IP or sftp.hostinger.com
   - Username: root (VPS) or your hosting username
   - Password: Your password
   - Port: 22

3. **Upload files:**
   - Navigate to `/var/www/baseminter` (VPS) or `public_html` (Cloud)
   - Upload your entire project folder
   - Exclude `node_modules` and `.next` folders (will rebuild on server)

### Method 2: Git Repository (Best Practice)

1. **Push your code to GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/baseminter.git
   git push -u origin main
   ```

2. **Clone on server:**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/baseminter.git
   cd baseminter
   ```

---

## Post-Deployment Checklist

### ✅ Verify Everything Works

1. **Test the website:**
   ```
   https://baseminter.fun
   ```

2. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 logs baseminter
   ```

3. **Test functionality:**
   - Connect wallet
   - Deploy a test token
   - Check if tokens appear in "Recently Deployed"
   - Test profile page
   - Verify analytics tracking

### ✅ Monitor Your App

```bash
# View real-time logs
pm2 logs baseminter

# Monitor CPU/Memory
pm2 monit

# Restart if needed
pm2 restart baseminter
```

### ✅ Set Up Auto-Updates (Optional)

Create a deployment script:
```bash
nano /var/www/baseminter/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/baseminter
git pull origin main
npm install --production
npm run build
pm2 restart baseminter
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x /var/www/baseminter/deploy.sh
```

---

## Troubleshooting

### Issue: Site not loading

**Solution:**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs baseminter --lines 50

# Restart app
pm2 restart baseminter

# Check Nginx
systemctl status nginx
nginx -t
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Restart PM2
pm2 restart baseminter
```

### Issue: Build fails

**Solution:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules

# Reinstall
npm install
npm run build
```

### Issue: Environment variables not working

**Solution:**
```bash
# Check .env.local exists
ls -la /var/www/baseminter/.env.local

# View contents (be careful not to expose secrets)
cat .env.local

# Restart PM2 to reload env vars
pm2 restart baseminter
```

---

## Performance Optimization on Server

### Enable HTTP/2
```bash
nano /etc/nginx/sites-available/baseminter
```

Add `http2` after `listen 443 ssl`:
```nginx
listen 443 ssl http2;
```

### Set Up Caching
Already configured in the Nginx config above!

### Monitor Resources
```bash
# Check CPU and RAM
htop

# Check disk space
df -h

# Check network
iftop
```

---

## Backup Strategy

### Automated Backups

```bash
# Create backup script
nano /root/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/baseminter_$DATE.tar.gz /var/www/baseminter

# Keep only last 7 backups
ls -t $BACKUP_DIR/baseminter_*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: baseminter_$DATE.tar.gz"
```

```bash
chmod +x /root/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

---

## Security Best Practices

1. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Change SSH port (optional but recommended):**
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to something else like 2222
   systemctl restart sshd
   ```

3. **Disable root login:**
   ```bash
   nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   # Create a non-root user first!
   ```

4. **Install fail2ban:**
   ```bash
   apt install fail2ban -y
   systemctl enable fail2ban
   ```

---

## Cost Estimation

### Hostinger VPS Pricing (as of 2025):
- **KVM 1**: $4.99/month (2 CPU, 4GB RAM) - Recommended
- **KVM 2**: $8.99/month (4 CPU, 8GB RAM) - For high traffic
- **Domain**: Free with annual plans or ~$12.99/year

### Total Monthly Cost: ~$5-9/month

---

## Support & Help

### Hostinger Support:
- 24/7 Live Chat: https://www.hostinger.com/
- Help Center: https://support.hostinger.com/

### If You Get Stuck:
1. Check PM2 logs: `pm2 logs baseminter`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Contact Hostinger support with specific error messages

---

## Quick Commands Reference

```bash
# Application Management
pm2 status                    # Check app status
pm2 restart baseminter       # Restart app
pm2 logs baseminter          # View logs
pm2 monit                    # Monitor resources

# Nginx Management
systemctl status nginx        # Check Nginx status
systemctl restart nginx       # Restart Nginx
nginx -t                     # Test config
tail -f /var/log/nginx/error.log  # View errors

# System Management
htop                         # Monitor CPU/RAM
df -h                        # Check disk space
free -h                      # Check memory

# SSL Certificate
certbot renew --dry-run      # Test renewal
certbot certificates         # View certificates
```

---

## 🚀 You're Ready to Deploy!

Follow the steps above carefully, and your website will be live on Hostinger. The entire process takes about 30-60 minutes depending on your familiarity with Linux.

**Recommended Order:**
1. Set up VPS (Step 2-3)
2. Upload files via FileZilla (Step 4)
3. Build and start app (Step 5-6)
4. Configure Nginx (Step 7)
5. Get SSL certificate (Step 8)
6. Test everything (Post-deployment checklist)

Good luck! 🎉
