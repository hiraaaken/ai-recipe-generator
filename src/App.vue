<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json"

Amplify.configure(outputs);
</script>

<template>
  <main>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <h1>ようこそ！AIレシピジェネレータへ！</h1>
        <p>ユーザー名: {{ user.username }}</p>
        <button @click="signOut">サインアウト</button>
      </template>
    </authenticator>
  </main>
</template>

<style scoped></style>
