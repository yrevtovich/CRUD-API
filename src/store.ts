
interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[]
}

export let store: User[] = []

const setStoreValue = (user: User) => store.push(user)

// const updateStore = ()