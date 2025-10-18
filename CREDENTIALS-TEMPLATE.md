# 🔐 Deployment Credentials & Information

**IMPORTANT: Keep this file secure and never commit it to Git!**

---

## Hostinger VPS Details

**VPS IP Address:**
```
___.___.___.___ (e.g., 123.45.67.89)
```

**SSH Username:**
```
root (or your custom username)
```

**SSH Password:**
```
__________________
```

**SSH Port:**
```
22 (default, or custom port if changed)
```

---

## Domain Information

**Domain Name:**
```
baseminter.fun
```

**DNS Settings (Set these in Hostinger domain panel):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | [Your VPS IP] | 14400 |
| A | www | [Your VPS IP] | 14400 |

**DNS Propagation Check:**
- https://dnschecker.org/

---

## Environment Variables (Production)

**File location on server:** `/var/www/baseminter/.env.local`

```env
# Base Network RPC
BASE_RPC=https://mainnet.base.org

# Factory Contract Address
FACTORY_ADDRESS=0x2c080712805487413E181Ac5A23c5fBa8Bd67631

# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_ID=0x91E8DDA2FCF07deDdc33e26dF415337FE6456cD1

# Node Environment
NODE_ENV=production

# Telemetry
NEXT_TELEMETRY_DISABLED=1

# Private Key (if needed for scripts - NEVER expose publicly)
# PRIVATE_KEY=your_private_key_here

# Basescan API Key (if needed)
# BASESCAN_API_KEY=your_api_key_here
```

---

## Application URLs

**Production URL:**
```
https://baseminter.fun
https://www.baseminter.fun
```

**Backend URL (if separate):**
```
N/A (Next.js handles backend)
```

**Admin Panel (if any):**
```
N/A
```

---

## SSL Certificate

**Provider:** Let's Encrypt (via Certbot)

**Renewal:** Automatic (every 90 days)

**Check renewal:**
```bash
certbot certificates
certbot renew --dry-run
```

---

## Database Information

**Type:** None (using localStorage and blockchain)

**Blockchain Network:**
- Network: Base Mainnet
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

---

## Smart Contract Information

**Factory Contract:**
- Address: `0x2c080712805487413E181Ac5A23c5fBa8Bd67631`
- Network: Base Mainnet
- Deployment Fee: 0.0003 ETH
- Basescan: https://basescan.org/address/0x2c080712805487413E181Ac5A23c5fBa8Bd67631

---

## Server Access Methods

### Method 1: SSH (Terminal/PuTTY)
```bash
ssh root@[YOUR_VPS_IP]
# Enter password when prompted
```

### Method 2: FileZilla (SFTP)
- Protocol: SFTP
- Host: [YOUR_VPS_IP]
- Username: root
- Password: [YOUR_PASSWORD]
- Port: 22

### Method 3: Hostinger hPanel
- URL: https://hpanel.hostinger.com/
- Email: [YOUR_EMAIL]
- Password: [YOUR_PASSWORD]

---

## Important Server Paths

**Application Root:**
```
/var/www/baseminter
```

**Nginx Configuration:**
```
/etc/nginx/sites-available/baseminter
/etc/nginx/sites-enabled/baseminter
```

**SSL Certificates:**
```
/etc/letsencrypt/live/baseminter.fun/
```

**Logs:**
```
PM2 Logs: pm2 logs baseminter
Nginx Access: /var/log/nginx/access.log
Nginx Error: /var/log/nginx/error.log
```

---

## Backup Information

**Backup Script Location:**
```
/root/backup.sh
```

**Backup Storage:**
```
/root/backups/
```

**Backup Schedule:**
```
Daily at 2:00 AM (via crontab)
```

**Manual Backup Command:**
```bash
tar -czf ~/backup_$(date +%Y%m%d).tar.gz /var/www/baseminter
```

---

## Support Contacts

**Hostinger Support:**
- Live Chat: https://www.hostinger.com/
- Email: support@hostinger.com
- Phone: Check your Hostinger account for regional numbers

**Technical Support:**
- Developer: [YOUR NAME/CONTACT]
- Email: [YOUR EMAIL]

---

## Security Checklist

- [ ] Changed default SSH port (optional but recommended)
- [ ] Disabled root login (after creating non-root user)
- [ ] Enabled firewall (ufw)
- [ ] Installed fail2ban
- [ ] SSL certificate installed and auto-renewing
- [ ] Strong passwords used
- [ ] .env.local file secured (not readable by public)
- [ ] Regular backups configured

---

## Quick Reference Commands

**Restart Application:**
```bash
pm2 restart baseminter
```

**Update Application:**
```bash
cd /var/www/baseminter
git pull  # if using Git
npm install
npm run build
pm2 restart baseminter
```

**Check Status:**
```bash
pm2 status
pm2 logs baseminter
systemctl status nginx
```

**Renew SSL:**
```bash
certbot renew
```

---

## Emergency Contacts

**If Site Goes Down:**
1. Check PM2: `pm2 status`
2. Check Nginx: `systemctl status nginx`
3. View logs: `pm2 logs baseminter --lines 50`
4. Contact Hostinger support if server issue

**Rollback Procedure:**
```bash
cd /var/www/baseminter
git reset --hard HEAD~1  # Go back one commit
npm install
npm run build
pm2 restart baseminter
```

---

## Monthly Costs

**Hostinger VPS:**
```
$4.99 - $8.99/month (depending on plan)
```

**Domain:**
```
Included with hosting or ~$12.99/year
```

**SSL Certificate:**
```
Free (Let's Encrypt)
```

**Total Monthly:**
```
~$5-9/month
```

---

## Notes

**Date Deployed:**
```
____________________
```

**Deployed By:**
```
____________________
```

**Current Version:**
```
1.0.0
```

**Additional Notes:**
```
____________________
____________________
____________________
```

---

## ⚠️ SECURITY WARNING

**NEVER SHARE THIS FILE PUBLICLY!**

- Do NOT commit this file to Git
- Do NOT share in Discord/Telegram/X
- Keep a secure backup (password-protected)
- Only share with trusted team members via secure methods

---

## Fill This Out After Deployment

Once deployed, fill in all the blanks above and keep this file in a secure location (encrypted USB drive, password manager, etc.).
