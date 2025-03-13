import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Room} from 'app/actions/chatType';
import {Alert} from 'react-native';

const defaultState = [] as Room[];

interface ErrorAction {
  type: string;
  payload: {
    message: string;
  };
}

const configSlice = createSlice({
  name: 'room',
  initialState: defaultState,
  reducers: {
    create_room_success: (state, action: PayloadAction<Room>) => {
      state = [...state, action.payload];
    },
    create_room_error: (state, action: PayloadAction<ErrorAction>) => {
      const message = action.payload.payload.message;
      Alert.alert('Error', message);
    },
    trigger_room_success: (state, action: PayloadAction<Room[]>) => {
      Object.assign(state, action.payload);
    },
    cleanRoom: state => {
      state = [];
    },
  },
});

export const {
  create_room_error,
  create_room_success,
  trigger_room_success,
  cleanRoom,
} = configSlice.actions;

export const roomReducer = configSlice.reducer;
