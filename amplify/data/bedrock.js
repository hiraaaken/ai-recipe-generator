export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `この食材を使用した料理のレシピを提案してください: ${ingredients.join(", ")}`;

  return {
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `\n\n人間: ${prompt}\n\nAI:`
              }
            ]
          }
        ]
      }),
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);
  console.log(parsedBody);
  const res = {
    body: parsedBody
  }
  return res;
}
