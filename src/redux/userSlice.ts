import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../types/UserType";

const initialState: User = {
    id: -1,
    name: "",
    email: "",
    age: -1
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        printUser: (state) => console.log(JSON.stringify(state)),
        setLoggedUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.age = action.payload.age;
        }
    }
})

export const { printUser, setLoggedUser } = userSlice.actions;
export default userSlice.reducer;