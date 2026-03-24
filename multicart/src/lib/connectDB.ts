// import mongoose from "mongoose";


// const mongoDbUrl = process.env.MONGODB_URL
// if(!mongoDbUrl){
//     throw new Error("DB Error") 
// }

// let cached = global.mongoose

// if(!cached){
//     cached = global.mongoose = {conn:null,promise:null}
// }

// const connectDb = async ()=>{
//     if(cached.conn){
//         return cached.conn
//     }
//     if(!cached.promise){
//         cached.promise = mongoose.connect(mongoDbUrl).then((conn)=>conn.connection)
//     }
//     try {
//         const conn = await cached.promise
//         return conn
//     } catch (error) {
//         console.log(error)
//     }
// }

// export default connectDb

// import mongoose from "mongoose";

// const mongoDbUrl = process.env.MONGODB_URL;

// if (!mongoDbUrl) {
//   throw new Error("MONGODB_URL missing");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDb = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {

//     cached.promise = mongoose.connect(mongoDbUrl, {
//       bufferCommands: false,
//     }).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };

// export default connectDb;

import mongoose from "mongoose";

import dns from "node:dns/promises";
// Current DNS check
console.log(await dns.getServers()); // Agar 127.0.0.53 dikhe, change karo
// Set reliable DNS
dns.setServers(["1.1.1.1"]); // Cloudflare DNS

const mongoDbUrl = process.env.MONGODB_URL;

if (!mongoDbUrl) {
  throw new Error("MONGODB_URL is not defined");
}

/* ------------------ TYPE SAFE GLOBAL CACHE ------------------ */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

 //if connection have than reuse it otherwise bnao
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};
//first time save 
if (!global.mongoose) {
  global.mongoose = cached;
}

const connectDb = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoDbUrl)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDb;