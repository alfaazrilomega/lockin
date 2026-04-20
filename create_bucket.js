const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating bucket via Prisma...');
    
    // Create bucket if it doesn't exist
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
      VALUES ('attachments', 'attachments', false, 104857600, null)
      ON CONFLICT (id) DO NOTHING;
    `);
    
    console.log('Bucket created/verified.');
    
    // Add policies safely (these might error if they already exist, so we use DO block or catch)
    const policies = [
      `CREATE POLICY "Give users access to own folder insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = owner::text);`,
      `CREATE POLICY "Give users access to own folder select" ON storage.objects FOR SELECT USING (bucket_id = 'attachments' AND auth.uid()::text = owner::text);`,
      `CREATE POLICY "Give users access to own folder update" ON storage.objects FOR UPDATE USING (bucket_id = 'attachments' AND auth.uid()::text = owner::text);`,
      `CREATE POLICY "Give users access to own folder delete" ON storage.objects FOR DELETE USING (bucket_id = 'attachments' AND auth.uid()::text = owner::text);`
    ];

    for (const p of policies) {
      try {
        await prisma.$executeRawUnsafe(p);
        console.log('Added policy successfully.');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Error adding policy: ', err.message);
        } else {
          console.log('Policy already exists.');
        }
      }
    }
    
    console.log('Done!');
  } catch (err) {
    console.error('Fatal error: ', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
