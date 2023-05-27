let API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAllServices() {
  let req = await fetch(API_URL + "/manage/get/all_services");
  let res = await req.json();
  return res;
}

export default getAllServices;
