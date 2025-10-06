# Hướng dẫn cấu hình DNS cho GLXD Shop trên Vercel

## 🌐 DNS Configuration Guide cho glxd.shop

Dựa trên [Vercel DNS Documentation](https://vercel.com/docs/domains/managing-dns-records)

## 📋 Các bước cấu hình DNS cho glxd.shop

### 1. Thêm Domain trong Vercel Dashboard

#### Bước 1: Truy cập Vercel Dashboard
1. Đăng nhập vào [Vercel](https://vercel.com)
2. Chọn project của bạn
3. Go to **Settings** tab
4. Chọn **Domains** từ sidebar

#### Bước 2: Add Custom Domain
1. Click **Add** hoặc **Add Domain**
2. Nhập domain: `glxd.shop`
3. Click **Add**

Vercel sẽ tự động:
- Kiểm tra DNS configuration
- Gợi ý DNS records cần thiết
- Cấp phát SSL certificate
- Cấu hình CDN

### 2. Cấu hình DNS Records

#### Option A: Sử dụng Vercel DNS (Khuyến khích)
Nếu bạn mua domain qua Vercel hoặc muốn chuyển DNS management sang Vercel:

1. **Trong Vercel Dashboard**:
   - Settings → Domains → glxd.shop
   - Click **Configure DNS**
   - Chọn **Use Vercel DNS**
   - Vercel sẽ cung cấp nameservers

2. **Cập nhật Nameservers tại Domain Registrar**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

#### Option B: Cấu hình Manual DNS Records
Nếu bạn muốn giữ DNS provider hiện tại:

##### A Record Configuration (Khuyến khích cho root domain)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (hoặc Auto)
```

##### CNAME Record Configuration (Cho www subdomain)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (hoặc Auto)
```

##### CNAME Record Alternative (Nếu A record không hoạt động)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600 (hoặc Auto)
```

### 3. DNS Records Configuration cho các Domain Providers

#### Nếu domain đang ở Namecheap
1. Đăng nhập vào Namecheap
2. Go to **Domain List** → glxd.shop → **Manage**
3. Chọn **Advanced DNS**
4. Add records:

```
Host: @
Type: A
Value: 76.76.21.21
TTL: Auto

Host: www
Type: CNAME
Value: cname.vercel-dns.com
TTL: Auto
```

#### Nếu domain đang ở GoDaddy
1. Đăng nhập vào GoDaddy
2. Go to **My Products** → Domains → glxd.shop
3. Chọn **DNS Management**
4. Add records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 1 Hour

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

#### Nếu domain đang ở Google Domains
1. Đăng nhập vào Google Domains
2. Chọn glxd.shop
3. Go to **DNS**
4. Add records:

```
Host name: @
Type: A
TTL: 3600
Data: 76.76.21.21

Host name: www
Type: CNAME
TTL: 3600
Data: cname.vercel-dns.com
```

### 4. Verify DNS Configuration

#### Check DNS Propagation
Sử dụng các tools sau để kiểm tra:

1. **Vercel Dashboard**:
   - Settings → Domains → glxd.shop
   - Kiểm tra status: "Valid Configuration" ✅

2. **Command Line**:
   ```bash
   # Check A record
   dig glxd.shop A
   
   # Check CNAME record
   dig www.glxd.shop CNAME
   ```

3. **Online Tools**:
   - [DNSChecker.org](https://dnschecker.org)
   - [WhatsMyDNS.net](https://www.whatsmydns.net)

#### Expected Results
```
glxd.shop.     IN    A    76.76.21.21
www.glxd.shop. IN    CNAME cname.vercel-dns.com
```

### 5. SSL Certificate Configuration

Vercel sẽ tự động:
- Generate SSL certificate cho glxd.shop
- Enable HTTPS redirect
- Configure CDN security headers

Kiểm tra SSL:
```bash
curl -I https://glxd.shop
```

Expected headers:
```
HTTP/2 200
server: Vercel
content-type: text/html; charset=utf-8
```

### 6. Troubleshooting Common Issues

#### Issue 1: Domain not resolving
**Symptoms**: `glxd.shop` không truy cập được
**Solutions**:
- Check DNS records configuration
- Wait for DNS propagation (24-48 hours)
- Verify nameserver settings

#### Issue 2: SSL certificate not working
**Symptoms**: HTTPS không hoạt động
**Solutions**:
- Wait for SSL certificate issuance (có thể mất vài phút)
- Check DNS configuration
- Verify domain ownership

#### Issue 3: Mixed content warnings
**Symptoms**: Browser warnings về mixed content
**Solutions**:
- Ensure all resources use HTTPS
- Check hardcoded URLs in code
- Verify environment variables

### 7. Production Deployment Steps

#### Final Checklist trước khi deploy:
```
✅ DNS records configured correctly
✅ Domain verified in Vercel
✅ SSL certificate issued
✅ Environment variables set
✅ Build configuration verified
✅ Custom domain added
```

#### Deploy Commands:
```bash
# Push code to GitHub
git add .
git commit -m "Configure glxd.shop domain"
git push origin main

# Deploy trên Vercel (auto hoặc manual)
# Vercel sẽ auto-deploy khi có push đến main branch
```

### 8. Post-Deployment Verification

#### Test User Access:
```bash
# Test main domain
curl https://glxd.shop

# Test specific pages
curl https://glxd.shop/login
curl https://glxd.shop/register
curl https://glxd.shop/chat
```

#### Test Admin Access:
```bash
# Test admin routes
curl https://glxd.shop/admin
curl https://glxd.shop/admin/login
```

#### Test Functionality:
1. **User Registration**: Tạo tài khoản mới
2. **User Login**: Đăng nhập với tài khoản có sẵn
3. **Chat Functionality**: Gửi/nhận tin nhắn
4. **Admin Access**: Đăng nhập admin dashboard
5. **Real-time Features**: Test Socket.IO connection

### 9. Monitoring và Maintenance

#### Monitor Domain Health:
- **Vercel Analytics**: Monitor performance và errors
- **Uptime Monitoring**: Check domain availability
- **SSL Certificate**: Monitor expiry dates

#### Regular Maintenance:
- Update DNS records nếu cần
- Monitor domain renewal dates
- Backup configuration settings

---

## 🎉 DNS Configuration Complete!

Sau khi hoàn thành các bước trên:

✅ **Domain glxd.shop sẽ trỏ về Vercel**
✅ **SSL certificate sẽ được tự động cấp phát**
✅ **CDN sẽ được kích hoạt**
✅ **HTTPS sẽ được enable**
✅ **GLXD Shop Chat sẽ sẵn sàng hoạt động**

**Final URLs:**
- **User App**: https://glxd.shop
- **Admin Panel**: https://glxd.shop/admin

**Tài khoản demo:**
- Admin: admin@example.com / password123
- Users: user1@example.com / password123

Chúc mừng! GLXD Shop Chat của bạn đã sẵn sàng với custom domain! 🚀✨