import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    
    // Read the static JSON file
    const dataPath = path.join(__dirname, '../frontend/src/data/products.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const { products } = JSON.parse(rawData);

    // Extract unique categories
    const categoriesMap = {};
    products.forEach(p => {
      if (p.category && !categoriesMap[p.category]) {
        categoriesMap[p.category] = {
          name: p.category.charAt(0).toUpperCase() + p.category.slice(1),
          slug: p.category.toLowerCase()
        };
      }
    });

    const categoriesArray = Object.values(categoriesMap);
    const createdCategories = await Category.insertMany(categoriesArray);
    
    console.log(`Imported ${createdCategories.length} categories.`);

    // Map products to the Mongoose schema
    const formattedProducts = products.map(p => {
      // Find category ObjectId
      const cat = createdCategories.find(c => c.slug === p.category?.toLowerCase());
      
      // Parse price (remove '$' and convert to Number)
      let parsedPrice = 0;
      if (typeof p.price === 'string') {
        parsedPrice = parseFloat(p.price.replace(/[^0-9.]/g, ''));
      } else if (typeof p.price === 'number') {
        parsedPrice = p.price;
      }

      // Format images
      const formattedImages = p.angles ? p.angles.map(a => ({
        url: a.image,
        label: a.label || 'Image'
      })) : [{ url: p.image || '', label: 'Main' }];

      return {
        name: p.name,
        brand: 'Near Plat',
        category: cat ? cat._id : null,
        type: p.type || 'Standard',
        description: p.description || 'A premium luxury item from Near Plat.',
        price: parsedPrice || 0,
        stock: 50, // Default seed stock
        images: formattedImages,
        rating: Math.round((Math.random() * (5 - 3.5) + 3.5) * 10) / 10, // random 3.5 to 5.0
        numReviews: Math.floor(Math.random() * 50)
      };
    });

    await Product.insertMany(formattedProducts);
    
    console.log(`Imported ${formattedProducts.length} products.`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
