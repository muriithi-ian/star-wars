import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

// App imports
import GetCharactersMock from '../../api/rest/GetCharactersMock';
import {
  getCharacters,
  searchCharacters,
  getCharactersStart,
  getCharactersSuccess,
  getCharactersFailure,
} from './CharacterActionCreators';
import CharacterActionTypes from './CharacterActionTypes';


const mockStore = configureMockStore([thunk]);

describe('getCharacters', () => {

  beforeEach(() => { moxios.install(); });
  afterEach(() => { moxios.uninstall(); });

  it(`creates ${CharacterActionTypes.GET_CHARACTERS_START}, ${CharacterActionTypes.GET_CHARACTERS_SUCCESS} after successfuly fetching characters`, () => {

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { results: GetCharactersMock } 
      });
    });

    const expectedActions = [
      getCharactersStart(),
      getCharactersSuccess(GetCharactersMock)
    ];

    const initialState = {
      characters: [],
      isFetching: false
    };
    const store = mockStore(initialState);

    return store.dispatch<any>(getCharacters()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it(`creates ${CharacterActionTypes.GET_CHARACTERS_START}, ${CharacterActionTypes.GET_CHARACTERS_FAILURE} after failing to fetch characters`, () => {

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500        
      });
    });
    
    const store = mockStore({ characters: [] });

    return store.dispatch<any>(getCharacters()).then(() => {
      
      const actions = store.getActions();
      
      expect(actions.length).toBe(2);

      const getCharactersStartAction = actions[0];
      expect(getCharactersStartAction.type).toBe(CharacterActionTypes.GET_CHARACTERS_START);
      expect(getCharactersStartAction.isFetching).toBe(true);

      const getCharactersFailureAction = actions[1];
      expect(getCharactersFailureAction.type).toBe(CharacterActionTypes.GET_CHARACTERS_FAILURE);
      expect(getCharactersFailureAction.isFetching).toBe(false);
      expect(getCharactersFailureAction.error).not.toBe(null);      
      expect(getCharactersFailureAction.error).toBeDefined();
      
    });
  });
});


describe('searchCharacters', () => {

  beforeEach(() => { moxios.install(); });
  afterEach(() => { moxios.uninstall(); });

  it(`creates ${CharacterActionTypes.GET_CHARACTERS_START}, ${CharacterActionTypes.GET_CHARACTERS_SUCCESS} after successfuly fetching characters`, () => {

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { results: GetCharactersMock } 
      });
    });

    const expectedActions = [
      getCharactersStart(),
      getCharactersSuccess(GetCharactersMock)
    ];

    const initialState = {
      characters: [],
      isFetching: false,
    };    
    const store = mockStore(initialState);

    return store.dispatch<any>(searchCharacters('Luke')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it(`creates ${CharacterActionTypes.GET_CHARACTERS_START}, ${CharacterActionTypes.GET_CHARACTERS_FAILURE} after failing to fetch characters`, () => {

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500        
      });
    });
    
    const store = mockStore({ characters: [] });

    return store.dispatch<any>(searchCharacters('Luke')).then(() => {
      
      const actions = store.getActions();
      expect(actions.length).toBe(2);

      const getCharactersStartAction = actions[0];
      expect(getCharactersStartAction.type).toBe(CharacterActionTypes.GET_CHARACTERS_START);
      expect(getCharactersStartAction.isFetching).toBe(true);

      const getCharactersFailureAction = actions[1];
      expect(getCharactersFailureAction.type).toBe(CharacterActionTypes.GET_CHARACTERS_FAILURE);
      expect(getCharactersFailureAction.isFetching).toBe(false);
      expect(getCharactersFailureAction.error).not.toBe(null); 
      expect(getCharactersFailureAction.error).toBeDefined();      

    });
  });
});