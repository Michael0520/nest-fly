import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  // Create menu items
  const menuItems = await prisma.menuItem.createMany({
    data: [
      {
        name: 'Sushi Platter',
        price: 380,
        description: 'Fresh sashimi sushi',
        cuisine: 'JAPANESE',
      },
      {
        name: 'Margherita Pizza',
        price: 320,
        description: 'Classic Italian pizza',
        cuisine: 'ITALIAN',
      },
      {
        name: 'Burger Combo',
        price: 250,
        description: 'Beef burger with fries',
        cuisine: 'GENERAL',
      },
    ],
  });

  console.log(`✅ Created ${menuItems.count} menu items`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
