import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { InputsC } from '../../components/CreateComment'
import { CommentType, PostType } from '../../types'
import { RootState, useAppDispatch } from '../store'

export interface PostStateType {
  posts: PostType[],
  post: PostType | null,
  comments: CommentType[],
  sort: 'time' | 'views' | 'likes'
}

const initialState: PostStateType = {
  posts: [],
  post: null,
  comments: [],
  sort: 'time'
}

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

export const fetchPosts = createAsyncThunk<PostType[],{user?:string, userId?:string, search?:string|null}|undefined,{state: RootState}>('post/fetchPosts',
  async (prop, thunkAPI) => {
    const sort = thunkAPI.getState().posts.sort;
    const user = prop?.user ?? ''
    const search = prop?.search ?? ''
    
    const userId = !user && prop?.userId ? prop.userId: ''
    const page = ~~(thunkAPI.getState().posts.posts.length / 10)
    const response = await fetch(`http://localhost:4444/posts/?id=${user}&sort=${sort}&userId=${userId}&search=${search}&page=${page}`);
    return await response.json() 
  })

export const fetchPost = createAsyncThunk('post/fetchPost',
  async (id: string | null = null) => {
    const response = await fetch(`http://localhost:4444/posts/${id}`);
    return await response.json() 
  })

export const likePost = createAsyncThunk('post/likePost',
  async ({n, _id, entity}: {n:number, _id:string, entity:string}) => {
  
    const response = await fetch(`http://localhost:4444/${entity}/like/${_id}/?like=${n}`,
      {
      method: 'GET',
      headers: getHeader(getToken())
    });
    return await response.json() 
})

export const createPost = createAsyncThunk('post/createPost',
  async (data: any) => {
    const token = getToken()
    const authHeader = getHeader(token);
    if (!data.tags) delete data.tags
    
    const response = await fetch(`http://localhost:4444/posts/`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(data)
    });
    
    return await response.ok 
})

export const deletePost = createAsyncThunk('post/deletePost',
  async ({_id, entity, parent=''}: {_id:string, entity:string, parent?:string}) => {
    
    const response = await fetch(`http://localhost:4444/${entity}/${_id}/`,
      {
        method: 'DELETE',
        headers: getHeader(getToken()),
        body: JSON.stringify({id:parent})
      });
    
    return await response.json() 
})


export const uploadImg = createAsyncThunk('post/uploadImg',
  async ({data, fileName}:{data: any, fileName:string}) => {
    const token = getToken()
    const authHeader = getHeader(token, true);
    
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("image", data);

    const response = await fetch(`http://localhost:4444/upload/`, {
      method: 'POST',
      headers: authHeader,
      body: formData
    });
    
    return await response.ok 
})

export const fetchComments = createAsyncThunk('post/fetchComments',
  async (id: string) => {   
    const response = await fetch(`http://localhost:4444/comments/${id}`);
    return  await response.json() 
  })

export const createComment = createAsyncThunk('post/createComment',
  async (data:InputsC) => {   
    const token = getToken()
    const authHeader = getHeader(token);

    const response = await fetch(`http://localhost:4444/comments/${data.postId}`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(data)
    });
    return await response.json() 
  })

export const editPost = createAsyncThunk('post/editPost',
  async (data: any) => {   
    if (!data.tags.length) delete data.tags
    const token = getToken()
    const authHeader = getHeader(token);
    const response = await fetch(`http://localhost:4444/posts/${data._id}`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify(data)
    });
    return await response.json() 
  })

export const editComment = createAsyncThunk('post/editComment',
  async (data: any) => {   
    const token = getToken()
    const authHeader = getHeader(token);

    const response = await fetch(`http://localhost:4444/comments/${data._id}`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify(data)
    });
    return await response.json() 
  })

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPosts(state) {
      state.posts = []
    },
    filterComments(state, action:PayloadAction<{id:string}>) {
      const newComments = [...state.comments] 
      state.comments = newComments.filter(e => action.payload.id !== e._id)
    },
    clearComments(state) {
      state.comments = []
    },
    sortPosts(state, action:PayloadAction<{sort: 'time' | 'views' | 'likes'}>) {
      state.sort = action.payload.sort
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      // postSlice.caseReducers.clearPosts(initialState)
      if (!state.posts.length) state.posts = action.payload
      else {
        const newSet = new Set()
        state.posts.forEach(e => newSet.add(e._id))
        const addPosts = action.payload.filter(e => !newSet.has(e._id))
        state.posts = [...state.posts,...addPosts]
      }

    })
    
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.post = action.payload;
    })
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload
    })
  }
})

// Action creators are generated for each case reducer function
export const {clearPosts, filterComments,clearComments,sortPosts } = postSlice.actions

export default postSlice.reducer