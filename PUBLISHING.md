# Publishing to NPM

This guide explains how to publish the Property Listing Generator MCP server to NPM so it can be used via `npx`.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/) if you don't have one
2. **Login to NPM**: Run `npm login` in your terminal

## Before Publishing

### 1. Update package.json

Make sure your `package.json` has:
- A unique package name (search NPM to ensure it's not taken)
- Correct version number
- Your author information
- Appropriate license

```json
{
  "name": "property-listing-generator-mcp",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT"
}
```

### 2. Test Locally

Build and test the package locally:

```bash
npm install
npm run build
```

Test the built package:

```bash
node build/index.js
```

### 3. Test with npx Locally

You can test the package with npx before publishing:

```bash
npm link
npx property-listing-generator-mcp
```

## Publishing Steps

### Initial Publication

1. **Build the project**:
```bash
npm run build
```

2. **Publish to NPM**:
```bash
npm publish
```

Note: For scoped packages (like `@yourusername/property-listing-generator`), you may need to publish as public:
```bash
npm publish --access public
```

### Updating

When you make changes and want to publish a new version:

1. **Update version** in `package.json`:
   - Patch release (bug fixes): `1.0.0` → `1.0.1`
   - Minor release (new features): `1.0.0` → `1.1.0`
   - Major release (breaking changes): `1.0.0` → `2.0.0`

   Or use npm version command:
   ```bash
   npm version patch  # for 1.0.0 -> 1.0.1
   npm version minor  # for 1.0.0 -> 1.1.0
   npm version major  # for 1.0.0 -> 2.0.0
   ```

2. **Rebuild and publish**:
```bash
npm run build
npm publish
```

## After Publishing

### Verify Installation

Test that your package can be installed via npx:

```bash
npx property-listing-generator-mcp@latest
```

### Update README

Make sure your README.md contains clear installation instructions using npx.

### Configure Claude Desktop

Update your Claude Desktop config to use the published package:

```json
{
  "mcpServers": {
    "property-listing-generator": {
      "command": "npx",
      "args": ["-y", "property-listing-generator-mcp"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Best Practices

1. **Semantic Versioning**: Follow [semver](https://semver.org/) guidelines
2. **Changelog**: Maintain a CHANGELOG.md file documenting changes
3. **Testing**: Always test before publishing
4. **Git Tags**: Tag releases in git to match NPM versions
5. **Documentation**: Keep README up to date with latest features

## Troubleshooting

### Package name already taken

If your package name is taken, you have two options:
1. Choose a different name
2. Use a scoped package: `@yourusername/property-listing-generator-mcp`

### Permission denied

Make sure you're logged in:
```bash
npm login
```

### Missing files in published package

Check your `.npmignore` and ensure all necessary files (especially the `build/` directory) are included.

## Unpublishing

If you need to unpublish a version (only within 72 hours of publishing):

```bash
npm unpublish property-listing-generator-mcp@1.0.0
```

To unpublish the entire package:
```bash
npm unpublish property-listing-generator-mcp --force
```

**Warning**: Unpublishing is discouraged. Consider deprecating instead:
```bash
npm deprecate property-listing-generator-mcp@1.0.0 "This version has been deprecated"
```

