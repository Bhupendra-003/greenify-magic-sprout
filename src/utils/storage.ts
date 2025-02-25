
// Function to convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Function to store image in localStorage
export const storeImage = async (file: File): Promise<string> => {
  try {
    const base64String = await fileToBase64(file);
    const imageId = `img_${Date.now()}`;
    localStorage.setItem(imageId, base64String);
    return imageId;
  } catch (error) {
    console.error('Error storing image:', error);
    throw error;
  }
};

// Function to retrieve image from localStorage
export const getImage = (imageId: string): string | null => {
  return localStorage.getItem(imageId);
};
