const path = require("node:path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

dotenv.config({ path: path.resolve(process.cwd(), "..", "..", ".env") });
if (process.env.USE_DIRECT_DATABASE_URL === "true" && process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

const prisma = new PrismaClient();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const imageFor = (label) =>
  `https://source.unsplash.com/640x480/?${encodeURIComponent(label)}`;

const TEST_BUDDY_PASSWORD = "Buddy@2026";
const TEST_ADMIN_PASSWORD = "admin@jb2026!";

const buddySeeds = [
  {
    email: "buddy01@gmail.com",
    phone: "254700000711",
    displayName: "Buddy One",
    rating: 4.8,
    lat: -1.2833,
    lng: 36.8167,
    locationLabel: "Westlands",
    skills: ["cooking", "packaging"],
    isOnline: true,
    jobsCompleted: 18,
    avgResponseMinutes: 11,
    walletBalance: 3200,
    pendingBalance: 1400
  },
  {
    email: "buddy02@gmail.com",
    phone: "254700000712",
    displayName: "Buddy Two",
    rating: 4.6,
    lat: -1.2921,
    lng: 36.7872,
    locationLabel: "Kilimani",
    skills: ["delivery", "packaging"],
    isOnline: true,
    jobsCompleted: 12,
    avgResponseMinutes: 15,
    walletBalance: 2100,
    pendingBalance: 900
  },
  {
    email: "buddy03@gmail.com",
    phone: "254700000713",
    displayName: "Buddy Three",
    rating: 4.9,
    lat: -1.2647,
    lng: 36.8026,
    locationLabel: "Parklands",
    skills: ["cooking", "delivery"],
    isOnline: false,
    jobsCompleted: 24,
    avgResponseMinutes: 9,
    walletBalance: 4500,
    pendingBalance: 1200
  },
  {
    email: "buddy04@gmail.com",
    phone: "254700000714",
    displayName: "Buddy Four",
    rating: 4.5,
    lat: -1.2865,
    lng: 36.8172,
    locationLabel: "CBD",
    skills: ["packaging", "generic"],
    isOnline: true,
    jobsCompleted: 8,
    avgResponseMinutes: 18,
    walletBalance: 1600,
    pendingBalance: 700
  },
  {
    email: "buddy05@gmail.com",
    phone: "254700000715",
    displayName: "Buddy Five",
    rating: 4.7,
    lat: -1.3004,
    lng: 36.8065,
    locationLabel: "Upper Hill",
    skills: ["delivery", "generic"],
    isOnline: false,
    jobsCompleted: 15,
    avgResponseMinutes: 13,
    walletBalance: 2900,
    pendingBalance: 1100
  },
  {
    email: "buddy06@gmail.com",
    phone: "254700000716",
    displayName: "Buddy Six",
    rating: 4.85,
    lat: -1.3219,
    lng: 36.6859,
    locationLabel: "Karen",
    skills: ["cooking", "delivery"],
    isOnline: true,
    jobsCompleted: 21,
    avgResponseMinutes: 10,
    walletBalance: 3900,
    pendingBalance: 1500
  }
];

const seed = async () => {
  const buddyPasswordHash = await bcrypt.hash(TEST_BUDDY_PASSWORD, 10);
  const adminPasswordHash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);

  const seededBuddies = [];

  for (const buddySeed of buddySeeds) {
    const buddy = await prisma.user.upsert({
      where: { email: buddySeed.email },
      update: {
        phone: buddySeed.phone,
        passwordHash: buddyPasswordHash,
        role: "buddy",
        status: "active",
        displayName: buddySeed.displayName,
        rating: buddySeed.rating,
        lat: buddySeed.lat,
        lng: buddySeed.lng,
        locationLabel: buddySeed.locationLabel,
        isAvailable: true
      },
      create: {
        email: buddySeed.email,
        phone: buddySeed.phone,
        passwordHash: buddyPasswordHash,
        role: "buddy",
        status: "active",
        displayName: buddySeed.displayName,
        rating: buddySeed.rating,
        lat: buddySeed.lat,
        lng: buddySeed.lng,
        locationLabel: buddySeed.locationLabel,
        isAvailable: true
      }
    });

    await prisma.helperProfile.upsert({
      where: { userId: buddy.id },
      update: {
        isOnline: buddySeed.isOnline,
        lat: buddySeed.lat,
        lng: buddySeed.lng,
        rating: buddySeed.rating,
        jobsCompleted: buddySeed.jobsCompleted,
        avgResponseMinutes: buddySeed.avgResponseMinutes
      },
      create: {
        userId: buddy.id,
        isOnline: buddySeed.isOnline,
        lat: buddySeed.lat,
        lng: buddySeed.lng,
        rating: buddySeed.rating,
        jobsCompleted: buddySeed.jobsCompleted,
        avgResponseMinutes: buddySeed.avgResponseMinutes
      }
    });

    await prisma.wallet.upsert({
      where: { userId_type: { userId: buddy.id, type: "buddy" } },
      update: {
        balance: buddySeed.walletBalance,
        pendingBalance: buddySeed.pendingBalance,
        currency: "KES"
      },
      create: {
        userId: buddy.id,
        type: "buddy",
        balance: buddySeed.walletBalance,
        pendingBalance: buddySeed.pendingBalance,
        currency: "KES"
      }
    });

    await prisma.userSkill.deleteMany({ where: { userId: buddy.id } });
    await prisma.userSkill.createMany({
      data: buddySeed.skills.map((taskType) => ({ userId: buddy.id, taskType }))
    });

    seededBuddies.push(buddy);
  }

  const user = seededBuddies[0];

  await prisma.user.upsert({
    where: { email: "admin@jikonibuddy.co.ke" },
    update: {
      phone: "254700009999",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
      displayName: "Jikoni Buddy Admin",
      locationLabel: "Nairobi HQ",
      isAvailable: true
    },
    create: {
      email: "admin@jikonibuddy.co.ke",
      phone: "254717700747",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
      displayName: "Jikoni Buddy Admin",
      locationLabel: "Nairobi HQ",
      isAvailable: true
    }
  });

  const sellerEmail = "seller@jikoni.buddy";
  const sellerPhone = "254700000701";
  let sellerUser = await prisma.user.findUnique({ where: { email: sellerEmail } });
  if (!sellerUser) {
    sellerUser = await prisma.user.create({
      data: {
        email: sellerEmail,
        phone: sellerPhone,
        passwordHash: buddyPasswordHash,
        role: "seller",
        status: "active",
        displayName: "Kilimani Kitchen",
        rating: 4.7,
        lat: -1.2921,
        lng: 36.7872,
        locationLabel: "Kilimani"
      }
    });
  }

  await prisma.wallet.upsert({
    where: { userId_type: { userId: sellerUser.id, type: "seller" } },
    update: {},
    create: {
      userId: sellerUser.id,
      type: "seller",
      balance: 15200,
      pendingBalance: 3200,
      currency: "KES"
    }
  });

  await prisma.buddyRequest.createMany({
    data: [
      {
        sellerId: "seller-kilimani",
        taskType: "cooking",
        locationLabel: "Kilimani",
        lat: -1.2921,
        lng: 36.7872,
        startTime: new Date("2026-03-19T15:00:00.000Z"),
        endTime: new Date("2026-03-19T17:00:00.000Z"),
        durationHours: 2,
        compensation: 1500,
        status: "open"
      },
      {
        sellerId: "seller-westlands",
        taskType: "packaging",
        locationLabel: "Westlands",
        lat: -1.2647,
        lng: 36.8026,
        startTime: new Date("2026-03-19T18:00:00.000Z"),
        endTime: new Date("2026-03-19T21:00:00.000Z"),
        durationHours: 3,
        compensation: 1200,
        status: "open"
      },
      {
        sellerId: "seller-cbd",
        taskType: "delivery",
        locationLabel: "CBD",
        lat: -1.2865,
        lng: 36.8172,
        startTime: new Date("2026-03-20T11:00:00.000Z"),
        endTime: new Date("2026-03-20T13:00:00.000Z"),
        durationHours: 2,
        compensation: 700,
        status: "open"
      },
      {
        sellerId: "seller-lavington",
        taskType: "cooking",
        locationLabel: "Lavington",
        lat: -1.2836,
        lng: 36.7726,
        startTime: new Date("2026-03-21T09:00:00.000Z"),
        endTime: new Date("2026-03-21T12:00:00.000Z"),
        durationHours: 3,
        compensation: 1800,
        status: "open"
      },
      {
        sellerId: "seller-upperhill",
        taskType: "packaging",
        locationLabel: "Upper Hill",
        lat: -1.3004,
        lng: 36.8065,
        startTime: new Date("2026-03-22T14:00:00.000Z"),
        endTime: new Date("2026-03-22T17:00:00.000Z"),
        durationHours: 3,
        compensation: 1100,
        status: "open"
      },
      {
        sellerId: "seller-kasarani",
        taskType: "delivery",
        locationLabel: "Kasarani",
        lat: -1.2287,
        lng: 36.8979,
        startTime: new Date("2026-03-23T10:00:00.000Z"),
        endTime: new Date("2026-03-23T12:00:00.000Z"),
        durationHours: 2,
        compensation: 650,
        status: "open"
      },
      {
        sellerId: "seller-karen",
        taskType: "cooking",
        locationLabel: "Karen",
        lat: -1.3219,
        lng: 36.6859,
        startTime: new Date("2026-03-24T08:00:00.000Z"),
        endTime: new Date("2026-03-24T11:00:00.000Z"),
        durationHours: 3,
        compensation: 2000,
        status: "open"
      }
    ],
    skipDuplicates: true
  });

  const openRequests = await prisma.buddyRequest.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "asc" }
  });

  if (openRequests.length > 0) {
    await prisma.buddyApplication.createMany({
      data: [
        {
          requestId: openRequests[0].id,
          helperId: user.id,
          status: "accepted",
          note: "Accepted during seed."
        },
        {
          requestId: openRequests[1]?.id ?? openRequests[0].id,
          helperId: user.id,
          status: "rejected",
          note: "Declined during seed."
        },
        {
          requestId: openRequests[2]?.id ?? openRequests[0].id,
          helperId: user.id,
          status: "pending",
          note: "Pending response."
        }
      ],
      skipDuplicates: true
    });
  }

  await prisma.job.createMany({
    data: [
      {
        buddyId: user.id,
        sellerId: "seller-amanis",
        title: "Packaging shift",
        taskType: "packaging",
        locationLabel: "Westlands",
        startTime: new Date("2026-03-19T14:00:00.000Z"),
        endTime: new Date("2026-03-19T16:00:00.000Z"),
        payAmount: 800,
        status: "in_progress"
      },
      {
        buddyId: user.id,
        sellerId: "seller-amen",
        title: "Cooking shift",
        taskType: "cooking",
        locationLabel: "Kilimani",
        startTime: new Date("2026-03-20T10:00:00.000Z"),
        endTime: new Date("2026-03-20T13:00:00.000Z"),
        payAmount: 1500,
        status: "scheduled"
      },
      {
        buddyId: user.id,
        sellerId: "seller-spice",
        title: "Delivery run",
        taskType: "delivery",
        locationLabel: "CBD",
        startTime: new Date("2026-03-15T09:00:00.000Z"),
        endTime: new Date("2026-03-15T10:00:00.000Z"),
        payAmount: 300,
        status: "completed"
      }
    ],
    skipDuplicates: true
  });

  await prisma.earning.createMany({
    data: [
      {
        userId: user.id,
        amount: 800,
        source: "M-Pesa",
        status: "paid",
        createdAt: new Date("2026-03-19T08:00:00.000Z"),
        paidAt: new Date("2026-03-19T08:30:00.000Z")
      },
      {
        userId: user.id,
        amount: 1500,
        source: "M-Pesa",
        status: "paid",
        createdAt: new Date("2026-03-17T09:00:00.000Z"),
        paidAt: new Date("2026-03-17T09:40:00.000Z")
      },
      {
        userId: user.id,
        amount: 300,
        source: "M-Pesa",
        status: "processing",
        createdAt: new Date("2026-03-18T10:00:00.000Z")
      }
    ],
    skipDuplicates: true
  });

  await prisma.payment.createMany({
    data: [
      {
        userId: user.id,
        amount: 800,
        status: "completed",
        method: "M-Pesa",
        createdAt: new Date("2026-03-19T08:20:00.000Z"),
        completedAt: new Date("2026-03-19T08:30:00.000Z")
      },
      {
        userId: user.id,
        amount: 1500,
        status: "completed",
        method: "M-Pesa",
        createdAt: new Date("2026-03-17T09:20:00.000Z"),
        completedAt: new Date("2026-03-17T09:40:00.000Z")
      }
    ],
    skipDuplicates: true
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "New cooking job",
        message: "Kilimani · 2h · KES 1,500",
        type: "job_request",
        status: "unread",
        createdAt: new Date("2026-03-19T10:00:00.000Z")
      },
      {
        userId: user.id,
        title: "Payment received",
        message: "KES 800 · 15 mins ago",
        type: "payment",
        status: "read",
        createdAt: new Date("2026-03-19T08:30:00.000Z")
      },
      {
        userId: user.id,
        title: "Support ticket opened",
        message: "Ticket JB-2042 · Payment delay",
        type: "system",
        status: "unread",
        createdAt: new Date("2026-03-18T09:15:00.000Z")
      },
      {
        userId: user.id,
        title: "Support ticket update",
        message: "Ticket JB-2041 · Awaiting response",
        type: "system",
        status: "unread",
        createdAt: new Date("2026-03-17T14:30:00.000Z")
      },
      {
        userId: user.id,
        title: "Support ticket resolved",
        message: "Ticket JB-2039 · Resolved",
        type: "system",
        status: "read",
        createdAt: new Date("2026-03-16T11:00:00.000Z")
      },
      {
        userId: user.id,
        title: "Support ticket opened",
        message: "Ticket JB-2040 · Shift conflict",
        type: "system",
        status: "read",
        createdAt: new Date("2026-03-15T10:00:00.000Z")
      },
      {
        userId: user.id,
        title: "Support ticket update",
        message: "Ticket JB-2038 · Awaiting response",
        type: "system",
        status: "read",
        createdAt: new Date("2026-03-14T10:20:00.000Z")
      }
    ],
    skipDuplicates: true
  });

  await prisma.metricSnapshot.createMany({
    data: [
      {
        userId: user.id,
        type: "acceptance_rate",
        period: "weekly",
        value: 88,
        label: "This week",
        recordedAt: new Date("2026-03-18T08:00:00.000Z")
      },
      {
        userId: user.id,
        type: "on_time_rate",
        period: "weekly",
        value: 94,
        label: "This week",
        recordedAt: new Date("2026-03-18T08:00:00.000Z")
      },
      {
        userId: user.id,
        type: "rating_quality",
        period: "weekly",
        value: 96,
        label: "This week",
        recordedAt: new Date("2026-03-18T08:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 12,
        label: "Jan",
        recordedAt: new Date("2026-01-31T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 18,
        label: "Mar",
        recordedAt: new Date("2026-03-01T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 22,
        label: "May",
        recordedAt: new Date("2026-05-01T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 30,
        label: "Jul",
        recordedAt: new Date("2026-07-01T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 28,
        label: "Sep",
        recordedAt: new Date("2026-09-01T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 40,
        label: "Nov",
        recordedAt: new Date("2026-11-01T12:00:00.000Z")
      },
      {
        userId: user.id,
        type: "requests_completed",
        period: "monthly",
        value: 43,
        label: "",
        recordedAt: new Date("2026-12-01T12:00:00.000Z")
      }
    ],
    skipDuplicates: true
  });

  const existingRatings = await prisma.rating.findMany({
    where: { helperId: user.id }
  });
  if (existingRatings.length === 0) {
    const request = await prisma.buddyRequest.create({
      data: {
        sellerId: "seller-rating",
        taskType: "packaging",
        locationLabel: "Westlands",
        lat: -1.2647,
        lng: 36.8026,
        startTime: new Date("2026-03-14T12:00:00.000Z"),
        endTime: new Date("2026-03-14T14:00:00.000Z"),
        durationHours: 2,
        compensation: 900,
        status: "completed"
      }
    });
    await prisma.rating.createMany({
      data: [
        {
          requestId: request.id,
          helperId: user.id,
          rating: 5.0,
          comment: "Fast packaging and great communication."
        },
        {
          requestId: request.id,
          helperId: user.id,
          rating: 4.8,
          comment: "Reliable arrival time and solid prep work."
        }
      ]
    });
  }

  const headerCategories = [
    "Grocery",
    "Pizza",
    "Chicken",
    "Sushi",
    "Chinese",
    "Wings",
    "Burgers",
    "Indian",
    "Soup",
    "Fast Food",
    "Sandwich",
    "Thai",
    "Korean",
    "Halal",
    "Italian",
    "Healthy",
    "Japanese",
    "Mexican",
    "BBQ",
    "Vegan",
    "Asian",
    "Seafood",
    "Bakery",
    "Vietnamese",
    "Bubble Tea",
    "Comfort Food",
    "Greek",
    "American",
    "Ice Cream",
    "Coffee",
    "Poke",
    "Salads",
    "Smoothies",
    "Breakfast",
    "Caribbean",
    "Street Food",
    "Hawaiian"
  ];

  const homeSections = [
    "Special today",
    "Fast deliveries",
    "Sellers near you",
    "Highest rated",
    "Today's offers",
    "Local legends",
    "Most viewed",
    "Great for picnics",
    "Stock up groceries"
  ];

  const taxonomyRoots = [
    "Meat",
    "Alcohol",
    "Grocery"
  ];

  const taxonomyChildren = {
    Meat: ["Beef", "Pork", "Goat", "Mutton", "Chicken", "Fish", "Rabbit"],
    Alcohol: ["Vodka", "Gin", "Whisky", "Spirits", "Wine", "Champagne"],
    Grocery: ["Fresh Produce", "Pantry", "Dairy", "Frozen", "Snacks"]
  };

  const upsertCategory = async ({ name, kind, parentId, sortOrder }) => {
    const slug = slugify(name);
    return prisma.category.upsert({
      where: { slug },
      update: {
        name,
        kind,
        parentId,
        sortOrder,
        imageUrl: imageFor(name)
      },
      create: {
        name,
        slug,
        kind,
        parentId,
        sortOrder,
        imageUrl: imageFor(name)
      }
    });
  };

  const headerRecords = [];
  for (let index = 0; index < headerCategories.length; index += 1) {
    headerRecords.push(
      await upsertCategory({
        name: headerCategories[index],
        kind: "header",
        sortOrder: index
      })
    );
  }

  for (let index = 0; index < homeSections.length; index += 1) {
    await upsertCategory({
      name: homeSections[index],
      kind: "home",
      sortOrder: index
    });
  }

  const rootRecords = {};
  for (const rootName of taxonomyRoots) {
    rootRecords[rootName] = await upsertCategory({
      name: rootName,
      kind: "taxonomy",
      sortOrder: 0
    });
  }

  for (const [rootName, children] of Object.entries(taxonomyChildren)) {
    const parent = rootRecords[rootName];
    for (let index = 0; index < children.length; index += 1) {
      await upsertCategory({
        name: children[index],
        kind: "taxonomy",
        parentId: parent.id,
        sortOrder: index
      });
    }
  }

  const ensureProductsForCategory = async (category) => {
    const existingCount = await prisma.product.count({
      where: { categoryId: category.id }
    });
    if (existingCount > 0) return;
    const products = Array.from({ length: 4 }).map((_, index) => ({
      name: `${category.name} Special ${index + 1}`,
      description: `Top pick for ${category.name.toLowerCase()}.`,
      price: 350 + index * 150,
      imageUrl: imageFor(`${category.name} dish`),
      categoryId: category.id
    }));
    await prisma.product.createMany({ data: products });
  };

  const homeCategories = await prisma.category.findMany({
    where: { kind: "home" }
  });
  for (const category of [...headerRecords, ...homeCategories]) {
    await ensureProductsForCategory(category);
  }
};

seed()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect().finally(() => process.exit(1));
  });
