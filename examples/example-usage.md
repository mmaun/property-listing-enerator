# Example Usage

## Basic Property Listing

```
Generate a property listing for:
- Address: 456 Oak Avenue, Austin, TX 78701
- Property Type: Condo
- Bedrooms: 2
- Bathrooms: 2
- Square Feet: 1200
- Price: $450,000
- Features: Modern Kitchen, Balcony, Gym Access, Pool, Secure Parking
```

## With Images

```
Generate a property listing for:
- Address: 789 Pine Street, Seattle, WA 98101
- Property Type: House
- Bedrooms: 4
- Bathrooms: 3
- Square Feet: 2500
- Price: $950,000
- Features: Chef's Kitchen, Master Suite, Home Office, Landscaped Yard, 2-Car Garage
- Images: /path/to/exterior.jpg, /path/to/kitchen.jpg, /path/to/living-room.jpg, /path/to/bedroom.jpg
- Output Path: /path/to/my-listing.pdf
```

## Just Local Information

```
Get me the local information for 321 Maple Drive, Denver, CO 80202 within a 2-mile radius
```

## Sample Conversation Flow

**You**: I need to create a listing for a property I just took on.

**Claude**: I'd be happy to help you create a property listing! Please provide me with the following information:
- Full address
- Property type
- Number of bedrooms and bathrooms
- Square footage
- Listing price
- Key features
- Any property images you'd like to include (up to 10)

**You**: 
- Address: 555 Sunset Boulevard, Los Angeles, CA 90028
- Type: Luxury Condo
- 3 bedrooms, 2.5 bathrooms
- 1850 sq ft
- $875,000
- Features: Floor-to-ceiling windows, Rooftop access, Concierge service, Updated appliances, Walk-in closets

**Claude**: *Calls generate_property_listing tool and provides you with a complete property description and PDF brochure*

## Expected Output

The tool will provide:

1. **CRM-Ready Description**: A formatted text description you can copy directly into your CRM, including:
   - Engaging property overview
   - Key features bulleted list
   - Nearby schools with ratings
   - Transportation options
   - Local amenities (parks, shopping, restaurants, etc.)
   - Price and call-to-action

2. **PDF Brochure**: A professional PDF file containing:
   - Property title and address
   - Price prominently displayed
   - Property details (bed/bath/sqft)
   - Property photos in a grid layout
   - Full description
   - Local highlights section
   - Generated date

## Tips for Best Results

1. **Complete Address**: Always provide the full address including city, state, and ZIP code for accurate local information
2. **Image Paths**: Use absolute paths for images to avoid path resolution issues
3. **Feature Details**: Be specific with features (e.g., "Granite Countertops" vs just "Updated Kitchen")
4. **Property Type**: Use standard terms like House, Condo, Apartment, Townhouse for consistency
5. **Image Quality**: Use high-quality images for best PDF results

## Advanced Usage

### Custom Search Radius

```
Get local information for 123 Main St, Portland, OR 97201 with a 3000 meter radius
```

### Multiple Listings Batch

You can generate multiple listings in sequence:

```
Generate listings for these three properties:

1. 100 First St, Boston, MA - 2BR/1BA Apartment, $400K
2. 200 Second Ave, Boston, MA - 3BR/2BA Condo, $650K  
3. 300 Third Rd, Boston, MA - 4BR/3BA House, $900K
```

Claude will process each one and provide individual listings and PDFs for each property.

