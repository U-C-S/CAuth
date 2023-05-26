let API_URL = "http://localhost:3721";

async function getAllServices() {
  let req = await fetch(API_URL + "/manage/get/all_services");
  let res = await req.json();
  return res;
}

export default getAllServices;
