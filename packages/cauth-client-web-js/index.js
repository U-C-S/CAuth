// A boilerplate code for future development

/**
 * To check the status of the Cauth server
 * @returns {Promise<boolean>}
 */
async function CauthStatusCheck() {
  let req = fetch("/echo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello World!",
    }),
  });
  let res = await req;
  let data = await res.json();

  if (data && data.status) {
    return true;
  }
  return false;
}

export { CauthStatusCheck };
