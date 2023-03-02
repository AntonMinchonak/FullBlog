import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { userType } from '../../types'
      
function getToken() {
  return  document.cookie.split(';').find(e => e.includes('token'))?.slice(6)
}

function getHeader(token: string | undefined, file: boolean = false) {
  if (!file) return new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
  })
  else return new Headers({
        'Authorization': `Bearer ${token}`,
  })
}

export interface UserStateType {
  users: userType[],
  me: userType | null | undefined,
  token: string,
}

const initialState: UserStateType = {
  users: [],
  me: null,
  token: document.cookie.split(';').find(e=>e.includes('token=')) ?? ''
}

export const fetchUsers = createAsyncThunk<userType[], {search:string|null}>('user/fetchUsers',
  async ({search}) => {
    const response = await fetch(`http://localhost:4444/users/?search=${search}`);
    let suka = await response.json()
    return suka 
  })

export const fetchMe = createAsyncThunk<userType>('user/fetchMe',
  async () => {
    const token = getToken();
    const authHeader = getHeader(token);
    
    if (!token) return null
      const response = await fetch("http://localhost:4444/auth/me", {
      method: 'GET',
      headers: authHeader
      });
    
    return await response.json() 
  })

export const fetchUser = createAsyncThunk('user/fetchUser',
  async (id: string) => {

    const response = await fetch(`http://localhost:4444/users/${id}`);
    return await response.json() 
})

export const editUser = createAsyncThunk('user/editUser',
  async (data: any) => {   
    const token = getToken()
    const authHeader = getHeader(token);
    const response = await fetch(`http://localhost:4444/users/${data._id}`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify(data)
    });
    return await response.json() 
  })

export const subscribe = createAsyncThunk('user/subscribe',
  async (data: any) => {   
    const token = getToken()
    const authHeader = getHeader(token);
    
    const response = await fetch(`http://localhost:4444/subscribe/${data._id}/?add=${data.add}`, {
      method: 'PATCH',
      headers: authHeader,
    });
    return await response.json() 
  })

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut(state) {
      const token = getToken();
      document.cookie = 'token=' + token + "; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
      state.me = null
    },
    stateSubscribe(state,action:PayloadAction<{info:userType | null, subscribed: boolean}>) {
      const newMe = state.me
      if (newMe && action.payload.subscribed) newMe.follow = newMe.follow.filter(e=>e!==action.payload.info?._id) 
      if (newMe && action.payload.info && !action.payload.subscribed) newMe.follow.push(action.payload.info._id) 
      state.me = newMe
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    })

    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.me = action.payload?._id ? action.payload : undefined
    })

  }
})

// Action creators are generated for each case reducer function
export const { logOut,stateSubscribe} = userSlice.actions

export default userSlice.reducer