# 🏠 Dream Home Creation App - API Documentation

## Overview
Professional comprehensive application for designing and building luxury homes. Complete with 3D previews, material selection, cost calculations, and multi-language support.

**Price Range: Up to $10,000 USD per home project**

---

## 🎯 Core Features

### 1. **Project Management**
- Create, update, and delete home projects
- Support for multiple property types:
  - Villa
  - Apartment
  - Townhouse
  - Mansion
  - Duplex
- Track project status (Draft, In Progress, Completed, Archived)
- Monitor total area, number of floors, rooms, and bathrooms

### 2. **Design Studio**
- **10 Design Styles**:
  - Modern
  - Classic
  - Contemporary
  - Minimalist
  - Traditional
  - Industrial
  - Rustic
  - Mediterranean
  - Scandinavian
  - Bohemian

- **Customizable Elements**:
  - Color palettes (10+ colors)
  - Material selection for exterior, roofing, flooring, walls, doors, windows
  - Feature additions
  - 2D and 3D previews

### 3. **Materials Library**
- 11+ premium materials with pricing
- Categories: Exterior, Roofing, Flooring, Walls
- Eco-friendly options
- Durability ratings
- Supplier information
- Budget-based filtering

### 4. **Advanced Pricing**
- Real-time cost calculation
- Payment plans:
  - Immediate full payment (2% discount)
  - 4-installment plan
  - 12-month installment plan
- Add-ons:
  - Smart home systems ($50,000)
  - Solar panels ($35,000)
  - Swimming pool ($75,000)
  - Landscaping ($25,000)
  - Garage automation ($15,000)
  - Security system ($12,000)
  - Home automation ($45,000)
  - Energy-efficient HVAC ($20,000)
  - Premium plumbing ($18,000)
  - Underfloor heating ($22,000)

- Financing options:
  - Cash payment with discount
  - Bank mortgage
  - Construction loan

### 5. **Multi-Language Support**
- Arabic (العربية)
- English
- Extensible architecture for more languages

### 6. **Smart Analytics**
- Project statistics dashboard
- Cost tracking (estimated vs actual)
- Project completion rates
- Investment tracking

---

## 📡 API Endpoints

### Authentication
```
POST /auth/login
POST /auth/register
POST /auth/logout
```

### Home Projects
```
POST   /home-projects              - Create new project
GET    /home-projects              - Get all user projects
GET    /home-projects/stats        - Get user statistics
GET    /home-projects/:id          - Get project details
PATCH  /home-projects/:id          - Update project
PATCH  /home-projects/:id/status   - Update project status
PATCH  /home-projects/:id/cost     - Update current cost
GET    /home-projects/:id/cost/calculate - Calculate total cost
DELETE /home-projects/:id          - Delete project
```

### Design Studio
```
POST   /home-projects/:projectId/designs              - Create design
GET    /home-projects/:projectId/designs              - Get project designs
GET    /home-projects/:projectId/designs/popular      - Get popular designs
GET    /home-projects/:projectId/designs/style/:style - Get designs by style
GET    /home-projects/:projectId/designs/:designId    - Get design details
PATCH  /home-projects/:projectId/designs/:designId    - Update design
PATCH  /home-projects/:projectId/designs/:designId/publish - Publish design
DELETE /home-projects/:projectId/designs/:designId    - Delete design
```

### Materials & Colors
```
GET    /materials                  - Get all materials
GET    /materials?category=CATEGORY - Filter by category
GET    /materials/search?q=QUERY    - Search materials
GET    /materials/eco-friendly      - Get eco-friendly materials
GET    /materials/budget?maxPrice=X - Filter by budget
GET    /materials/recommended?style=STYLE - Get style recommendations
GET    /materials/:id               - Get material details
POST   /materials/calculate-cost    - Calculate material costs
GET    /materials/colors            - Get all colors
GET    /materials/colors/category/:category - Get colors by category
GET    /materials/colors/:id        - Get color details
```

### Pricing & Cost Analysis
```
POST   /pricing/quote               - Calculate project quote
GET    /pricing/payment-plan        - Get payment plan options
GET    /pricing/add-ons             - Get available add-ons
POST   /pricing/with-add-ons        - Calculate with add-ons
GET    /pricing/discount            - Apply discount
GET    /pricing/financing-options   - Get financing options
```

---

## 🗂️ Data Models

### HomeProject
```typescript
{
  id: UUID
  projectName: string
  description: string
  propertyType: 'villa' | 'apartment' | 'townhouse' | 'mansion' | 'duplex'
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  totalArea: number (m²)
  numberOfFloors: number
  numberOfRooms: number
  numberOfBathrooms: number
  estimatedBudget: number (USD)
  currentCost: number (USD)
  location: {
    latitude: number
    longitude: number
    address: string
    city: string
    country: string
  }
  specifications: {
    architecture: string
    style: string
    colors: string[]
    features: string[]
  }
  userId: UUID
  floors: ProjectFloor[]
  designs: ProjectDesign[]
  createdAt: Date
  updatedAt: Date
}
```

### ProjectDesign
```typescript
{
  id: UUID
  designName: string
  style: DesignStyle
  colorPalette: string[] (hex codes)
  materials: {
    exterior: string
    roofing: string
    flooring: string
    walls: string
    doors: string
    windows: string
  }
  features: string[]
  totalCost: number (USD)
  visualizationUrl: {
    thumbnail: string
    preview2d: string
    preview3d: string
  }
  isPublished: boolean
  viewCount: number
  projectId: UUID
  createdAt: Date
}
```

### ProjectFloor
```typescript
{
  id: UUID
  floorNumber: number
  floorName: string
  area: number (m²)
  layout: {
    width: number
    length: number
    orientation: string
  }
  amenities: string[]
  projectId: UUID
  rooms: ProjectRoom[]
}
```

### ProjectRoom
```typescript
{
  id: UUID
  roomName: string
  roomType: RoomType
  area: number (m²)
  length: number
  width: number
  height: number
  windows: string[]
  doors: string[]
  fixtures: {
    flooring: string
    wallPaint: string
    ceiling: string
    lighting: string[]
  }
  estimatedCost: number (USD)
  floorId: UUID
}
```

---

## 💰 Pricing Structure

### Base Cost Calculation
**Formula**: Base Area Rate × Total Area × Design Complexity Multiplier

#### Base Area Rates (per m²):
- Villa: $3,500/m²
- Apartment: $2,800/m²
- Townhouse: $2,500/m²
- Mansion: $5,000/m²
- Duplex: $3,000/m²

#### Design Complexity Multipliers:
- Simple: 1.0x
- Standard: 1.15x
- Complex: 1.35x

### Cost Breakdown:
- Materials: Base cost
- Labor: 35% of material cost
- Contingency: 10% of subtotal
- Taxes: 15% of subtotal with labor
- **Total Cost = Materials + Labor + Contingency + Taxes**

### Example (Villa, 500m², Standard):
```
Base Cost = $3,500 × 500 × 1.15 = $2,012,500
Labor = $2,012,500 × 0.35 = $704,875
Contingency = (Base + Labor) × 0.10 = $271,738
Taxes = (Base + Labor + Contingency) × 0.15 = $407,606
Total = $3,396,719 (Premium package)
```

### Premium Add-ons Available:
- Smart Home Integration: +$50,000
- Solar Panels: +$35,000
- Swimming Pool: +$75,000
- Landscaping: +$25,000
- Security System: +$12,000
- And more...

---

## 🌍 Internationalization (i18n)

### Supported Languages:
- **Arabic (ar)**: Full RTL support
- **English (en)**: Full LTR support

### Implementation:
Uses i18next with file-based backend. Language files located in `/src/locales/`

### Usage Example:
```bash
# Arabic Interface
GET /home-projects?lang=ar

# English Interface
GET /home-projects?lang=en
```

---

## 🎨 Design System

### Color Palettes:
- **Neutral**: Cream White, Pure White, Charcoal Grey
- **Warm**: Soft Beige, Sand Brown, Terracotta
- **Cool**: Navy Blue, Sky Blue, Forest Green, Sage Green

### Material Categories:
1. **Exterior Materials**
   - Granite Blocks
   - Brick Masonry
   - Aluminum Composite Panels

2. **Roofing**
   - Spanish Tile
   - Asphalt Shingles
   - Metal Standing Seam

3. **Flooring**
   - Marble
   - Oak Hardwood
   - Ceramic Tiles

4. **Interior Finishes**
   - Premium Paint
   - Designer Wallpaper

---

## 🔐 Security & Permissions

- JWT-based authentication
- Role-based access control (RBAC)
- User can only manage their own projects
- Design publication for community viewing
- Secure payment gateway integration (Stripe/PayPal)

---

## 📊 Analytics & Reporting

### User Dashboard Metrics:
- Total projects count
- Project status breakdown
- Total investment amount
- Total spent vs. estimated
- Cost overrun tracking
- Design popularity metrics

### Export Options:
- PDF project reports
- Cost breakdown documents
- 3D visualization exports
- Design comparisons

---

## 🚀 Technology Stack

### Backend:
- NestJS 10.3.0
- TypeORM 0.3.17
- PostgreSQL
- JWT Authentication
- i18next for translations
- Stripe & PayPal integration
- Swagger/OpenAPI documentation

### Frontend (Recommended):
- React 18+
- TypeScript
- Material-UI or Ant Design
- Three.js for 3D previews
- i18next for translations
- Redux for state management

---

## 🎓 Installation & Setup

### Backend Setup:
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure database, payment keys, etc.

# Run migrations
npm run typeorm migration:run

# Start development server
npm run start:dev
```

### Database Initialization:
```typescript
// The TypeORM entities will auto-sync:
// - HomeProject
// - ProjectFloor
// - ProjectRoom
// - ProjectDesign
// - And all related relationships
```

---

## 📋 Usage Examples

### Create a Home Project:
```bash
POST /home-projects
{
  "projectName": "Modern Villa in Dubai",
  "description": "Luxury 5-bedroom villa with smart home features",
  "propertyType": "villa",
  "totalArea": 500,
  "numberOfFloors": 3,
  "numberOfRooms": 5,
  "numberOfBathrooms": 4,
  "estimatedBudget": 3500000,
  "location": {
    "latitude": 25.2048,
    "longitude": 55.2708,
    "address": "Dubai Hills Estate",
    "city": "Dubai",
    "country": "UAE"
  }
}
```

### Create a Design:
```bash
POST /home-projects/{projectId}/designs
{
  "designName": "Modern Minimalist Design",
  "style": "modern",
  "colorPalette": ["#FFFFFF", "#36454F", "#87CEEB"],
  "materials": {
    "exterior": "mat_003",
    "roofing": "mat_006",
    "flooring": "mat_007",
    "walls": "mat_010",
    "doors": "mat_003",
    "windows": "mat_003"
  },
  "features": ["Smart lighting", "Climate control", "Solar ready"],
  "totalCost": 250000
}
```

### Get Project Statistics:
```bash
GET /home-projects/stats

Response:
{
  "totalProjects": 5,
  "draftProjects": 2,
  "inProgressProjects": 2,
  "completedProjects": 1,
  "totalInvestment": 12500000,
  "totalSpent": 8750000
}
```

---

## 🎉 Conclusion

The Dream Home Creation App provides a complete, professional platform for designing and visualizing luxury homes with comprehensive cost analysis, multiple design options, and seamless multi-language support.

**Maximum Project Value: $10,000 USD** ✨

For questions or support, contact the development team.
