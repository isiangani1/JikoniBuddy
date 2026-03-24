-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('cooking', 'packaging', 'delivery');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('buyer', 'seller', 'buddy', 'admin');

-- CreateEnum
CREATE TYPE "BuddyRequestStatus" AS ENUM ('open', 'matched', 'confirmed', 'completed');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('confirmed', 'completed');

-- CreateEnum
CREATE TYPE "BuddyStatus" AS ENUM ('pending', 'approved', 'active', 'suspended');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'buyer',
    "displayName" TEXT,
    "status" "BuddyStatus" NOT NULL DEFAULT 'pending',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "locationLabel" TEXT,
    "radiusKm" DOUBLE PRECISION,
    "profilePhotoUrl" TEXT,
    "idNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvailability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "UserAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuddyRequest" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "locationLabel" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "compensation" DOUBLE PRECISION,
    "status" "BuddyRequestStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuddyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuddyApplication" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "note" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuddyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuddyAssignment" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BuddyAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvailability" ADD CONSTRAINT "UserAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyApplication" ADD CONSTRAINT "BuddyApplication_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BuddyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyApplication" ADD CONSTRAINT "BuddyApplication_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyAssignment" ADD CONSTRAINT "BuddyAssignment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BuddyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyAssignment" ADD CONSTRAINT "BuddyAssignment_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BuddyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
