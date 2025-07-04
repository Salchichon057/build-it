import { createClient } from "@/utils/supabase/server";

export async function ensureStorageBuckets() {
  const supabase = await createClient();
  
  try {
    // Verificar/crear bucket de CVs
    const { data: cvsExists, error: cvsError } = await supabase.storage.getBucket('cvs');
    if (cvsError && cvsError.message === 'The resource was not found') {
      console.log('Creating CVs bucket...');
      const { error: createCvsError } = await supabase.storage.createBucket('cvs', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      });
      if (createCvsError) {
        console.error('Error creating CVs bucket:', createCvsError);
      } else {
        console.log('CVs bucket created successfully');
      }
    } else if (!cvsError) {
      console.log('CVs bucket already exists');
    }

    // Verificar/crear bucket de profile images
    const { data: imagesExists, error: imagesError } = await supabase.storage.getBucket('profile-image');
    if (imagesError && imagesError.message === 'The resource was not found') {
      console.log('Creating profile-image bucket...');
      const { error: createImagesError } = await supabase.storage.createBucket('profile-image', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg'],
        fileSizeLimit: 2 * 1024 * 1024 // 2MB
      });
      if (createImagesError) {
        console.error('Error creating profile-image bucket:', createImagesError);
      } else {
        console.log('Profile-image bucket created successfully');
      }
    } else if (!imagesError) {
      console.log('Profile-image bucket already exists');
    }

    // Verificar/crear bucket de project images
    const { data: projectImagesExists, error: projectImagesError } = await supabase.storage.getBucket('projects');
    if (projectImagesError && projectImagesError.message === 'The resource was not found') {
      console.log('Creating projects bucket...');
      const { error: createProjectImagesError } = await supabase.storage.createBucket('projects', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      });
      if (createProjectImagesError) {
        console.error('Error creating projects bucket:', createProjectImagesError);
      } else {
        console.log('Projects bucket created successfully');
      }
    } else if (!projectImagesError) {
      console.log('Projects bucket already exists');
    }

    return { success: true };
  } catch (error) {
    console.error('Error checking/creating buckets:', error);
    return { success: false, error };
  }
}
