<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { ref } from 'vue';
import outputs from "../amplify_outputs.json"
import { Schema } from '../amplify/data/resource';

Amplify.configure(outputs);
const client = generateClient<Schema>({
  authMode: "userPool",
});

const ingredients = ref('');
const recipe = ref('');
const loading = ref(false);
const error = ref('');

const generateRecipe = async () => {
  if (!ingredients.value.trim()) {
    error.value = '食材を入力してください';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const ingredientsList = ingredients.value.split(',').map(i => i.trim()).filter(i => i);
    const { data, errors } = await client.queries.askBedrock({
      ingredients: ingredientsList,
    });

    console.log(data, errors);

    if (errors) {
      error.value = errors.message;
    } else {
      recipe.value = data.askBedrock.body;
    }
  } catch (e) {
    error.value = 'レシピの生成中にエラーが発生しました';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <div class="container">
          <h1>ようこそ！AIレシピジェネレータへ！</h1>
          <p>ユーザー名: {{ user.username }}</p>

          <div class="recipe-form">
            <div class="input-group">
              <label for="ingredients">食材（カンマ区切りで入力）:</label>
              <input id="ingredients" v-model="ingredients" placeholder="例: 玉ねぎ, じゃがいも, 人参" :disabled="loading" />
            </div>

            <button @click="generateRecipe" :disabled="loading">
              {{ loading ? '生成中...' : 'レシピを生成' }}
            </button>

            <div v-if="error" class="error">
              {{ error }}
            </div>

            <div v-if="recipe" class="recipe-result">
              <h2>提案レシピ</h2>
              <div class="recipe-content">
                {{ recipe }}
              </div>
            </div>
          </div>

          <button @click="signOut" class="signout-button">サインアウト</button>
        </div>
      </template>
    </authenticator>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-form {
  margin: 20px 0;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin: 10px 0;
}

.recipe-result {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.recipe-content {
  white-space: pre-wrap;
}

.signout-button {
  background-color: #f44336;
  margin-top: 20px;
}
</style>
