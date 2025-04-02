import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imgDir = path.join(__dirname, "../img"); // Define img directory path

// Ensure the img directory exists
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
  console.log(`Created directory: ${imgDir}`);
}

export const typeDef = `
    # Represents a file upload.
    scalar File

    extend type Mutation {
      # Uploads a file, saves it with a unique name, and returns the generated filename.
      upload(file: File!): String
    }
`;

export const resolvers = {
  // Define the File scalar resolver (required by graphql-yoga)
  // This tells GraphQL how to handle the 'File' type, but the actual processing
  // happens within the mutation resolver which receives the file object directly.
  // We don't need custom serialization/parsing here for basic uploads.
  File: {
    __serialize: () => { throw new Error("File scalar serialization not implemented."); },
    __parseValue: (value) => value, // Pass the file object through
    __parseLiteral: () => { throw new Error("File scalar literal parsing not implemented."); },
  },
  Mutation: {
    upload: async (_, { file }) => {
      try {
        // Await the file promise to get file details
        const awaitedFile = await file;
        if (!awaitedFile || !awaitedFile.name || !awaitedFile.arrayBuffer) {
            console.error("Invalid file object received:", awaitedFile);
            throw new Error("Invalid file object received for upload.");
        }

        const fileExtension = path.extname(awaitedFile.name);
        const uniqueFilename = `${uuidv4()}${fileExtension}`; // Generate unique filename
        const filePath = path.join(imgDir, uniqueFilename);

        console.log(`Attempting to save file: ${awaitedFile.name} as ${uniqueFilename} to ${filePath}`);

        const fileArrayBuffer = await awaitedFile.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(fileArrayBuffer));

        console.log(`File saved successfully: ${uniqueFilename}`);
        return uniqueFilename; // Return the generated filename

      } catch (e) {
        console.error("Cannot save uploaded file, reason: ", e);
        // Consider returning null or throwing a specific GraphQL error
        // Returning null might be better for the client to handle gracefully.
        return null;
      }
    },
  },
};
