import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/database';
import { User } from '../src/models/User.model';
import { Experience } from '../src/models/Experience.model';
import { uploadBase64ToCloudinary } from '../src/config/cloudinary';

dotenv.config();

const isDataUri = (s: string): boolean => typeof s === 'string' && s.startsWith('data:image');

async function migrateUsers(): Promise<number> {
  const users = await User.find({ profileImage: { $regex: /^data:image/ } });
  console.log(`\n📸 Migración de avatares: ${users.length} usuario(s) con data-URI`);

  let migrated = 0;
  for (const user of users) {
    try {
      const asset = await uploadBase64ToCloudinary(user.profileImage, 'turut/avatars');
      user.profileImage = asset.secure_url;
      user.avatarMeta = asset;
      await user.save();
      migrated++;
      console.log(`  ✅ ${user._id}: avatar → ${asset.public_id}`);
    } catch (error) {
      console.error(`  ❌ ${user._id}: fallo`, error instanceof Error ? error.message : error);
    }
  }
  return migrated;
}

async function migrateExperiences(): Promise<number> {
  const experiences = await Experience.find({
    'images': { $elemMatch: { $regex: /^data:image/ } },
  }).lean();
  console.log(`\n🖼️  Migración de imágenes de experiencias: ${experiences.length} experiencia(s)`);

  let migrated = 0;
  for (const exp of experiences) {
    const images = exp.images as string[];
    const dataUris = images.filter(isDataUri);
    if (dataUris.length === 0) continue;

    const newImages: Array<{ public_id: string; secure_url: string; width: number; height: number }> = [];
    for (const img of images) {
      if (isDataUri(img)) {
        try {
          const asset = await uploadBase64ToCloudinary(img, `turut/experiences/${exp._id}`);
          newImages.push(asset);
          migrated++;
        } catch (error) {
          console.error(`  ❌ ${exp._id}: fallo en imagen`, error instanceof Error ? error.message : error);
          newImages.push({ public_id: '', secure_url: img, width: 0, height: 0 });
        }
      } else {
        newImages.push({ public_id: '', secure_url: img, width: 0, height: 0 });
      }
    }
    await Experience.updateOne({ _id: exp._id }, { images: newImages });
    console.log(`  ✅ ${exp._id}: ${dataUris.length} imagen(es) migrada(s)`);
  }
  return migrated;
}

async function main(): Promise<void> {
  console.log('🚀 Iniciando migración de imágenes a Cloudinary...');

  await connectDB();

  const usersMigrated = await migrateUsers();
  const expMigrated = await migrateExperiences();

  await mongoose.disconnect();

  console.log('\n🎉 Migración completada:');
  console.log(`   Avatares migrados: ${usersMigrated}`);
  console.log(`   Imágenes de experiencias migradas: ${expMigrated}`);
}

main().catch((error) => {
  console.error('💀 Migración fallida:', error);
  process.exit(1);
});
