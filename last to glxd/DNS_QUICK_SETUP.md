# ⚡ DNS Quick Setup for glxd.shop

## 🚀 Cấu hình DNS nhanh cho glxd.shop trên Vercel

### Option 1: Dùng Vercel DNS (Khuyến khích - dễ nhất)

#### Bước 1: Add domain trong Vercel
1. Vercel Dashboard → Settings → Domains
2. Add domain: `glxd.shop`
3. Click "Configure DNS"
4. Chọn "Use Vercel DNS"

#### Bước 2: Cập nhật Nameservers
Tại domain registrar (nơi mua domain), cập nhật nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### Bước 3: Done!
- Vercel sẽ tự động cấu hình mọi thứ
- SSL certificate sẽ được tự động tạo
- CDN sẽ được kích hoạt

---

### Option 2: Manual DNS Configuration

#### A Record (Root domain)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

#### CNAME Record (WWW subdomain)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

### ⏱ Thời gian chờ
- **DNS Propagation**: 24-48 hours (thường nhanh hơn)
- **SSL Certificate**: 5-15 phút sau khi DNS hoạt động
- **CDN Activation**: Tức thì sau khi DNS hoạt động

---

### ✅ Verification

#### Check DNS:
```bash
dig glxd.shop A
dig www.glxd.shop CNAME
```

#### Check SSL:
```bash
curl -I https://glxd.shop
```

#### Expected Result:
```
HTTP/2 200
server: Vercel
```

---

### 🎯 Final URLs sau khi setup

**User Access:**
- Main: https://glxd.shop
- Login: https://glxd.shop/login
- Register: https://glxd.shop/register
- Chat: https://glxd.shop/chat

**Admin Access:**
- Admin: https://glxd.shop/admin
- Admin Login: https://glxd.shop/admin/login

---

### 📱 Demo Accounts

**Admin:**
- Email: admin@example.com
- Password: password123

**Users:**
- Email: user1@example.com → user4@example.com
- Password: password123

---

### 🔧 Troubleshooting

**Domain không hoạt động?**
- Check DNS records
- Wait for propagation
- Verify nameservers

**SSL không hoạt động?**
- Wait 15-30 phút
- Check DNS configuration
- Verify domain ownership

**Mixed content warnings?**
- All URLs should use HTTPS
- Check environment variables

---

## 🎉 Setup Complete!

Sau khi setup xong:
- ✅ Domain glxd.shop hoạt động
- ✅ SSL certificate enabled
- ✅ CDN activated
- ✅ HTTPS working
- ✅ GLXD Shop Chat sẵn sàng!

**Test ngay:**
- User: https://glxd.shop
- Admin: https://glxd.shop/admin

Chúc mừng! 🚀✨