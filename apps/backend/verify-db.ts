import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 驗證 PostgreSQL + Prisma 整合...\n');

  try {
    // 1. 檢查資料庫連線
    await prisma.$connect();
    console.log('✅ 資料庫連線成功');

    // 2. 檢查菜單項目
    const menuItems = await prisma.menuItem.findMany();
    console.log(`✅ 菜單項目數量: ${menuItems.length}`);
    console.log('📋 菜單內容:');
    menuItems.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ${item.name} - $${item.price} (${item.cuisine})`,
      );
    });

    // 3. 檢查訂單
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    console.log(`\n✅ 訂單數量: ${orders.length}`);
    if (orders.length > 0) {
      console.log('🛒 訂單內容:');
      orders.forEach((order, index) => {
        console.log(
          `   ${index + 1}. 客戶: ${order.customerName}, 總額: $${order.totalPrice}, 狀態: ${order.status}`,
        );
        order.orderItems.forEach((item, itemIndex) => {
          console.log(
            `      ${itemIndex + 1}. ${item.menuItem.name} x${item.quantity}`,
          );
        });
      });
    }

    // 4. 檢查表格結構
    console.log('\n🏗️  資料庫表格檢查:');
    const tableNames = ['menu_items', 'orders', 'order_items'];

    for (const tableName of tableNames) {
      try {
        const result = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = ${tableName}
          ORDER BY ordinal_position;
        `;
        console.log(
          `   ✅ ${tableName} 表格存在，包含 ${(result as any[]).length} 個欄位`,
        );
      } catch {
        console.log(`   ❌ ${tableName} 表格不存在或無法存取`);
      }
    }

    // 5. 驗證關聯關係
    console.log('\n🔗 關聯關係檢查:');
    if (orders.length > 0) {
      const orderWithItems = await prisma.order.findFirst({
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      if (orderWithItems && orderWithItems.orderItems.length > 0) {
        console.log('   ✅ Order -> OrderItem -> MenuItem 關聯正常');
      } else {
        console.log('   ⚠️  沒有訂單項目可檢查關聯');
      }
    }

    // 6. 統計資料
    const stats = await Promise.all([
      prisma.menuItem.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true } }),
    ]);

    console.log('\n📊 資料庫統計:');
    console.log(`   📋 菜單項目總數: ${stats[0]}`);
    console.log(`   🛒 訂單總數: ${stats[1]}`);
    console.log(`   💰 總營收: $${stats[2]._sum.totalPrice || 0}`);

    console.log('\n🎉 PostgreSQL + Prisma 整合驗證完成！');
  } catch (error) {
    console.error('❌ 驗證過程中發生錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
