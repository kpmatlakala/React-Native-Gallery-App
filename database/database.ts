// database.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';


// Store the database instance globally to reuse it
let dbInstance: SQLite.SQLiteDatabase  | null = null;

// Open the database
const openDatabase = async (databaseName: string) => {
  if (dbInstance) 
  {
    return dbInstance;  // Return the existing database instance if already opened
  }

  const db = await SQLite.openDatabaseAsync(databaseName);
  console.log(`Database: ${databaseName} opened.`);
  dbInstance = db;  // Store the database instance
  return db;
};

// Initialize the database with necessary tables and some initial data
export const initializeDatabase = async () => {
  try {
    const db = await openDatabase('galleryApp.db');
    console.log("Attempting to initialize DB");   

    // Create table if it doesn't exist
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY NOT NULL,
        uri TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,        
        name TEXT NOT NULL,
        tag TEXT,
        album TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

// Insert an image record
export const insertImage = async (uri: string, latitude: number, longitude: number, tag: string, album: string) => {
  try 
  {
    const timestamp = new Date().getTime(); // Get current timestamp in milliseconds
    const formattedDate = format(new Date(), 'MMddyyyy_HHmmss'); // Format the timestamp
    const imageName = `Galleria_Img_${formattedDate}`; //react-native-lesson-5-img / Galleria_img

    const db = await openDatabase('galleryApp.db');
    const result = await db.runAsync(
      'INSERT INTO images (uri, latitude, longitude, name, tag, album) VALUES (?, ?, ?, ?, ?, ?)',
      uri,
      latitude,
      longitude,
      imageName,
      tag,
      album
    );
    console.log(`Image inserted with ID: ${result.lastInsertRowId}`);
  } 
  catch (error) 
  {
    console.error('Error inserting image:', error);
    throw error;
  }
};

// Get all images
export const fetchAllImages = async () => {
  try 
  {
    const db = await openDatabase('galleryApp.db');
    const rows = await db.getAllAsync('SELECT * FROM images');
    console.log('Fetched images:', rows);
    return rows;
  } 
  catch (error) 
  {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Delete an image by ID
export const deleteImageById = async (id: number) => {
  try {
    const db = await openDatabase('galleryApp.db');
    await db.runAsync('DELETE FROM images WHERE id = ?', id);
    console.log(`Image with ID: ${id} deleted.`);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Get first image (example use of `getFirstAsync`)
export const fetchFirstImage = async () => {
  try {
    const db = await openDatabase('galleryApp.db');
    const firstRow = await db.getFirstAsync('SELECT * FROM images');
    console.log('First image fetched:', firstRow);
    return firstRow;
  } catch (error) {
    console.error('Error fetching first image:', error);
    throw error;
  }
};

// Fetch images by album
export const fetchImagesByAlbum = async (album: string) => {
  try 
  {
    const db = await openDatabase('galleryApp.db');
    const rows = await db.getAllAsync('SELECT * FROM images WHERE album = ?', album);
    
    console.log('Fetched images by album:', rows);
    return rows;
  } 
  catch (error) 
  {
    console.error('Error fetching images by album:', error);
    throw error;
  }
};

// Update image record
export const updateImageUri = async (id: number, newUri: string) => {
  try {
    const db = await openDatabase('galleryApp.db');
    await db.runAsync('UPDATE images SET uri = ? WHERE id = ?', newUri, id);
    console.log(`Image with ID: ${id} updated to new URI: ${newUri}`);
  } catch (error) {
    console.error('Error updating image URI:', error);
    throw error;
  }
};


export const updateTableSchema = async () => {
  try {
    const db = await openDatabase('galleryApp.db');
    // Add the 'name' column to the 'images' table
    // await db.runAsync(`
    //   ALTER TABLE images
    //   ADD COLUMN name TEXT;
    // `);

    await db.runAsync(`
      ALTER TABLE images
      ADD COLUMN tag TEXT;
    `);
    
    // await db.runAsync(`
    //   ALTER TABLE images
    //   ADD COLUMN album TEXT;
    // `);

    console.log('Added "name", "tag", and "album" columns to images table');
  } 
  catch (error) 
  {
    console.error('Error updating table schema:', error);
    throw error;
  }
};


export const dropTable = async (tableName: string) => {
  try {
    const db = await openDatabase('galleryApp.db');
    await db.runAsync(`DROP TABLE IF EXISTS ${tableName}`);
    console.log(`Table ${tableName} dropped successfully.`);
  } catch (error) {
    console.error(`Error dropping table ${tableName}:`, error);
    throw error;
  }
};


export const deleteDatabaseFile = async () => {
  try {
    const dbFilePath = `${FileSystem.documentDirectory}sqlite/galleryApp.db`; // Path to the SQLite database
    await FileSystem.deleteAsync(dbFilePath);
    console.log('Database file deleted successfully.');
  } catch (error) {
    console.error('Error deleting database file:', error);
    throw error;
  }
};
