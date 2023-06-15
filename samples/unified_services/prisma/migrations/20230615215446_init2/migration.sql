-- CreateTable
CREATE TABLE "app_data_access_info" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "scope" TEXT NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "app_data_access_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_data_access_info" ADD CONSTRAINT "app_data_access_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
