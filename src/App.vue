<script setup lang="ts">
import { ref } from "vue";
import { reactive } from "vue";

type EntryType = {
  text: "LDAP" | "Локальная";
  value: "ldap" | "local";
};

type Tag = { text: string };

type Account = {
  id: number;
  tags?: Tag[];
  entryType: "ldap" | "local";
  login: string;
  password?: string | null;
};

const entryTypes: EntryType[] = [
  { text: "LDAP", value: "ldap" },
  { text: "Локальная", value: "local" },
];

const accounts = reactive<Account[]>([
  {
    id: 0,
    tags: [{ text: "XXXX" }, { text: "XXXX" }],
    entryType: "local",
    login: "321",
    password: "123",
  },
]);
const nextId = ref(1);

const clues: string[] = [
  "Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;",
];

function parseTags(tagsString: string): Tag[] {
  if (!tagsString.trim()) return [];

  return tagsString
    .split(";")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({ text: tag }));
}

function addAccount() {
  accounts.push({
    id: nextId.value,
    tags: [],
    entryType: "local",
    login: "",
    password: "",
  });

  nextId.value++;
}

const deleteAccount = (id: number) => {
  accounts.splice(
    accounts.findIndex((account) => account.id === id),
    1
  );
};

const handleTagsBlur = (account: Account, event: Event) => {
  const input = event.target as HTMLInputElement;
  const tagsString = input.value;
  account.tags = parseTags(tagsString);
};

const handleLoginBlur = (account: Account, event: Event) => {
  const input = event.target as HTMLInputElement;
  const loginString = input.value;

  if (loginString.trim()) {
    account.login = loginString;
  }

  console.log(accounts);
};

const handlePasswordBlur = (account: Account, event: Event) => {
  const input = event.target as HTMLInputElement;
  const passwordString = input.value;

  if (account.entryType === "local" && passwordString.trim()) {
    account.password = passwordString;
  }

  console.log(accounts);
};

const handleEntryTypeChange = (account: Account, event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.value === "ldap") {
    account.password = null;
  } else {
    account.password = null;
  }

  console.log(accounts);
};
</script>

<template>
  <div class="page">
    <header class="header">
      <h1 class="header__title">Учётные записи</h1>
      <b-button class="header__btn" type="is-light" @click="addAccount"
        >+</b-button
      >
    </header>
    <div class="clues">
      <article v-for="(clue, index) in clues" :key="index" class="clue">
        <svg
          width="32px"
          height="32px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.5 1a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm1.55-8.42a1.84 1.84 0 0 0-.61-.42A2.25 2.25 0 0 0 7.53 4a2.16 2.16 0 0 0-.88.17c-.239.1-.45.254-.62.45a1.89 1.89 0 0 0-.38.62 3 3 0 0 0-.15.72h1.23a.84.84 0 0 1 .506-.741.72.72 0 0 1 .304-.049.86.86 0 0 1 .27 0 .64.64 0 0 1 .22.14.6.6 0 0 1 .16.22.73.73 0 0 1 .06.3c0 .173-.037.343-.11.5a2.4 2.4 0 0 1-.27.46l-.35.42c-.12.13-.24.27-.35.41a2.33 2.33 0 0 0-.27.45 1.18 1.18 0 0 0-.1.5v.66H8v-.49a.94.94 0 0 1 .11-.42 3.09 3.09 0 0 1 .28-.41l.36-.44a4.29 4.29 0 0 0 .36-.48 2.59 2.59 0 0 0 .28-.55 1.91 1.91 0 0 0 .11-.64 2.18 2.18 0 0 0-.1-.67 1.52 1.52 0 0 0-.35-.55zM6.8 9.83h1.17V11H6.8V9.83z"
          />
        </svg>
        <p class="clue__text">
          {{ clue }}
        </p>
      </article>
    </div>
    <main class="accounts">
      <div class="accounts__header">
        <p class="accounts__cell">Метки</p>
        <p class="accounts__cell">Тип записи</p>
        <p class="accounts__cell">Логин</p>
        <p class="accounts__cell">Пароль</p>
      </div>
      <div
        class="account"
        v-for="account in accounts"
        :key="account.id"
        :style="{
          gridTemplateColumns:
            account.entryType === 'ldap'
              ? '250px 150px auto 40px'
              : '250px 150px auto 250px 40px',
        }"
      >
        <b-field class="account__tags">
          <b-input
            :model-value="account.tags?.map((tag) => tag.text).join('; ')"
            @blur="handleTagsBlur(account, $event)"
            maxlength="50"
          ></b-input>
        </b-field>
        <b-field class="account__entryType">
          <b-select
            v-model="account.entryType"
            @change="handleEntryTypeChange(account, $event)"
          >
            <option
              v-for="entryType in entryTypes"
              :key="entryType.value"
              :value="entryType.value"
            >
              {{ entryType.text }}
            </option>
          </b-select>
        </b-field>
        <b-field class="account__login">
          <b-input
            :model-value="account.login"
            @blur="handleLoginBlur(account, $event)"
            maxlength="100"
            required
          ></b-input>
        </b-field>
        <b-field
          class="account__password"
          :style="{ display: account.entryType === 'ldap' ? 'none' : 'block' }"
        >
          <b-input
            type="password"
            :model-value="account.password"
            @blur="handlePasswordBlur(account, $event)"
            password-reveal
            maxlength="100"
            required
          >
          </b-input>
        </b-field>
        <b-button
          class="account__delete"
          type="is-danger"
          icon-right="delete"
          @click="deleteAccount(account.id)"
        ></b-button>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  padding: 40px;
  width: 1080px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__btn {
  font-size: 20px;
  padding: 10px 18px;
}

.clues {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clue {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background-color: rgb(167, 210, 212);
  border-radius: 8px;
}

.accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.accounts__header,
.account {
  display: grid;
  grid-template-columns: 250px 150px auto 250px 40px;
  gap: 10px;
}

.account__delete {
  height: 40px;
}
</style>
