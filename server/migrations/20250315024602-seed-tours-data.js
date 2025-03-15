export const up = async (db) => {
    // Create tours collection if it doesn't exist
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === 'tours')) {
      await db.createCollection('tours');
    }

    // Clear existing tours
    await db.collection('tours').deleteMany({});

    // Insert sample tour data
    return db.collection('tours').insertMany([
      {
        name: 'Chợ đêm',
        price: 30000,
        description: 'Bắt đầu lúc 7:30 tối, kết thúc 12:00. Đi bộ.',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Tour du lịch tâm linh',
        price: 100000,
        description: 'Tham quan các ngôi chùa nổi tiếng trong khu vực',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Tour du lịch canh nông',
        price: 200000,
        description: 'Tham quan vườn rau thủy canh',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Đạp xe đạp ngoại ô',
        price: 300000,
        description: 'Bắt đầu lúc',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Xe buýt đêm dạo quanh thành phố',
        price: 60000,
        description: 'Đón tại khách sạn',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Cắm trại dã ngoại',
        price: 400000,
        description: 'Chỉ cung cấp vật dụng cắm trại cơ bản như lều, dây, cọc lều.',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Chèo thuyền sup ngoại ô',
        price: 299000,
        description: 'Đón tại khách sạn',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Trekking ngoại ô',
        price: 350000,
        description: 'Đi và về trong ngày',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Tour quanh thành phố 1 ngày',
        price: 200000,
        description: 'Khám phá các địa điểm nổi tiếng vào ban ngày',
        createdAt: new Date(),
        isActive: true,
      },
      {
        name: 'Tham quan nông trại cừu',
        price: 100000,
        description: 'Bắt đầu lúc 13:00 chiều.',
        createdAt: new Date(),
        isActive: true,
      },
    ]);
}

export const down = async (db) => {
    return db.collection('tours').deleteMany({});
};
