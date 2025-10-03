# Quick Start Guide

Get up and running with the Property Listing Generator MCP Server in 5 minutes!

## Step 1: Get a Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Geocoding API**
   - **Places API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Configure Claude Desktop

### MacOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

Add this configuration:

```json
{
  "mcpServers": {
    "property-listing-generator": {
      "command": "npx",
      "args": ["-y", "property-listing-generator-mcp"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "paste-your-api-key-here"
      }
    }
  }
}
```

**Important**: Replace `paste-your-api-key-here` with your actual Google Maps API key!

## Step 3: Restart Claude Desktop

Close and reopen Claude Desktop for the changes to take effect.

## Step 4: Test It Out

Open a new conversation in Claude and try:

```
Generate a property listing for:
- Address: 1600 Amphitheatre Parkway, Mountain View, CA 94043
- Property Type: Office Building
- Price: For Lease
```

Claude will use the MCP server to generate a comprehensive listing with local information!

## Next Steps

### Try with Your Own Property

```
Generate a property listing for:
- Address: [Your Property Address]
- Property Type: [House/Condo/Apartment/etc.]
- Bedrooms: [Number]
- Bathrooms: [Number]
- Square Feet: [Size]
- Price: [Price]
- Features: [List your features]
```

### Add Property Images

If you have property photos saved locally:

```
Generate a property listing for:
- Address: [Your Address]
- Property Type: House
- Bedrooms: 3
- Bathrooms: 2
- Price: $500,000
- Images: /path/to/photo1.jpg, /path/to/photo2.jpg
- Output Path: /path/to/my-listing.pdf
```

### Get Just Local Information

```
Get local information for [Your Address]
```

## Troubleshooting

### "Google Maps API key not configured"

- Check that you pasted your API key correctly in the config file
- Make sure there are no extra spaces or quotes
- Restart Claude Desktop

### "Could not geocode the provided address"

- Verify the address is complete and correct
- Include city, state, and ZIP code
- Try a well-known address first to test

### Images not appearing

- Use absolute file paths (e.g., `/Users/yourname/Photos/house.jpg`)
- Verify images are in JPEG or PNG format
- Check that the files exist and are readable

### Server not showing up in Claude

- Verify the JSON configuration is valid (no syntax errors)
- Check Claude Desktop logs for errors
- Make sure you restarted Claude Desktop after configuration

## Tips for Best Results

1. **Complete Addresses**: Always include full address with city, state, ZIP
2. **High-Quality Images**: Use clear, well-lit property photos
3. **Detailed Features**: Be specific (e.g., "Granite countertops" not just "Nice kitchen")
4. **Consistent Property Types**: Use standard terms (House, Condo, Apartment, etc.)

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review [examples/example-usage.md](examples/example-usage.md) for more examples
- See [PUBLISHING.md](PUBLISHING.md) if you want to contribute

## Example Output

After running a listing generation, you'll get:

1. **Text Description** - Ready to copy into your CRM
2. **PDF Brochure** - Professional brochure saved to your specified path
3. **Local Highlights** - Schools, transport, and amenities automatically included

Happy listing! 🏠

