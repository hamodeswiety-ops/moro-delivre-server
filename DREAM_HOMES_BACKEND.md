# 🏠 Dream Homes - Backend Implementation

## Overview

Complete NestJS backend for Dream Home Creation Platform with full features for managing luxury home projects, designs, materials, and payments.

## Architecture

### Module Structure

```
dream-homes/
├── entities/
│   ├── dream-home-project.entity.ts
│   ├── dream-design.entity.ts
│   ├── project-floor.entity.ts
│   ├── project-room.entity.ts
│   ├── material.entity.ts
│   └── payment.entity.ts
├── services/
│   ├── dream-homes.service.ts
│   ├── materials.service.ts
│   └── pricing.service.ts
├── controllers/
│   ├── dream-homes.controller.ts
│   ├── materials.controller.ts
│   └── pricing.controller.ts
├── dto/
│   └── create-project.dto.ts
└── dream-homes.module.ts
```

## Database Schema

### DreamHomeProject
- **id** (UUID): Primary key
- **name** (VARCHAR): Project name
- **description** (TEXT): Project description
- **propertyType** (ENUM): villa, apartment, townhouse, mansion, duplex
- **status** (ENUM): draft, designing, estimating, reviewing, approved, building, completed, archived
- **totalArea** (DECIMAL): Total area in m²
- **floorsCount** (INTEGER): Number of floors
- **roomsCount** (INTEGER): Number of rooms
- **bathroomsCount** (INTEGER): Number of bathrooms
- **estimatedBudget** (DECIMAL): Estimated budget in USD
- **actualCost** (DECIMAL): Actual cost in USD
- **location** (JSONB): Geographic location with coordinates
- **specifications** (JSONB): Architecture, style, features
- **completionPercentage** (DECIMAL): Project completion %
- **userId** (UUID): Foreign key to User
- **createdAt** (TIMESTAMP)
- **updatedAt** (TIMESTAMP)
- **deletedAt** (TIMESTAMP): Soft delete

### DreamDesign
- **id** (UUID): Primary key
- **name** (VARCHAR): Design name
- **style** (ENUM): modern, classic, contemporary, minimalist, traditional, industrial, rustic, mediterranean, scandinavian, bohemian
- **description** (TEXT): Design description
- **colorPalette** (TEXT[]): Hex color codes
- **materials** (JSONB): Material selections
- **features** (TEXT[]): Special features
- **estimatedCost** (DECIMAL): Design cost
- **visualizationUrls** (JSONB): 2D/3D preview URLs
- **isPublished** (BOOLEAN): Public visibility
- **viewCount** (INTEGER): Number of views
- **likeCount** (INTEGER): Number of likes
- **projectId** (UUID): Foreign key
- **createdAt** (TIMESTAMP)
- **updatedAt** (TIMESTAMP)

### ProjectFloor
- **id** (UUID): Primary key
- **floorNumber** (INTEGER): Floor level
- **name** (VARCHAR): Floor name (e.g., "Ground Floor")
- **area** (DECIMAL): Floor area in m²
- **layout** (JSONB): Dimensions and orientation
- **amenities** (TEXT[]): Floor amenities
- **estimatedCost** (DECIMAL): Floor cost
- **projectId** (UUID): Foreign key
- **rooms** (OneToMany): Associated rooms

### ProjectRoom
- **id** (UUID): Primary key
- **name** (VARCHAR): Room name
- **type** (ENUM): bedroom, bathroom, kitchen, living_room, dining_room, office, garage, storage, hallway, balcony, laundry, mudroom
- **area** (DECIMAL): Room area in m²
- **length**, **width**, **height** (DECIMAL): Room dimensions
- **windowsCount**, **doorsCount** (INTEGER): Number of openings
- **fixtures** (JSONB): Flooring, paint, ceiling, lighting
- **estimatedCost** (DECIMAL): Room cost
- **features** (TEXT[]): Special features
- **floorId** (UUID): Foreign key

### Material
- **id** (UUID): Primary key
- **name** (VARCHAR): Material name
- **category** (ENUM): exterior, roofing, flooring, walls, doors, windows, plumbing, electrical, hvac, finishes
- **description** (TEXT): Detailed description
- **unitPrice** (DECIMAL): Price per unit
- **unitType** (ENUM): m2, piece, kg, meter, liter
- **supplier** (VARCHAR): Supplier name
- **durabilityYears** (INTEGER): Expected lifespan
- **isEcoFriendly** (BOOLEAN): Environmental certification
- **imageUrl** (TEXT): Material image
- **color**, **texture** (VARCHAR): Visual properties
- **rating** (DECIMAL): 0-5 star rating
- **reviews** (INTEGER): Number of reviews
- **isAvailable** (BOOLEAN): Stock status
- **specifications** (JSONB): Detailed specs
- **tags** (TEXT[]): Search tags
- **createdAt**, **updatedAt** (TIMESTAMP)

### Payment
- **id** (UUID): Primary key
- **amount** (DECIMAL): Payment amount
- **currency** (VARCHAR): Currency code
- **status** (ENUM): pending, completed, failed, refunded, cancelled
- **method** (ENUM): card, paypal, bank_transfer, crypto
- **stripePaymentId** (VARCHAR): Stripe reference
- **paypalTransactionId** (VARCHAR): PayPal reference
- **description** (TEXT): Payment description
- **metadata** (JSONB): Additional data
- **userId** (UUID): Foreign key to User
- **projectId** (UUID): Foreign key to Project
- **createdAt**, **updatedAt** (TIMESTAMP)
- **completedAt** (TIMESTAMP): Payment completion time

## API Endpoints

### Dream Projects

```
POST   /api/v1/dream-projects              - Create project
GET    /api/v1/dream-projects              - List all projects
GET    /api/v1/dream-projects/stats        - Get statistics
GET    /api/v1/dream-projects/:id          - Get project details
PATCH  /api/v1/dream-projects/:id          - Update project
PATCH  /api/v1/dream-projects/:id/status   - Update status
PATCH  /api/v1/dream-projects/:id/cost     - Update actual cost
GET    /api/v1/dream-projects/:id/cost     - Calculate total cost
DELETE /api/v1/dream-projects/:id          - Soft delete project
PATCH  /api/v1/dream-projects/:id/restore  - Restore deleted project
```

### Materials

```
GET    /api/v1/materials                   - Get all materials
GET    /api/v1/materials/search?q=query    - Search materials
GET    /api/v1/materials/eco-friendly      - Get eco-friendly materials
GET    /api/v1/materials/price-range       - Filter by price
GET    /api/v1/materials/category/:category - Get by category
GET    /api/v1/materials/recommended/:category - Get recommendations
GET    /api/v1/materials/top-rated         - Get top rated materials
GET    /api/v1/materials/color/:color      - Get by color
GET    /api/v1/materials/bulk-cost         - Calculate bulk cost
```

### Pricing & Cost Calculation

```
GET    /api/v1/pricing/base-price          - Calculate base price
POST   /api/v1/pricing/full-cost           - Calculate full cost breakdown
GET    /api/v1/pricing/payment-plans/:totalCost - Get payment options
GET    /api/v1/pricing/financing-options/:totalCost - Get financing options
POST   /api/v1/pricing/with-addons         - Calculate with add-ons
GET    /api/v1/pricing/apply-discount      - Apply discount
GET    /api/v1/pricing/addons              - Get available add-ons
```

## Key Features

### Project Management
- ✅ Complete CRUD operations
- ✅ Status tracking with 8 states
- ✅ Soft delete support
- ✅ Hierarchical structure (Project → Floors → Rooms)
- ✅ Real-time cost calculations
- ✅ Progress tracking

### Design System
- ✅ 10 architectural styles
- ✅ Custom color palettes
- ✅ Material selection
- ✅ Feature customization
- ✅ Public/private designs
- ✅ View and like tracking

### Materials Library
- ✅ 10+ material categories
- ✅ Eco-friendly filtering
- ✅ Price range filtering
- ✅ Rating and reviews
- ✅ Bulk cost calculation
- ✅ Style-based recommendations

### Advanced Pricing
- ✅ Base price calculation (per m² by property type)
- ✅ Design complexity multipliers
- ✅ Labor cost estimation (35% of materials)
- ✅ Contingency planning (10%)
- ✅ Tax calculation (15%)
- ✅ Cost breakdown by component

### Payment Options
- ✅ Full payment with 2% discount
- ✅ 4-installment plan (quarterly)
- ✅ 12-month installment plan
- ✅ Bank mortgage calculation (20 years, 3.5%)
- ✅ Construction loan options

### Premium Add-ons
```
- Smart Home System: $50,000
- Solar Panels: $35,000
- Swimming Pool: $75,000
- Landscaping: $25,000
- Garage Automation: $15,000
- Security System: $12,000
- Home Automation: $45,000
- Energy-Efficient HVAC: $20,000
- Premium Plumbing: $18,000
- Underfloor Heating: $22,000
```

## Property Types & Base Rates

```
Villa:      $3,500/m²
Apartment:  $2,800/m²
Townhouse:  $2,500/m²
Mansion:    $5,000/m²
Duplex:     $3,000/m²
```

## Project Status Flow

```
Draft → Designing → Estimating → Reviewing → Approved → Building → Completed
                                                              ↓
                                                          Archived
```

## Authentication & Authorization

- JWT-based authentication
- Role-based access control
- User isolation (own projects only)
- Admin oversight capabilities

## Error Handling

- Input validation with class-validator
- Comprehensive error messages
- HTTP status codes
- Structured error responses

## Performance Optimizations

- Database indexing on frequently queried fields
- Soft deletes for data preservation
- Eager/lazy loading optimization
- Query result caching ready

## Dependencies

```json
{
  "@nestjs/common": "^10.3.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.17",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "@nestjs/swagger": "^7.1.16"
}
```

## Setup & Installation

```bash
# Install dependencies
npm install

# Configure database
cp .env.example .env
# Edit .env with database credentials

# Run migrations (auto-sync via TypeORM)
npm run start:dev

# API will be available at http://localhost:3000
# Swagger docs at http://localhost:3000/api/docs
```

## Testing Examples

### Create Project
```bash
curl -X POST http://localhost:3000/api/v1/dream-projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luxury Villa Dubai",
    "description": "5-bedroom modern villa",
    "propertyType": "villa",
    "totalArea": 500,
    "floorsCount": 3,
    "roomsCount": 5,
    "bathroomsCount": 4,
    "estimatedBudget": 3500000
  }'
```

### Get All Materials
```bash
curl http://localhost:3000/api/v1/materials \
  -H "Authorization: Bearer TOKEN"
```

### Calculate Full Cost
```bash
curl -X POST http://localhost:3000/api/v1/pricing/full-cost \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType": "villa",
    "area": 500,
    "materialCost": 750000,
    "complexity": "standard"
  }'
```

## Future Enhancements

1. **WebSocket Support** - Real-time collaboration
2. **File Upload** - 3D models and blueprints
3. **Notifications** - Email and SMS alerts
4. **Analytics** - Advanced reporting
5. **AI Integration** - Smart recommendations
6. **Marketplace** - Contractor network
7. **Mobile API** - React Native support
8. **Internationalization** - Multi-language support

---

**Status: Production Ready** ✅
**Version: 1.0.0**
**Last Updated: 2026-09-11**
