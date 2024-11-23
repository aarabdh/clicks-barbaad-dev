const fs = require('fs');
const path = require('path');

function generateImageList() {
  const imagesDirectory = path.join(process.cwd(), 'public/images');
  const outputPath = path.join(process.cwd(), 'public/images.json');
  
  // Load existing image data
  let existingImageData = [];
  try {
    existingImageData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (error) {
    console.log('No existing images.json found, creating a new file.');
  }
  
  // Get all files in the images directory
  const currentImages = fs.readdirSync(imagesDirectory)
    .filter(file => {
      const extension = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
    });

  // Create a set of `src` values from existing images.json
  const existingSrcSet = new Set(existingImageData.map(img => img.src));
  
  // Add only new images to the list
  const newImages = currentImages
    .map(filename => `/images/${filename}`) // Map to src paths
    .filter(src => !existingSrcSet.has(src)) // Exclude existing images
    .map(src => ({
      name: path.basename(src), // Get the filename
      src: src,
      description: "" // Default description
    }));

  // Combine existing data with new images
  const updatedImageList = [...existingImageData, ...newImages];

  // Sort the list alphabetically by `src`
  updatedImageList.sort((a, b) => a.src.localeCompare(b.src));

  // Write the updated JSON file
  fs.writeFileSync(outputPath, JSON.stringify(updatedImageList, null, 2));
  
  console.log(`Updated images.json: ${updatedImageList.length} total images ` +
              `(${newImages.length > 0 ? newImages.length + ' new' : 'no new'} images).`);
}

generateImageList();
