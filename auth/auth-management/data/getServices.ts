let API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAllServices() {
  let req = await fetch(API_URL + "/manage/get/all_public_services");
  let res = await req.json();
  return res;
}

export interface IOwnedService {
  id: number;
  service_name: string;
  description: string;
  api_base_uri: string;
  // ServiceUsedByApps: {
  //   id: number;
  //   app_name: string;
  //   description: string;
  //   Owner: {
  //     id: number;
  //     user_name: string;
  //   };
  // };
}

async function getAllOwnedServices() {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, data: null };

  let req = await fetch(API_URL + "/manage/get/all_owned_services", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  let res = await req.json();
  return res as { success: boolean; data: IOwnedService[] };
}

async function createService(data: {
  service_name: string;
  description: string;
  api_base_uri: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, data: null };

  let req = await fetch(API_URL + "/manage/create/service", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let res = await req.json();
  return res as { success: boolean; data: IOwnedService };
}

export { getAllServices, getAllOwnedServices, createService };
