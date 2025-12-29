import { createSlice } from "@reduxjs/toolkit";

const messsageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[]
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages=action.payload
        }
    }
})

export const {setMessages} = messsageSlice.actions
export default messsageSlice.reducer