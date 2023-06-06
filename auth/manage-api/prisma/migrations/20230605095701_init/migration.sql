-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_details" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_table" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "api_base_uri" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "service_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_table" (
    "id" SERIAL NOT NULL,
    "app_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "app_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_used_by_apps" (
    "id" SERIAL NOT NULL,
    "appTableId" INTEGER NOT NULL,
    "serviceTableId" INTEGER NOT NULL,
    "config" JSONB NOT NULL,

    CONSTRAINT "services_used_by_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyvalue" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',

    CONSTRAINT "keyvalue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_details_email_key" ON "user_details"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_details_usersId_key" ON "user_details"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "service_table_service_name_key" ON "service_table"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_table_app_name_key" ON "app_table"("app_name");

-- CreateIndex
CREATE UNIQUE INDEX "keyvalue_key_key" ON "keyvalue"("key");

-- AddForeignKey
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_table" ADD CONSTRAINT "service_table_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_table" ADD CONSTRAINT "app_table_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_used_by_apps" ADD CONSTRAINT "services_used_by_apps_appTableId_fkey" FOREIGN KEY ("appTableId") REFERENCES "app_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_used_by_apps" ADD CONSTRAINT "services_used_by_apps_serviceTableId_fkey" FOREIGN KEY ("serviceTableId") REFERENCES "service_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
