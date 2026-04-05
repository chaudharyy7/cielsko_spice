# 🌶️ Cielsko — Premium Indian Spice Exporter Website

A full-stack dynamic website for **Cielsko**, a trusted exporter of premium-quality Indian spices.

---

## 🛠️ Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | HTML, CSS (Custom), JS |
| Templating | EJS (Embedded JS)      |
| Backend    | Node.js + Express.js   |
| Database   | MongoDB + Mongoose     |

---

## 📁 Project Structure

```
cielsko/
├── config/
│   └── db.js                  # MongoDB connection
├── models/
│   ├── Product.js             # Product schema
│   ├── Blog.js                # Blog post schema
│   ├── Certificate.js         # Certificate schema
│   ├── Testimonial.js         # Testimonial schema
│   ├── TeamMember.js          # Team member schema
│   ├── Contact.js             # Contact form submission schema
│   └── SiteSettings.js        # Dynamic site settings
├── routes/
│   ├── pages.js               # Page rendering routes
│   └── api/
│       ├── products.js        # Products CRUD API
│       ├── blogs.js           # Blogs CRUD API
│       ├── certificates.js    # Certificates CRUD API
│       ├── testimonials.js    # Testimonials CRUD API
│       ├── team.js            # Team CRUD API
│       └── contact.js         # Contact form API
├── views/
│   ├── partials/
│   │   ├── header.ejs         # Shared header + nav
│   │   └── footer.ejs         # Shared footer
│   └── pages/
│       ├── home.ejs           # Home page
│       ├── about.ejs          # About Us page
│       ├── products.ejs       # Products listing page
│       ├── product-detail.ejs # Single product page
│       ├── certificates.ejs   # Certificates page
│       ├── blog.ejs           # Blog listing page
│       ├── blog-detail.ejs    # Single blog post page
│       ├── contact.ejs        # Contact Us page
│       ├── privacy.ejs        # Privacy Policy
│       ├── terms.ejs          # Terms & Conditions
│       ├── disclaimer.ejs     # Disclaimer
│       ├── cookie.ejs         # Cookie Policy
│       ├── 404.ejs            # 404 Not Found
│       └── error.ejs          # 500 Server Error
├── public/
│   ├── css/
│   │   └── main.css           # Full design system
│   ├── js/
│   │   └── main.js            # Slider, mobile nav, scroll effects
│   └── images/
│       ├── favicon.svg
│       ├── placeholder-*.svg  # Fallback images
│       ├── products/          # Product images (add yours here)
│       ├── blog/              # Blog images
│       ├── certificates/      # Certificate images
│       └── team/              # Team member photos
├── seed/
│   └── seed.js                # Database seeder
├── .env                       # Environment variables (never commit)
├── .gitignore
├── package.json
└── server.js                  # Main Express app entry point
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Edit `.env` with your settings:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cielsko
NODE_ENV=development
```

### 4. Seed the Database
```bash
npm run seed
```

### 5. Start the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### 6. Open in Browser
```
http://localhost:3000
```

---

## 📄 Pages

| URL                  | Page                    |
|----------------------|-------------------------|
| `/`                  | Home                    |
| `/about`             | About Us                |
| `/products`          | Product Listing         |
| `/products/:slug`    | Single Product          |
| `/certificates`      | Certifications          |
| `/blog`              | Blog Listing            |
| `/blog/:slug`        | Single Blog Post        |
| `/contact`           | Contact Us              |
| `/privacy-policy`    | Privacy Policy          |
| `/terms-conditions`  | Terms & Conditions      |
| `/disclaimer`        | Disclaimer              |
| `/cookie-policy`     | Cookie Policy           |

---

## 🔌 REST API Endpoints

All data is managed via REST APIs — making the site fully dynamic and editable.

### Products
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/products`       | Get all products     |
| GET    | `/api/products/:slug` | Get product by slug  |
| POST   | `/api/products`       | Create product       |
| PUT    | `/api/products/:id`   | Update product       |
| DELETE | `/api/products/:id`   | Soft-delete product  |

### Blogs
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | `/api/blogs`       | Get all blogs     |
| GET    | `/api/blogs/:slug` | Get blog by slug  |
| POST   | `/api/blogs`       | Create blog post  |
| PUT    | `/api/blogs/:id`   | Update blog post  |
| DELETE | `/api/blogs/:id`   | Unpublish post    |

### Certificates, Testimonials, Team
Same CRUD pattern as above at:
- `/api/certificates`
- `/api/testimonials`
- `/api/team`

### Contact
| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| POST   | `/api/contact` | Submit contact form      |
| GET    | `/api/contact` | Get all submissions      |

---

## 🖼️ Adding Images

Place images in `public/images/` subdirectories:

```
public/images/products/red-chilli.jpg
public/images/products/whole-turmeric.jpg
public/images/blog/red-chilli-export.jpg
public/images/certificates/gst-certificate.jpg
public/images/team/rohit-prajapati.jpg
```

Then update the `image` field in MongoDB via the API or re-seed.

---

## ✏️ How to Edit Website Content

Since the site is fully dynamic, all content is stored in MongoDB:

### Via API (Recommended for integrations)
```bash
# Update a product
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"shortDescription": "New description here"}'
```

### Via MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `cielsko` → choose collection
4. Edit documents directly

### Via Re-seeding
Edit `seed/seed.js` with new data, then run:
```bash
npm run seed
```
> ⚠️ This will wipe and re-insert all data.

---

## 🎨 Design System

The CSS uses CSS variables for easy theming. Edit colors in `public/css/main.css`:

```css
:root {
  --saffron:   #E8601C;   /* Primary brand color */
  --gold:      #C9961A;   /* Accent color */
  --cream:     #FDF6E3;   /* Background warm */
  --brown-dk:  #2C1810;   /* Dark sections */
}
```

---

## 📦 Deployment

### On VPS (Ubuntu)
```bash
npm install -g pm2
pm2 start server.js --name cielsko
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    server_name cielsko.com www.cielsko.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📞 Support

**Cielsko**
- 📧 info@cielsko.com
- 📞 +91-7053086259
- 📍 P50, P Block, Mohan Garden, New Delhi – 110059, India

---

*Built with ❤️ for Cielsko — Premium Indian Spice Exports*
# cielsko
# cielsko
# cielsko_spice
# cielsko_spice
# cielsko_spice
