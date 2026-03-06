# Quick Discount Backend API Documentation

## Overview

This is a Django REST Framework backend API for the Quick Discount application. It provides endpoints for managing users, discounts, tickets, orders, payments, and more.

**Base URL:** `http://localhost:8000/`

---

## Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

### Obtaining Tokens

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/token/` | POST | Obtain JWT token pair (access + refresh) |
| `/users/token/refresh/` | POST | Refresh access token |

**Request Body (both endpoints):**
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

---

## Users App

### User Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/users/` | GET | List all users | No |
| `/users/<int:pk>/` | GET | Get user detail | No |
| `/users/signup/` | POST | Register new user | No |
| `/users/login/` | POST | User login | No |
| `/users/delete/<int:pk>/` | DELETE | Delete user | No |
| `/profile/` | GET | Get current user profile | Yes |
| `/profile/` | POST | Create user profile | Yes |
| `/profile/update/` | GET | Get current user profile | Yes |
| `/profile/update/` | PUT | Full update user profile | Yes |
| `/profile/update/` | PATCH | Partial update user profile | Yes |
| `/profile/update/` | POST | Update user profile (partial) | Yes |
| `/users/logout/` | GET | User logout | No |
| `/users/activate/<uuidb64>/<token>/` | GET | Activate user account | No |

### Password Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/password-reset/` | POST | Request password reset |
| `/users/password-reset/<uuidb64>/<token>/` | GET | Verify password reset link |
| `/users/password-reset/<uuidb64>/<token>/` | POST | Set new password |

---

## Discounts App

### Discounts

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/` | GET | List all discounts | No |
| `/discounts/` | POST | Create new discount | Yes |
| `/discounts/<int:pk>/` | GET | Get discount detail | No |
| `/discounts/<int:pk>/` | PUT | Update discount | Yes |
| `/discounts/<int:pk>/` | DELETE | Delete discount | Yes |
| `/discounts/detail/<int:pk>/` | GET | Web view - discount detail page | No |
| `/discounts/all/` | GET | Web view - all discounts page | No |

### Discount Reviews

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/reviews/` | GET | List all reviews | No |
| `/discounts/reviews/` | POST | Create a review | Yes |
| `/discounts/reviews/discount/<int:pk>/` | GET | Get reviews for a discount | No |
| `/discounts/reviews/<int:pk>/` | GET | Get review detail | No |
| `/discounts/reviews/<int:pk>/` | PUT | Update review | Yes |
| `/discounts/reviews/<int:pk>/` | DELETE | Delete review | Yes |

### Categories

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/categories/` | GET | List all categories | No |
| `/discounts/categories/` | POST | Create category | Yes |
| `/discounts/categories/<int:pk>/` | GET | Get category detail | No |
| `/discounts/categories/<int:pk>/` | PUT | Update category | Yes |
| `/discounts/categories/<int:pk>/` | PATCH | Partial update category | Yes |
| `/discounts/categories/<int:pk>/` | DELETE | Delete category | Yes |

### Organizers

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/organizers/` | GET | List all organizers | No |
| `/discounts/organizers/` | POST | Create organizer | Yes |
| `/discounts/organizers/<int:pk>/` | GET | Get organizer detail | No |
| `/discounts/organizers/<int:pk>/` | PUT | Update organizer | Yes |
| `/discounts/organizers/<int:pk>/` | PATCH | Partial update organizer | Yes |
| `/discounts/organizers/<int:pk>/` | DELETE | Delete organizer | Yes |
| `/discounts/organizer-discounts/<int:pk>/` | GET | Get organizer's discounts | No |
| `/discounts/user/organizer/` | GET | Get current user's organizer | Yes |

### Followers

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/organizers/followers/` | GET | List all followers | No |
| `/discounts/organizers/followers/` | POST | Add a follower | Yes |
| `/discounts/organizer/followers/<int:pk>/` | GET | Get organizer's followers | No |
| `/discounts/organizer/followers/add/` | POST | Add follower | Yes |
| `/discounts/organizer/followers/detail/<int:pk>/` | GET | Get follower detail | No |
| `/discounts/organizer/followers/verify/<int:pk>/<int:organizer_id>/` | GET | Verify follower | No |
| `/discounts/organizer/followers/delete/<int:pk>/` | DELETE | Delete follower | Yes |

### Likes

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/likes/` | GET | List all likes | No |
| `/discounts/likes/<int:discount_id>/` | GET | Get likes for a discount | No |
| `/discounts/likes/add/` | POST | Add a like | Yes |
| `/discounts/likes/detail/<int:pk>/` | GET | Get like detail | No |
| `/discounts/likes/verify/<int:pk>/<int:discount_id>/` | GET | Verify if user liked discount | No |
| `/discounts/likes/delete/<int:pk>/` | DELETE | Delete like | Yes |

### Wishlist

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/add-to-wishlist/` | POST | Add discount to wishlist | Yes |
| `/discounts/remove-from-wishlist/` | POST | Remove from wishlist | Yes |
| `/discounts/get-wishlist/` | GET | Get user's wishlist | Yes |
| `/discounts/wishlist/<int:pk>/` | GET | Get wishlist item detail | Yes |

### Media

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/media/` | GET | List all media files | No |
| `/discounts/media/` | POST | Upload media file | Yes |
| `/discounts/media/<int:pk>/` | GET | Get media detail | No |
| `/discounts/media/<int:pk>/` | PUT | Update media | Yes |
| `/discounts/media/<int:pk>/` | PATCH | Partial update media | Yes |
| `/discounts/media/<int:pk>/` | DELETE | Delete media | Yes |
| `/discounts/media/files/<int:pk>/` | GET | Get discount's media files | No |

### Discount Packages

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/packages/` | GET | List all discount packages | No |
| `/discounts/packages/` | POST | Create discount package | Yes |
| `/discounts/packages/<int:pk>/` | GET | Get package detail | No |
| `/discounts/packages/<int:pk>/` | PUT | Update package | Yes |
| `/discounts/packages/<int:pk>/` | PATCH | Partial update package | Yes |
| `/discounts/packages/<int:pk>/` | DELETE | Delete package | Yes |

### Analytics

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/analytics/<int:pk>/` | GET | Get analytics for organizer | Yes |

### Tickets

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/discounts/tickets/<int:pk>/` | GET | Get discount's tickets | No |

### Search

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/search/` | GET | Search discounts | No |

### Web Views

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page |
| `/discounts/help` | GET | Help page |

---

## Tickets App

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/tickets/` | GET | List all tickets | No |
| `/tickets/` | POST | Create a ticket | Yes |
| `/tickets/add/<int:pk>/` | POST | Add ticket for discount | Yes |
| `/tickets/<int:pk>/` | GET | Get ticket detail | No |
| `/tickets/<int:pk>/` | PUT | Update ticket | Yes |
| `/tickets/<int:pk>/` | DELETE | Delete ticket | Yes |
| `/tickets/update/<int:pk>/` | PUT | Update ticket | Yes |
| `/tickets/user/` | GET | Get current user's tickets | Yes |

---

## Orders App

### Addresses

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/address/` | GET | List all addresses | No |
| `/address/` | POST | Create address | Yes |
| `/address/<int:pk>/` | GET | Get address detail | No |
| `/address/<int:pk>/` | PUT | Update address | Yes |
| `/address/<int:pk>/` | PATCH | Partial update address | Yes |
| `/address/<int:pk>/` | DELETE | Delete address | Yes |

### Orders

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/order/checkout/` | POST | Create checkout | Yes |
| `/order/checkout/<int:address_pk>/` | POST | Checkout with specific address | Yes |
| `/order/` | GET | List all orders | Yes |
| `/order/` | POST | Create order | Yes |
| `/order/<int:pk>/` | GET | Get order detail | Yes |
| `/order/<int:pk>/` | PUT | Update order | Yes |
| `/order/<int:pk>/` | DELETE | Delete order | Yes |

### Order Items

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/order/items/` | GET | List all order items | Yes |
| `/order/items/` | POST | Create order item | Yes |
| `/order/items/<int:pk>/` | GET | Get order item detail | Yes |
| `/order/items/<int:pk>/` | PUT | Update order item | Yes |
| `/order/items/<int:pk>/` | DELETE | Delete order item | Yes |

---

## Payment App

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/pay/` | POST | Request payment | Yes |
| `/payment/<int:pk>/` | GET | Get payment detail | Yes |
| `/payment/<int:pk>/` | PUT | Update payment | Yes |
| `/payment/<int:pk>/` | DELETE | Delete payment | Yes |
| `/order/<int:pk>/` | GET | MoMo payment view | Yes |
| `/order/<int:pk>/` | POST | Initiate MoMo payment | Yes |
| `/momo/<int:pk>/confirm/` | GET | Confirm MoMo payment | Yes |
| `/choice/` | GET | Payment choice view | Yes |
| `/choice/` | POST | Select payment method | Yes |
| `/choice/discount/` | POST | Discount payment choice | Yes |
| `/payment/verify/` | POST | Verify payment | Yes |

---

## Services App

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mail/` | POST | Send email |
| `/ussd/` | POST | USSD service |

---

## API Root

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | API root with available endpoints |

---

## Admin Panel

| Endpoint | Description |
|----------|-------------|
| `/admin/` | Django admin panel |

---

## Format Suffix Support

All API endpoints support format suffixes. For example:
- `/users.json/` - Returns JSON response
- `/users.xml/` - Returns XML response

---

## Request/Response Examples

### Login Request
```http
POST /users/login/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Create Discount Request
```http
POST /discounts/
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Summer Sale",
    "description": "50% off all items",
    "price": 25.99,
    "category": 1,
    "organizer": 1
}
```

### Get Discounts Response
```json
{
    "count": 10,
    "next": "http://localhost:8000/discounts/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Summer Sale",
            "description": "50% off all items",
            "price": "25.99",
            "category": {
                "id": 1,
                "name": "Sales"
            },
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### User Signup Request
```http
POST /users/signup/
Content-Type: application/json

{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "securePassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
}
```

### User Signup Response
```json
{
    "id": 1,
    "email": "newuser@example.com",
    "username": "newuser",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "is_active": false,
    "date_joined": "2024-01-15T10:30:00Z"
}
```

### User Login Request
```http
POST /users/login/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### User Login Response
```json
{
    "user": {
        "id": 1,
        "email": "user@example.com",
        "username": "johndoe",
        "first_name": "John",
        "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile Response
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "username": "johndoe",
        "first_name": "John",
        "last_name": "Doe"
    },
    "bio": "Love finding great deals!",
    "avatar": "/media/avatars/photo.jpg",
    "phone": "+1234567890",
    "date_of_birth": "1990-05-15",
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Update User Profile Request
```http
POST /profile/update/
Authorization: Bearer <token>
Content-Type: application/json

{
    "bio": "Updated bio text",
    "phone": "+9876543210",
    "date_of_birth": "1990-05-15"
}
```

### Get User Profile (GET)
```http
GET /profile/update/
Authorization: Bearer <token>
```

### Get User Profile Response
```json
{
    "success": true,
    "user_data": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "contact": "+1234567890",
        "profile_pic": "https://res.cloudinary.com/.../image.jpg",
        "is_organizer": false
    }
}
```

### Update User Profile (PUT) Request
```http
PUT /profile/update/
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "John Doe",
    "email": "user@example.com",
    "contact": "+9876543210",
    "profile_pic": <file>
}
```

### Update User Profile (PATCH) Request
```http
PATCH /profile/update/
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "John Updated",
    "contact": "+1111111111"
}
```

### Update User Profile Response
```json
{
    "success": true,
    "user_data": {
        "id": 1,
        "name": "John Updated",
        "email": "user@example.com",
        "contact": "+1111111111",
        "profile_pic": "https://res.cloudinary.com/.../image.jpg",
        "is_organizer": false
    }
}
```

### Create Category Request
```http
POST /discounts/categories/
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "icon": "fa-laptop"
}
```

### Create Category Response
```json
{
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "icon": "fa-laptop",
    "discount_count": 0,
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Create Organizer Request
```http
POST /discounts/organizers/
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Tech Deals Inc.",
    "description": "Best tech deals online",
    "logo": "/media/organizers/logo.png",
    "banner": "/media/organizers/banner.jpg",
    "website": "https://techdeals.com",
    "facebook": "https://facebook.com/techdeals",
    "instagram": "https://instagram.com/techdeals",
    "twitter": "https://twitter.com/techdeals"
}
```

### Create Organizer Response
```json
{
    "id": 1,
    "name": "Tech Deals Inc.",
    "description": "Best tech deals online",
    "logo": "/media/organizers/logo.png",
    "banner": "/media/organizers/banner.jpg",
    "website": "https://techdeals.com",
    "facebook": "https://facebook.com/techdeals",
    "instagram": "https://instagram.com/techdeals",
    "twitter": "https://twitter.com/techdeals",
    "created_by": 1,
    "followers_count": 0,
    "discounts_count": 0,
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Add to Wishlist Request
```http
POST /discounts/add-to-wishlist/
Authorization: Bearer <token>
Content-Type: application/json

{
    "discount_id": 1
}
```

### Add to Wishlist Response
```json
{
    "id": 1,
    "user": 1,
    "discount": {
        "id": 1,
        "title": "Summer Sale",
        "price": "25.99"
    },
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Wishlist Response
```json
{
    "count": 5,
    "results": [
        {
            "id": 1,
            "user": 1,
            "discount": {
                "id": 1,
                "title": "Summer Sale",
                "description": "50% off all items",
                "price": "25.99",
                "image": "/media/discounts/image1.jpg"
            },
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### Create Discount Review Request
```http
POST /discounts/reviews/
Authorization: Bearer <token>
Content-Type: application/json

{
    "discount": 1,
    "rating": 5,
    "comment": "Amazing deal! Highly recommend."
}
```

### Create Discount Review Response
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "johndoe",
        "first_name": "John"
    },
    "discount": 1,
    "rating": 5,
    "comment": "Amazing deal! Highly recommend.",
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Add Like Request
```http
POST /discounts/likes/add/
Authorization: Bearer <token>
Content-Type: application/json

{
    "discount": 1
}
```

### Add Like Response
```json
{
    "id": 1,
    "user": 1,
    "discount": 1,
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Create Ticket Request
```http
POST /tickets/add/1/
Authorization: Bearer <token>
Content-Type: application/json

{
    "ticket_type": "VIP",
    "quantity": 2
}
```

### Create Ticket Response
```json
{
    "id": 1,
    "discount": {
        "id": 1,
        "title": "Summer Sale"
    },
    "user": 1,
    "ticket_type": "VIP",
    "quantity": 2,
    "price": "51.98",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Get User Tickets Response
```json
{
    "count": 3,
    "results": [
        {
            "id": 1,
            "discount": {
                "id": 1,
                "title": "Summer Sale",
                "image": "/media/discounts/image1.jpg"
            },
            "ticket_type": "VIP",
            "quantity": 2,
            "price": "51.98",
            "status": "active",
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### Create Address Request
```http
POST /address/
Authorization: Bearer <token>
Content-Type: application/json

{
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA",
    "is_default": true
}
```

### Create Address Response
```json
{
    "id": 1,
    "user": 1,
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA",
    "is_default": true,
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Create Order Request
```http
POST /order/
Authorization: Bearer <token>
Content-Type: application/json

{
    "items": [
        {
            "ticket": 1,
            "quantity": 2
        }
    ],
    "shipping_address": 1
}
```

### Create Order Response
```json
{
    "id": 1,
    "user": 1,
    "items": [
        {
            "id": 1,
            "ticket": {
                "id": 1,
                "ticket_type": "VIP",
                "price": "25.99"
            },
            "quantity": 2,
            "price": "51.98"
        }
    ],
    "total_amount": "51.98",
    "status": "pending",
    "ordered": false,
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Checkout Request
```http
POST /order/checkout/
Authorization: Bearer <token>
Content-Type: application/json

{
    "address": 1,
    "payment_method": "paystack"
}
```

### Checkout Response
```json
{
    "id": 1,
    "user": 1,
    "items": [...],
    "total_amount": "51.98",
    "status": "processing",
    "ordered": true,
    "payment": {
        "id": 1,
        "amount": "51.98",
        "status": "pending",
        "payment_method": "paystack"
    },
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Request Payment (Paystack) Request
```http
POST /pay/
Authorization: Bearer <token>
Content-Type: application/json

{
    "order": 1,
    "email": "user@example.com",
    "amount": 5198,
    "currency": "NGN"
}
```

### Request Payment Response
```json
{
    "status": true,
    "message": "Payment initiated successfully",
    "data": {
        "authorization_url": "https://checkout.paystack.co/...",
        "access_code": "...",
        "reference": "PAYSTACK_REFERENCE_123"
    }
}
```

### Verify Payment Request
```http
POST /payment/verify/
Authorization: Bearer <token>
Content-Type: application/json

{
    "reference": "PAYSTACK_REFERENCE_123"
}
```

### Verify Payment Response
```json
{
    "status": true,
    "message": "Payment verified",
    "data": {
        "id": 123456,
        "amount": 519800,
        "currency": "NGN",
        "status": "success",
        "reference": "PAYSTACK_REFERENCE_123",
        "customer": {
            "email": "user@example.com"
        }
    }
}
```

### Send Email Request
```http
POST /mail/
Content-Type: application/json

{
    "to": "recipient@example.com",
    "subject": "Welcome to Quick Discount",
    "message": "Thank you for signing up!",
    "from": "noreply@quickdiscount.com"
}
```

### Send Email Response
```json
{
    "status": "success",
    "message": "Email sent successfully"
}
```

### USSD Request
```http
POST /ussd/
Content-Type: application/json

{
    "phone": "+1234567890",
    "session_id": "SESSION123",
    "service_code": "*123#",
    "text": "1"
}
```

### USSD Response
```json
{
    "response": "CON Welcome to Quick Discount\n1. Check Balance\n2. Buy Ticket\n3. Exit"
}
```

### Search Discounts Request
```http
GET /search/?keywords=summer+sale
```

### Search Discounts Response
```json
{
    "count": 5,
    "results": [
        {
            "id": 1,
            "title": "Summer Sale 2024",
            "description": "Amazing summer discounts",
            "price": "25.99",
            "original_price": "50.00",
            "discount_percentage": 48,
            "category": {
                "id": 1,
                "name": "Sales"
            },
            "organizer": {
                "id": 1,
                "name": "Tech Deals Inc."
            }
        }
    ]
}
```

### Get Organizer Analytics Response
```json
{
    "organizer": {
        "id": 1,
        "name": "Tech Deals Inc.",
        "followers_count": 200
    },
    "discount_summary": {
        "total_discounts": 25,
        "active_discounts": 10,
        "pending_discounts": 5,
        "rejected_discounts": 3,
        "expired_discounts": 7
    },
    "engagement": {
        "total_likes": 500,
        "total_reviews": 75,
        "average_rating": 4.2,
        "total_attendees": 150,
        "total_wishlists": 85
    },
    "recent_discounts": [
        {
            "id": 1,
            "title": "Summer Sale",
            "status": "active",
            "is_active": true,
            "start_date": "2024-01-01",
            "end_date": "2024-01-31",
            "likes_count": 50,
            "reviews_count": 10
        }
    ]
}
```

