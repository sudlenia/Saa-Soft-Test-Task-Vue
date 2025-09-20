import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type Tag = { text: string };

export type Account = {
  id: number;
  tags?: Tag[];
  entryType: "ldap" | "local";
  login: string;
  password: string | null;
};

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);
  const nextId = ref(1);

  function loadFromStorage() {
    const saved = localStorage.getItem("accounts");
    if (saved) {
      const parsed = JSON.parse(saved);
      accounts.value = parsed.accounts;
      nextId.value = parsed.nextId;
    }
  }

  function saveToStorage() {
    localStorage.setItem(
      "accounts",
      JSON.stringify({
        accounts: accounts.value,
        nextId: nextId.value,
      })
    );
    console.log(accounts.value);
  }

  loadFromStorage();

  function addAccount()  {
    const newAccount: Account = {
      id: nextId.value,
      tags: [],
      entryType: "local",
      login: "",
      password: "",
    };

    accounts.value.push(newAccount);
    nextId.value++;
    saveToStorage();
  };

  function deleteAccount(id: number) {
    accounts.value.splice(
      accounts.value.findIndex((account) => account.id === id),
      1
    );
    saveToStorage();
  }

  function parseTags(tagsString: string): Tag[] {
    if (!tagsString.trim()) return [];

    return tagsString
      .split(";")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => ({ text: tag }));
  }

  function updateAccount(updatedAccount: Account) {
    const index = accounts.value.findIndex(
      (account) => account.id === updatedAccount.id
    );
    accounts.value[index] = { ...updatedAccount };
    saveToStorage();
  }

  return {
    accounts: computed(() => accounts.value),
    nextId: computed(() => nextId.value),
    addAccount,
    deleteAccount,
    updateAccount,
    parseTags,
  };
});
