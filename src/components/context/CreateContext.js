import createDataContext from './createDataContext';
import Fire from '../../../Fire';

// This allows parent elements to pass information directly to farther children
const chatReducer = (state, action) => {
    //state object and the change to make to it. 
    switch (action.type) {
        case 'add':
            Fire.shared.edit(action.payload, 'add');
            return [...state, action.payload];
        case 'delete':
            Fire.shared.edit(action.payload, 'delete');
            return state.filter((chat) => chat !== action.payload);
        case 'get':
            return state
        default:
            return state;
    }
}

const getGroupChats = dispatch => {
    return async () => {
        await dispatch({ type: 'get' });
    };
};

const addGroupChat = dispatch => {
    return async (name, callback) => {
        await dispatch({ type: 'add', payload: name });
        if (callback) callback()
    };
};

// const deleteBlogPost = dispatch => {
//     return async (id) => {
//         await jsonServer.delete(`/blogPosts/${id}`);
//         dispatch({ type: 'delete', payload: id });
//     };
// };

// const editBlogPost = dispatch => {
//     return async (id, title, content, callback) => {
//         await jsonServer.put(`/blogPosts/${id}`, { title, content })
//         dispatch({ type: 'edit', payload: { id, title, content } });
//         callback();
//     };
// };

export const { Context, Provider } = createDataContext(
    chatReducer,
    { addGroupChat, getGroupChats },
    []
);