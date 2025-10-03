# Property Listing Generator MCP Server

A Model Context Protocol (MCP) server that helps real estate professionals generate compelling property listings with AI-enhanced descriptions, local information from Google Maps, and professional PDF brochures.

## Features

- 🏠 **AI-Enhanced Property Descriptions**: Generate appealing, professional property descriptions
- 📍 **Local Information Integration**: Automatically fetch nearby schools, transport, and amenities using Google Maps API
- 📄 **PDF Brochure Generation**: Create beautiful PDF brochures with property photos and information
- 🖼️ **Image Support**: Include up to 10 property images in your listings
- 🔧 **Easy Integration**: Works seamlessly with Claude Desktop and other MCP clients

## Installation

### Via NPX (Recommended)

The easiest way to use this MCP server is via npx. Add the following to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "property-listing-generator": {
      "command": "npx",
      "args": ["-y", "property-listing-generator-mcp"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "your-google-maps-api-key-here"
      }
    }
  }
}
```

### Manual Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd property-ad-generator
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Add to Claude Desktop configuration:
```json
{
  "mcpServers": {
    "property-listing-generator": {
      "command": "node",
      "args": ["/absolute/path/to/property-ad-generator/build/index.js"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "your-google-maps-api-key-here"
      }
    }
  }
}
```

## Google Maps API Key

This MCP server requires a Google Maps API key to fetch local information. 

### Getting a Google Maps API Key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Geocoding API
   - Places API
4. Create credentials (API Key)
5. Add the API key to your Claude Desktop configuration as shown above

**Note**: The Places API has usage costs. Review [Google Maps Platform pricing](https://mapsplatform.google.com/pricing/) to understand potential charges.

## Usage

Once configured, you can use the following tools in Claude Desktop:

### 1. Generate Property Listing

Generate a complete property listing with description, local information, and PDF brochure:

```
Please generate a property listing for:
- Address: 123 Main St, San Francisco, CA 94102
- Property Type: House
- Bedrooms: 3
- Bathrooms: 2
- Square Feet: 1800
- Price: $1,200,000
- Features: Updated Kitchen, Hardwood Floors, Private Garden, Garage
```

### 2. Get Local Information

Fetch local schools, transport, and amenities for a specific address:

```
Get local information for 123 Main St, San Francisco, CA 94102
```

## Tools

### `generate_property_listing`

Generates a comprehensive property listing including:
- AI-enhanced description
- Local information (schools, transport, amenities)
- PDF brochure with photos

**Parameters**:
- `address` (required): Full property address
- `propertyType` (required): Type of property (House, Condo, Apartment, etc.)
- `bedrooms` (optional): Number of bedrooms
- `bathrooms` (optional): Number of bathrooms
- `squareFeet` (optional): Total square footage
- `price` (optional): Listing price
- `features` (optional): Array of property features
- `images` (optional): Array of up to 10 image file paths
- `outputPath` (optional): PDF output path (default: './property-brochure.pdf')

### `get_local_information`

Fetches local information for a given address.

**Parameters**:
- `address` (required): Full property address
- `radius` (optional): Search radius in meters (default: 1609 = 1 mile)

## Image Requirements

- Supported formats: JPEG, PNG
- Maximum 10 images per listing
- Images must be accessible local file paths
- Images will be automatically resized to fit the PDF layout

## Output

The server generates:
1. **Property Description**: CRM-ready text that can be copied directly
2. **PDF Brochure**: Professional brochure with:
   - Property title and address
   - Price and key details
   - Property photos (up to 10)
   - Full description
   - Local highlights (schools, transport, amenities)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev
```

## Example Configuration Files

See `examples/` directory for sample Claude Desktop configurations and example usage.

## Troubleshooting

### "Google Maps API key not configured" error

Make sure you've added the `GOOGLE_MAPS_API_KEY` environment variable to your Claude Desktop configuration file.

### Images not appearing in PDF

- Verify that image paths are correct and accessible
- Ensure image files are in JPEG or PNG format
- Check that file paths are absolute or relative to where Claude Desktop runs

### PDF not generated

- Check that you have write permissions in the output directory
- Verify the output path is valid
- Check the Claude Desktop logs for detailed error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

