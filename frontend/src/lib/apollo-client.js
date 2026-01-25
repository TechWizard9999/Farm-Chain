const GRAPHQL_URL = "http://localhost:3010/graphql";

export async function graphqlRequest(query, variables = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("farmchain_token")
      : null;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}
