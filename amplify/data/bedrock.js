export const request = (ctx) => {
  const {ingredients = []} = ctx.args;

  const prompt = `この食材を使用した料理のレシピを提案してください: ${ingredients.join(", ")}`;

  return {
    resourcePath: `/model/amazon.nova-micro-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inferenceConfig:{
          max_new_tokens: 1000,
        },
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  };
};

export const response = (ctx) => {
  // レスポンスのボディをパース
  const parsedBody = JSON.parse(ctx.result.body);

  // レシピを抽出
  const recipe = parsedBody.content;

  // レシピを返す
  return recipe;
};
