#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@googlemaps/google-maps-services-js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PropertyData {
  address: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  price?: string;
  features?: string[];
  images?: string[];
}

interface LocalInfo {
  schools: Array<{ name: string; rating?: number; distance?: string }>;
  transport: Array<{ name: string; type: string; distance?: string }>;
  amenities: Array<{ name: string; type: string; distance?: string }>;
}

const server = new Server(
  {
    name: "property-listing-generator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Google Maps client
let mapsClient: Client | null = null;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (GOOGLE_MAPS_API_KEY) {
  mapsClient = new Client({});
}

const TOOLS: Tool[] = [
  {
    name: "generate_property_listing",
    description:
      "Generate a comprehensive property listing with AI-enhanced description, local information from Google Maps, and create a PDF brochure. Requires Google Maps API key to be configured.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Full property address including city, state, and zip code",
        },
        propertyType: {
          type: "string",
          description: "Type of property (e.g., House, Condo, Apartment, Townhouse)",
        },
        bedrooms: {
          type: "number",
          description: "Number of bedrooms",
        },
        bathrooms: {
          type: "number",
          description: "Number of bathrooms",
        },
        squareFeet: {
          type: "number",
          description: "Total square footage",
        },
        price: {
          type: "string",
          description: "Listing price (e.g., '$450,000')",
        },
        features: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of property features (e.g., 'Updated Kitchen', 'Hardwood Floors', 'Garage')",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of up to 10 image file paths (local paths to property images)",
          maxItems: 10,
        },
        outputPath: {
          type: "string",
          description: "Output path for the PDF brochure (default: './property-brochure.pdf')",
        },
      },
      required: ["address", "propertyType"],
    },
  },
  {
    name: "get_local_information",
    description:
      "Fetch local information (schools, transport, amenities) for a given address using Google Maps API. Requires Google Maps API key to be configured.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Full property address including city, state, and zip code",
        },
        radius: {
          type: "number",
          description: "Search radius in meters (default: 1609, which is 1 mile)",
        },
      },
      required: ["address"],
    },
  },
];

async function getLocalInformation(
  address: string,
  radius: number = 1609
): Promise<LocalInfo> {
  if (!mapsClient || !GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Google Maps API key not configured. Please set GOOGLE_MAPS_API_KEY environment variable."
    );
  }

  const localInfo: LocalInfo = {
    schools: [],
    transport: [],
    amenities: [],
  };

  try {
    // Geocode the address first
    const geocodeResponse = await mapsClient.geocode({
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (geocodeResponse.data.results.length === 0) {
      throw new Error("Could not geocode the provided address");
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    // Search for schools
    const schoolsResponse = await mapsClient.placesNearby({
      params: {
        location: location,
        radius: radius,
        type: "school",
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    localInfo.schools = schoolsResponse.data.results.slice(0, 5).map((place) => ({
      name: place.name || "Unknown School",
      rating: place.rating,
      distance: calculateDistance(location, place.geometry?.location),
    }));

    // Search for transit stations
    const transitResponse = await mapsClient.placesNearby({
      params: {
        location: location,
        radius: radius,
        type: "transit_station",
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    localInfo.transport = transitResponse.data.results.slice(0, 5).map((place) => ({
      name: place.name || "Unknown Station",
      type: place.types?.[0] || "transit_station",
      distance: calculateDistance(location, place.geometry?.location),
    }));

    // Search for amenities (parks, shopping, restaurants)
    const amenityTypes = ["park", "shopping_mall", "supermarket", "restaurant", "gym"];
    const amenitySearches = amenityTypes.map((type) =>
      mapsClient!.placesNearby({
        params: {
          location: location,
          radius: radius,
          type: type,
          key: GOOGLE_MAPS_API_KEY!,
        },
      })
    );

    const amenityResponses = await Promise.all(amenitySearches);
    const allAmenities: Array<{ name: string; type: string; distance?: string }> = [];

    amenityResponses.forEach((response, index) => {
      response.data.results.slice(0, 2).forEach((place) => {
        allAmenities.push({
          name: place.name || "Unknown",
          type: amenityTypes[index],
          distance: calculateDistance(location, place.geometry?.location),
        });
      });
    });

    localInfo.amenities = allAmenities.slice(0, 10);
  } catch (error: any) {
    throw new Error(`Failed to fetch local information: ${error.message}`);
  }

  return localInfo;
}

function calculateDistance(
  from: { lat: number; lng: number },
  to?: { lat: number; lng: number }
): string {
  if (!to) return "Unknown";

  const R = 3959; // Earth's radius in miles
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 0.1) {
    return `${Math.round(distance * 5280)} ft`;
  }
  return `${distance.toFixed(1)} mi`;
}

function generatePropertyDescription(
  property: PropertyData,
  localInfo?: LocalInfo
): string {
  let description = `Welcome to this exceptional ${property.propertyType.toLowerCase()} located at ${property.address}. `;

  if (property.bedrooms && property.bathrooms) {
    description += `This stunning property features ${property.bedrooms} bedroom${
      property.bedrooms > 1 ? "s" : ""
    } and ${property.bathrooms} bathroom${property.bathrooms > 1 ? "s" : ""}, `;
  }

  if (property.squareFeet) {
    description += `offering ${property.squareFeet.toLocaleString()} square feet of beautifully designed living space. `;
  }

  if (property.features && property.features.length > 0) {
    description += `\n\nKey Features:\n`;
    property.features.forEach((feature) => {
      description += `• ${feature}\n`;
    });
  }

  if (localInfo) {
    description += `\n\nLocal Highlights:\n\n`;

    if (localInfo.schools.length > 0) {
      description += `Nearby Schools:\n`;
      localInfo.schools.forEach((school) => {
        description += `• ${school.name}`;
        if (school.rating) description += ` (Rating: ${school.rating}/5)`;
        if (school.distance) description += ` - ${school.distance}`;
        description += `\n`;
      });
      description += `\n`;
    }

    if (localInfo.transport.length > 0) {
      description += `Transportation:\n`;
      localInfo.transport.forEach((transit) => {
        description += `• ${transit.name}`;
        if (transit.distance) description += ` - ${transit.distance}`;
        description += `\n`;
      });
      description += `\n`;
    }

    if (localInfo.amenities.length > 0) {
      description += `Nearby Amenities:\n`;
      localInfo.amenities.forEach((amenity) => {
        description += `• ${amenity.name} (${amenity.type.replace(/_/g, " ")})`;
        if (amenity.distance) description += ` - ${amenity.distance}`;
        description += `\n`;
      });
    }
  }

  if (property.price) {
    description += `\n\nListed at ${property.price}. Don't miss this incredible opportunity!`;
  }

  return description;
}

async function createPDFBrochure(
  property: PropertyData,
  description: string,
  localInfo: LocalInfo,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Property Listing", { align: "center" });
    doc.moveDown();

    // Property Address
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(property.address, { align: "center" });
    doc.moveDown();

    // Price
    if (property.price) {
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#006400")
        .text(property.price, { align: "center" });
      doc.fillColor("#000000");
      doc.moveDown();
    }

    // Property Details
    doc.fontSize(12).font("Helvetica");
    let details = `${property.propertyType}`;
    if (property.bedrooms) details += ` • ${property.bedrooms} Bed`;
    if (property.bathrooms) details += ` • ${property.bathrooms} Bath`;
    if (property.squareFeet)
      details += ` • ${property.squareFeet.toLocaleString()} sq ft`;
    doc.text(details, { align: "center" });
    doc.moveDown(2);

    // Images section
    if (property.images && property.images.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold").text("Property Photos");
      doc.moveDown(0.5);

      const validImages = property.images
        .filter((imgPath) => fs.existsSync(imgPath))
        .slice(0, 10);

      if (validImages.length > 0) {
        const imagesPerRow = 2;
        const imageWidth = 220;
        const imageHeight = 165;
        const spacing = 20;

        validImages.forEach((imgPath, index) => {
          if (index > 0 && index % 4 === 0) {
            doc.addPage();
            doc.moveDown();
          }

          const row = Math.floor((index % 4) / imagesPerRow);
          const col = index % imagesPerRow;
          const x = 50 + col * (imageWidth + spacing);
          const y = 50 + row * (imageHeight + spacing) + (index >= 4 ? 0 : 180);

          try {
            doc.image(imgPath, x, y, {
              width: imageWidth,
              height: imageHeight,
              fit: [imageWidth, imageHeight],
              align: "center",
              valign: "center",
            });
          } catch (error) {
            console.error(`Error adding image ${imgPath}:`, error);
          }
        });

        doc.addPage();
      }
    }

    // Description
    doc.fontSize(14).font("Helvetica-Bold").text("Property Description");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica").text(description, { align: "justify" });

    // Footer
    doc
      .moveDown(2)
      .fontSize(9)
      .font("Helvetica-Oblique")
      .text(`Generated on ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve(outputPath);
    });

    writeStream.on("error", (error) => {
      reject(error);
    });
  });
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!args) {
      throw new Error("Missing arguments");
    }

    if (name === "get_local_information") {
      const address = args.address as string;
      const radius = (args.radius as number) || 1609;

      const localInfo = await getLocalInformation(address, radius);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(localInfo, null, 2),
          },
        ],
      };
    } else if (name === "generate_property_listing") {
      const propertyData: PropertyData = {
        address: args.address as string,
        propertyType: args.propertyType as string,
        bedrooms: args.bedrooms as number | undefined,
        bathrooms: args.bathrooms as number | undefined,
        squareFeet: args.squareFeet as number | undefined,
        price: args.price as string | undefined,
        features: args.features as string[] | undefined,
        images: args.images as string[] | undefined,
      };

      const outputPath = (args.outputPath as string) || "./property-brochure.pdf";

      // Get local information
      let localInfo: LocalInfo | undefined;
      try {
        localInfo = await getLocalInformation(propertyData.address);
      } catch (error: any) {
        console.error("Warning: Could not fetch local information:", error.message);
      }

      // Generate description
      const description = generatePropertyDescription(propertyData, localInfo);

      // Create PDF brochure
      let pdfPath = "";
      try {
        pdfPath = await createPDFBrochure(
          propertyData,
          description,
          localInfo || { schools: [], transport: [], amenities: [] },
          outputPath
        );
      } catch (error: any) {
        throw new Error(`Failed to create PDF: ${error.message}`);
      }

      return {
        content: [
          {
            type: "text",
            text: `Property Listing Generated Successfully!\n\n${description}\n\n---\n\nPDF Brochure created at: ${pdfPath}\n\nThis description is ready to be copied into your CRM.`,
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Property Listing Generator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

