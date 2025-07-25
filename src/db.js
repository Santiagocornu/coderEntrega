import mongoose from 'mongoose';

const MONGO_URL = "mongodb://127.0.0.1:27017/ecommerce";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' MongoDB conectado con éxito');
  } catch (error) {
    console.error(' Error conectando a MongoDB:', error);
    process.exit(1);
  }
};
