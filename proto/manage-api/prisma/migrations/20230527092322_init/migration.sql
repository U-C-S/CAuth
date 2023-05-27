-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTable" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "api_base_uri" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppTable" (
    "id" SERIAL NOT NULL,
    "app_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "AppTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesUsedByApps" (
    "id" SERIAL NOT NULL,
    "appTableId" INTEGER NOT NULL,
    "serviceTableId" INTEGER NOT NULL,

    CONSTRAINT "ServicesUsedByApps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_name_key" ON "Users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_email_key" ON "UserDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_usersId_key" ON "UserDetails"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTable_service_name_key" ON "ServiceTable"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "AppTable_app_name_key" ON "AppTable"("app_name");

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTable" ADD CONSTRAINT "ServiceTable_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppTable" ADD CONSTRAINT "AppTable_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesUsedByApps" ADD CONSTRAINT "ServicesUsedByApps_appTableId_fkey" FOREIGN KEY ("appTableId") REFERENCES "AppTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesUsedByApps" ADD CONSTRAINT "ServicesUsedByApps_serviceTableId_fkey" FOREIGN KEY ("serviceTableId") REFERENCES "ServiceTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
