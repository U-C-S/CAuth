-- CreateTable
CREATE TABLE "user_info" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dob" TIMESTAMP(3),
    "about" TEXT,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_user_data" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "favorite_cities" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "weather_user_dataEmail" TEXT,

    CONSTRAINT "favorite_cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_info_email_key" ON "user_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weather_user_data_email_key" ON "weather_user_data"("email");

-- AddForeignKey
ALTER TABLE "favorite_cities" ADD CONSTRAINT "favorite_cities_weather_user_dataEmail_fkey" FOREIGN KEY ("weather_user_dataEmail") REFERENCES "weather_user_data"("email") ON DELETE SET NULL ON UPDATE CASCADE;
