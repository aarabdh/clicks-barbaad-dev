const fs = require('fs');
const path = require('path');

function generateImageList() {
  const imagesDirectory = path.join(process.cwd(), 'public/images');
  const outputPath = path.join(process.cwd(), 'public/images.json');
  
  // Load existing image data if it exists
  let existingImageData = [];
  try {
    existingImageData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (error) {
    console.log('No existing images.json found, creating new file');
  }
  
  // Create a map of existing images for quick lookup
  const existingImageMap = new Map(
    existingImageData.map(img => [img.name, img])
  );
  
  // Get all files in the images directory
  const currentImages = fs.readdirSync(imagesDirectory)
    .filter(file => {
      const extension = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
    });
  
  // Combine existing and new images
  const updatedImageList = currentImages.map(filename => {
    // If image already exists in our data, use that data
    if (existingImageMap.has(filename)) {
      return existingImageMap.get(filename);
    }
    // Only create new entry for new images
    return {
      name: filename,
      src: `/images/${filename}`,
      description: `Image: ${filename}` // Default description for new images
    };
  });

  // Write the updated JSON file
  fs.writeFileSync(outputPath, JSON.stringify(updatedImageList, null, 2));
  
  const newImagesCount = currentImages.length - existingImageData.length;
  console.log(`Updated images.json: ${updatedImageList.length} total images ` +
              `(${newImagesCount > 0 ? newImagesCount + ' new' : 'no new'} images)`);
}

generateImageList();